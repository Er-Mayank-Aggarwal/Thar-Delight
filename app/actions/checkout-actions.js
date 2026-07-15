"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { placeOrderSchema } from "@/lib/validations";
import { checkoutLimiter } from "@/lib/rateLimit";
import { validateCoupon } from "./coupon-validate-actions";

export async function placeOrder(formData) {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "You must be logged in to checkout." };
    }

    const userId = session.userId;

    // Rate limit
    const rl = checkoutLimiter.check(userId);
    if (!rl.allowed) {
      return { success: false, error: "Too many checkout attempts. Please try again later." };
    }

    // Validate input
    const parsed = placeOrderSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return { success: false, error: firstError };
    }

    // 1. Fetch the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: { include: { inventory: true } } } } }
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // 2. Check inventory for all items
    const outOfStockItems = [];
    for (const item of cart.items) {
      const inventory = item.product.inventory;
      if (!inventory || inventory.quantity < item.quantity) {
        outOfStockItems.push({
          name: item.product.name,
          available: inventory?.quantity || 0,
          requested: item.quantity,
        });
      }
    }

    if (outOfStockItems.length > 0) {
      const itemNames = outOfStockItems.map(
        (i) => `${i.name} (only ${i.available} available)`
      ).join(", ");
      return { success: false, error: `Insufficient stock for: ${itemNames}` };
    }

    // 3. Calculate Totals (server-side, never trust client)
    const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    let discount = 0;
    if (formData.couponCode) {
      const couponRes = await validateCoupon(formData.couponCode, subtotal);
      if (couponRes.success) {
        discount = couponRes.discount;
        
        // Update coupon usage count
        await prisma.coupon.update({
          where: { code: formData.couponCode.toUpperCase() },
          data: { timesUsed: { increment: 1 } }
        });
      }
    }

    const tax = (subtotal - discount) * 0.18; // 18% GST on discounted subtotal
    const deliveryCharge = (subtotal - discount) > 500 ? 0 : 50;
    const total = subtotal - discount + tax + deliveryCharge;

    // 4. Handle Address
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    const address = await prisma.address.create({
      data: {
        userId,
        fullName: `${parsed.data.firstName} ${parsed.data.lastName}`.trim() || user.name || "Customer",
        phone: parsed.data.phone || user.phone || "",
        addressLine1: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state,
        country: "India",
        pincode: parsed.data.zipCode,
        isDefault: parsed.data.saveAddress || false
      }
    });

    if (parsed.data.saveAddress) {
      await prisma.address.updateMany({
        where: { userId, id: { not: address.id } },
        data: { isDefault: false }
      });
    }

    // 5. Create the Order
    const order = await prisma.order.create({
      data: {
        userId: userId,
        addressId: address.id,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        subtotal,
        tax,
        deliveryCharge,
        discount,
        total,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    // 6. Decrement inventory
    for (const item of cart.items) {
      await prisma.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: { decrement: item.quantity },
        }
      });
    }

    // 7. Clear the Cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to place order:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}
