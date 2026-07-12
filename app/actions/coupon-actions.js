"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { couponSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getAllCoupons() {
  await requireAdmin();

  return await prisma.coupon.findMany({
    orderBy: { code: "asc" }
  });
}

export async function createCoupon(data) {
  await requireAdmin();

  const parsed = couponSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: parsed.data.code.toUpperCase(),
        discountType: parsed.data.discountType,
        value: parsed.data.value,
        minimumOrder: parsed.data.minimumOrder || null,
        maximumDiscount: parsed.data.maximumDiscount || null,
        usageLimit: parsed.data.usageLimit || null,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        isActive: parsed.data.isActive,
      }
    });

    revalidatePath("/admin-controls/coupons");
    return { success: true, data: coupon };
  } catch (error) {
    console.error("Failed to create coupon:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A coupon with this code already exists" };
    }
    return { success: false, error: "Failed to create coupon" };
  }
}

export async function updateCoupon(id, data) {
  await requireAdmin();

  const parsed = couponSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  try {
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: parsed.data.code.toUpperCase(),
        discountType: parsed.data.discountType,
        value: parsed.data.value,
        minimumOrder: parsed.data.minimumOrder || null,
        maximumDiscount: parsed.data.maximumDiscount || null,
        usageLimit: parsed.data.usageLimit || null,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        isActive: parsed.data.isActive,
      }
    });

    revalidatePath("/admin-controls/coupons");
    return { success: true, data: coupon };
  } catch (error) {
    console.error("Failed to update coupon:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A coupon with this code already exists" };
    }
    return { success: false, error: "Failed to update coupon" };
  }
}

export async function deleteCoupon(id) {
  await requireAdmin();

  try {
    await prisma.coupon.delete({ where: { id } });

    revalidatePath("/admin-controls/coupons");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return { success: false, error: "Failed to delete coupon" };
  }
}

export async function toggleCoupon(id) {
  await requireAdmin();

  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return { success: false, error: "Coupon not found" };

    await prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive }
    });

    revalidatePath("/admin-controls/coupons");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle coupon:", error);
    return { success: false, error: "Failed to toggle coupon" };
  }
}
