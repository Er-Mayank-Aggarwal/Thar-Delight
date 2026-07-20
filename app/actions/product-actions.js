"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getAllProducts() {
  return await prisma.product.findMany({
    include: {
      inventory: true,
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
      reviews: { where: { isPublished: true }, select: { rating: true } },
    }
  });
}

export async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: {
      isFeatured: true
    },
    include: {
      inventory: true,
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { where: { isPublished: true }, select: { rating: true } },
    }
  });
}

export async function getProductBySlug(slug) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      inventory: true,
      images: true,
      category: true,
      reviews: { where: { isPublished: true }, include: { user: { select: { name: true } } } }
    }
  });
}

export async function getRelatedProducts(categoryId, excludeId, limit = 3) {
  return await prisma.product.findMany({
    where: {
      categoryId: categoryId,
      id: { not: excludeId }
    },
    take: limit,
    include: {
      inventory: true,
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { where: { isPublished: true }, select: { rating: true } },
    }
  });
}

// ─── Admin CRUD ──────────────────────────────────────────────────────

export async function createProduct(data) {
  await requireAdmin();

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  try {
    const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const sku = `SKU-${slug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        price: parsed.data.price,
        sku,
        isActive: parsed.data.isActive,
        isFeatured: parsed.data.isFeatured,
        categoryId: parsed.data.categoryId,
        images: parsed.data.imageUrl ? {
          create: { url: parsed.data.imageUrl, isPrimary: true }
        } : undefined,
        inventory: {
          create: { quantity: 0, lowStockThreshold: 5 }
        }
      }
    });

    revalidatePath("/admin-controls/products");
    revalidatePath("/shop");

    return { success: true, data: product };
  } catch (error) {
    console.error("Failed to create product:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A product with this name already exists" };
    }
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id, data) {
  await requireAdmin();

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  try {
    const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        price: parsed.data.price,
        isActive: parsed.data.isActive,
        isFeatured: parsed.data.isFeatured,
        categoryId: parsed.data.categoryId,
      }
    });

    revalidatePath("/admin-controls/products");
    revalidatePath("/shop");

    return { success: true, data: product };
  } catch (error) {
    console.error("Failed to update product:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A product with this name already exists" };
    }
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id) {
  await requireAdmin();

  try {
    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin-controls/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product. It may have existing orders." };
  }
}

export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" }
  });
}
