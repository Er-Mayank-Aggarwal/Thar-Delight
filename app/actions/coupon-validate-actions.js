"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function validateCoupon(code, subtotal) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Please log in to apply a coupon" };
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return { success: false, error: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { success: false, error: "This coupon is no longer active" };
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { success: false, error: "This coupon has expired" };
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return { success: false, error: "This coupon has reached its usage limit" };
    }

    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
      return { success: false, error: `Minimum order amount for this coupon is ₹${coupon.minimumOrder}` };
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * coupon.value) / 100;
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    // Ensure we don't discount more than the subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return { 
      success: true, 
      discount: discountAmount,
      couponCode: coupon.code,
      message: "Coupon applied successfully!"
    };

  } catch (error) {
    console.error("Failed to validate coupon:", error);
    return { success: false, error: "Failed to validate coupon" };
  }
}
