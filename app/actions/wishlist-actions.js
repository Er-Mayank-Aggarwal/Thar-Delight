"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Please log in to add to wishlist" };
    }

    const userId = session.userId;

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      revalidatePath("/shop");
      return { success: true, added: false };
    } else {
      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          userId,
          productId
        }
      });
      revalidatePath("/shop");
      return { success: true, added: true };
    }
  } catch (error) {
    console.error("Failed to toggle wishlist:", error);
    return { success: false, error: "Failed to update wishlist" };
  }
}

export async function getWishlist() {
  try {
    const session = await getSession();
    if (!session) return [];

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.userId },
      select: { productId: true }
    });

    return wishlist.map(w => w.productId);
  } catch (error) {
    console.error("Failed to get wishlist:", error);
    return [];
  }
}
