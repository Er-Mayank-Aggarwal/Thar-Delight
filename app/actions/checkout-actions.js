"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { placeOrderSchema } from "@/lib/validations";
import { checkoutLimiter } from "@/lib/rateLimit";
import { validateCoupon } from "./coupon-validate-actions";
import { getStoreSettings } from "./store-actions";
import { revalidatePath } from "next/cache";
import { getRazorpayClient, verifyPaymentSignature } from "@/lib/razorpay";

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

    const paymentMethod = parsed.data.paymentMethod || "ONLINE";

    // 1. Fetch the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: { include: { inventory: true } } } } },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // 2. Preliminary inventory check (fast-fail before entering transaction)
    for (const item of cart.items) {
      const inventory = item.product.inventory;
      if (!inventory || inventory.quantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for: ${item.product.name} (only ${inventory?.quantity || 0} available)`,
        };
      }
    }

    // 3. Calculate Totals (server-side, never trust client)
    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

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
    const freeDeliveryThreshold = settings?.freeDeliveryAbove ?? 1000;
    const baseDeliveryCharge = settings?.deliveryCharge ?? 100;

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.18; // 18% GST on discounted subtotal
    const deliveryCharge = discountedSubtotal > freeDeliveryThreshold ? 0 : baseDeliveryCharge;
    const total = discountedSubtotal + tax + deliveryCharge;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const initialOrderStatus = paymentMethod === "COD" ? "CONFIRMED" : "PENDING";

    // Begin Transaction for all write operations
    const orderId = await prisma.$transaction(async (tx) => {
      // Re-check inventory INSIDE transaction to prevent overselling
      for (const item of cart.items) {
        const freshInventory = await tx.inventory.findUnique({
          where: { productId: item.productId },
        });
        if (!freshInventory || freshInventory.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for: ${item.product.name} (only ${freshInventory?.quantity || 0} available)`
          );
        }
      }

      // Update coupon usage count safely inside transaction
      if (validCouponCode) {
        await tx.coupon.update({
          where: { code: validCouponCode },
          data: { timesUsed: { increment: 1 } },
        });
      }

      // 4. Handle Address
      let finalAddressId;
      if (parsed.data.addressId) {
        const existingAddress = await tx.address.findFirst({
          where: { id: parsed.data.addressId, userId },
        });
        if (!existingAddress) throw new Error("Selected address not found or invalid.");
        finalAddressId = existingAddress.id;
      } else {
        const address = await tx.address.create({
          data: {
            userId,
            fullName:
              `${parsed.data.firstName} ${parsed.data.lastName || ""}`.trim() || user?.name || "Customer",
            phone: parsed.data.phone || user?.phone || "",
            addressLine1: parsed.data.address,
            city: parsed.data.city,
            district: parsed.data.district || null,
            landmark: parsed.data.landmark || null,
            state: parsed.data.state,
            country: "India",
            pincode: parsed.data.zipCode,
            isDefault: parsed.data.saveAddress || false,
          },
        });
        finalAddressId = address.id;

        if (parsed.data.saveAddress) {
          await tx.address.updateMany({
            where: { userId, id: { not: address.id } },
            data: { isDefault: false },
          });
        }
      }

      // 5. Create the Order with linked Payment record
      const order = await tx.order.create({
        data: {
          userId,
          addressId: finalAddressId,
          orderStatus: initialOrderStatus,
          paymentStatus: "PENDING",
          subtotal,
          tax,
          deliveryCharge,
          discount,
          total,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
          payment: {
            create: {
              paymentMethod,
              amount: total,
              status: "PENDING",
            },
          },
          history: {
            create: {
              status: initialOrderStatus,
            },
          },
        },
      });

      // 6. Decrement inventory
      for (const item of cart.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            quantity: { decrement: item.quantity },
          },
        });
      }

      // 7. Clear the Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order.id;
    });

    // Revalidate account page so order history is immediately fresh
    revalidatePath("/account");
    revalidatePath("/admin-controls/orders");
    revalidatePath("/admin-controls/inventory");

    // Handle Online Payment (Razorpay)
    if (paymentMethod === "ONLINE") {
      const razorpay = getRazorpayClient();
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";

      if (!razorpay || !keyId) {
        // If merchant keys aren't configured yet, fallback gracefully
        return {
          success: true,
          orderId,
          isPrepaid: false,
          warning: "Payment gateway is in test mode. Order placed as Pending payment.",
        };
      }

      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(total * 100), // amount in paise
          currency: "INR",
          receipt: `rcpt_${orderId.slice(0, 18)}`,
          notes: {
            orderId,
            userId,
          },
        });

        // Store the Razorpay order ID in the Payment record to bind the order cryptographically
        await prisma.payment.updateMany({
          where: { orderId },
          data: { transactionId: razorpayOrder.id },
        });

        return {
          success: true,
          orderId,
          isPrepaid: true,
          razorpayOrder,
          keyId,
          amount: total,
        };
      } catch (rzpErr) {
        console.error("Razorpay order creation failed:", rzpErr);
        return {
          success: false,
          error: "Could not initiate payment gateway. Please try again.",
        };
      }
    }

    // COD Order
    return {
      success: true,
      orderId,
      isPrepaid: false,
    };
  } catch (error) {
    console.error("Failed to place order:", error);
    return { success: false, error: error.message || "Failed to place order. Please try again." };
  }
}

export async function verifyPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Authentication required" };
    }

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return { success: false, error: "Invalid payment verification parameters" };
    }

    // Verify order exists and belongs to current user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const isAdminOrOwner = session.role === "ADMIN" || session.role === "OWNER";
    if (order.userId !== session.userId && !isAdminOrOwner) {
      return { success: false, error: "Unauthorized access to order" };
    }

    // Idempotency: already marked paid (e.g. via webhook)
    if (order.paymentStatus === "SUCCESS") {
      return { success: true };
    }

    // Bind verification: ensure razorpayOrderId matches the one created for this order
    if (order.payment?.transactionId && order.payment.transactionId !== razorpayOrderId) {
      return { success: false, error: "Razorpay order ID mismatch" };
    }

    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      return { success: false, error: "Payment signature verification failed." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "SUCCESS",
          orderStatus: "CONFIRMED",
        },
      });

      await tx.payment.upsert({
        where: { orderId },
        update: {
          status: "SUCCESS",
          transactionId: razorpayPaymentId,
        },
        create: {
          orderId,
          paymentMethod: "ONLINE",
          amount: order.total,
          status: "SUCCESS",
          transactionId: razorpayPaymentId,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: "CONFIRMED",
        },
      });
    });

    revalidatePath("/account");
    revalidatePath(`/invoice/${orderId}`);
    revalidatePath("/admin-controls/orders");

    return { success: true };
  } catch (error) {
    console.error("Payment verification failed:", error);
    return { success: false, error: "Failed to verify payment." };
  }
}
