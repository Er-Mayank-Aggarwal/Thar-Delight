"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { profileUpdateSchema, addressSchema } from "@/lib/validations";

async function getUserId() {
  const session = await getSession();
  return session?.userId || null;
}

export async function getUserProfile() {
  const userId = await getUserId();
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    });
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUserOrders() {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        history: {
          orderBy: { createdAt: "asc" }
        },
        shipment: true,
        address: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: { where: { isPrimary: true }, take: 1 }
              }
            }
          }
        }
      }
    });
    return orders;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getUserAddresses() {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { id: "asc" }
    });
    return addresses;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function updateUserProfile(formData) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  // Validate input
  const parsed = profileUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
      }
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
      return { success: false, error: "Email is already in use by another account." };
    }
    return { success: false, error: "Failed to update profile." };
  }
}

export async function addAddress(formData) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  // Validate input
  const parsed = addressSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          userId,
          fullName: formData.fullName || user.name || "Customer",
          phone: formData.phone || user.phone || "",
          addressLine1: formData.street || formData.addressLine1,
          city: parsed.data.city,
          state: parsed.data.state,
          country: formData.country || "India",
          pincode: formData.zipCode || formData.pincode,
          isDefault: formData.isDefault || false
        }
      });

      if (formData.isDefault) {
        await tx.address.updateMany({
          where: { userId, id: { not: address.id } },
          data: { isDefault: false }
        });
      }
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to add address" };
  }
}

export async function deleteAddress(addressId) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    await prisma.address.delete({
      where: { id: addressId, userId }
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to delete address" };
  }
}

export async function setDefaultAddress(addressId) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      }),
      prisma.address.update({
        where: { id: addressId, userId },
        data: { isDefault: true }
      })
    ]);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to set default address" };
  }
}
