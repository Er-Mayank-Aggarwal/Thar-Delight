"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { placeOrderSchema } from "@/lib/validations";
import { checkoutLimiter } from "@/lib/rateLimit";
import { validateCoupon } from "./coupon-validate-actions";
import { getStoreSettings } from "./store-actions";
import { revalidatePath } from "next/cache";


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

    // 2. Preliminary inventory check (fast-fail before entering transaction)
    for (const item of cart.items) {
      const inventory = item.product.inventory;
      if (!inventory || inventory.quantity < item.quantity) {
        return { success: false, error: `Insufficient stock for: ${item.product.name} (only ${inventory?.quantity || 0} available)` };
      }
    }

    // 3. Calculate Totals (server-side, never trust client)
    const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    let discount = 0;
    let validCouponCode = null;
    if (formData.couponCode) {
      const couponRes = await validateCoupon(formData.couponCode, subtotal);
      if (couponRes.success) {
        discount = couponRes.discount;
        validCouponCode = formData.couponCode.toUpperCase();
      }
    }

    // Fetch dynamic store settings for delivery rules
    const settings = await getStoreSettings();
    const freeDeliveryThreshold = settings?.freeDeliveryAbove ?? 500;
    const baseDeliveryCharge = settings?.deliveryCharge ?? 50;

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.18; // 18% GST on discounted subtotal
    const deliveryCharge = discountedSubtotal > freeDeliveryThreshold ? 0 : baseDeliveryCharge;
    const total = discountedSubtotal + tax + deliveryCharge;


    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Begin Transaction for all write operations
    const orderId = await prisma.$transaction(async (tx) => {

      // Re-check inventory INSIDE transaction to prevent overselling
      for (const item of cart.items) {
        const freshInventory = await tx.inventory.findUnique({
          where: { productId: item.productId }
        });
        if (!freshInventory || freshInventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for: ${item.product.name} (only ${freshInventory?.quantity || 0} available)`);
        }
      }
      
      // Update coupon usage count safely inside transaction
      if (validCouponCode) {
        await tx.coupon.update({
          where: { code: validCouponCode },
          data: { timesUsed: { increment: 1 } }
        });
      }

      // 4. Handle Address
      let finalAddressId;
      if (parsed.data.addressId) {
        const existingAddress = await tx.address.findFirst({
          where: { id: parsed.data.addressId, userId }
        });
        if (!existingAddress) throw new Error("Selected address not found or invalid.");
        finalAddressId = existingAddress.id;
      } else {
        const address = await tx.address.create({
          data: {
            userId,
            fullName: `${parsed.data.firstName} ${parsed.data.lastName}`.trim() || user.name || "Customer",
            phone: parsed.data.phone || user.phone || "",
            addressLine1: parsed.data.address,
            city: parsed.data.city,
            district: parsed.data.district || null,
            landmark: parsed.data.landmark || null,
            state: parsed.data.state,
            country: "India",
            pincode: parsed.data.zipCode,
            isDefault: parsed.data.saveAddress || false
          }
        });
        finalAddressId = address.id;

        if (parsed.data.saveAddress) {
          await tx.address.updateMany({
            where: { userId, id: { not: address.id } },
            data: { isDefault: false }
          });
        }
      }

      // 5. Create the Order
      const order = await tx.order.create({
        data: {
          userId: userId,
          addressId: finalAddressId,
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
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            quantity: { decrement: item.quantity },
          }
        });
      }

      // 7. Clear the Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return order.id;
    });


    // Revalidate account page so order history is immediately fresh
    revalidatePath("/account");

    return { success: true, orderId: orderId };
  } catch (error) {
    console.error("Failed to place order:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}
