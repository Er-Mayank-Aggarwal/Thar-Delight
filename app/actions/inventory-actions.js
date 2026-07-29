"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { stockUpdateSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getAllInventory() {
  await requireAdmin();

  return await prisma.inventory.findMany({
    include: {
      product: {
        select: {
          name: true,
          category: true,
          images: { where: { isPrimary: true }, take: 1 },
        }
      }
    },
    orderBy: {
      product: { name: 'asc' }
    }
  });
}

export async function updateStock(productId, newStock) {
  await requireAdmin();

  // Validate input
  const parsed = stockUpdateSchema.safeParse({ productId, newStock });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  try {
    const currentInv = await prisma.inventory.findUnique({
      where: { productId: parsed.data.productId }
    });

    if (!currentInv) {
      return { success: false, error: "Inventory record not found for this product" };
    }

    const updated = await prisma.inventory.update({
      where: { productId: parsed.data.productId },
      data: {
        quantity: parsed.data.newStock,
      }
    });

    // Revalidate the inventory page so it reflects new data
    revalidatePath("/admin-controls/inventory");
    revalidatePath("/shop");
    revalidatePath("/product/[slug]", "page");

    
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update stock:", error);
    return { success: false, error: "Failed to update stock" };
  }
}
