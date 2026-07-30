"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { productSchema } from "@/lib/validations";
import { revalidatePath, unstable_cache } from "next/cache";

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
  const featured = await prisma.product.findMany({
    where: {
      isFeatured: true
    },
    include: {
      inventory: true,
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
      reviews: { where: { isPublished: true }, select: { rating: true } },
    }
  });

  if (featured.length < 4) {
    const extra = await prisma.product.findMany({
      where: {
        id: { notIn: featured.map(p => p.id) }
      },
      take: 4 - featured.length,
      include: {
        inventory: true,
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        reviews: { where: { isPublished: true }, select: { rating: true } },
      }
    });
    return [...featured, ...extra];
  }

  return featured;
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
        images: (parsed.data.imageUrls && parsed.data.imageUrls.length > 0) ? {
          create: parsed.data.imageUrls.filter(url => url.trim() !== "").map((url, index) => ({
            url: url.trim(),
            isPrimary: index === 0
          }))
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
        ...(parsed.data.imageUrls !== undefined ? {
          images: {
            deleteMany: {},
            ...(parsed.data.imageUrls.length > 0 ? {
              create: parsed.data.imageUrls.filter(url => url.trim() !== "").map((url, index) => ({
                url: url.trim(),
                isPrimary: index === 0
              }))
            } : {})
          }
        } : {})
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

export const getAllCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
  },
  ["all-categories"],
  { revalidate: 3600 }
);

export async function getCategoriesWithProductCount() {
  const dbCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: "asc" }
  });
  return dbCategories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    productCount: c._count.products,
  }));
}



export async function getHeroProductRatings(slugs) {
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: {
      id: true,
      slug: true,
      price: true,
      originalPrice: true,
      inventory: true,
      reviews: { where: { isPublished: true }, select: { rating: true } }
    }
  });
  return products.map(p => ({
    id: p.id,
    slug: p.slug,
    price: p.price ? Number(p.price.toString()) : 0,
    originalPrice: p.originalPrice ? Number(p.originalPrice.toString()) : null,
    inventory: p.inventory,
    count: p.reviews.length,
    avg: p.reviews.length > 0
      ? (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
      : "0.0"
  }));
}

export async function getHeroProducts(limit = 6) {
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: limit,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      inventory: true,
      category: true,
      reviews: { where: { isPublished: true }, select: { rating: true } },
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" }
    ]
  });

  return dbProducts.map((p) => {
    const reviewCount = p.reviews.length;
    const avgRating = reviewCount > 0
      ? (p.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
      : "0.0";

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price ? Number(p.price.toString()) : 0,
      originalPrice: p.originalPrice ? Number(p.originalPrice.toString()) : null,
      shortDescription: p.description || "",
      category: p.category?.slug || p.category?.name || "millet-cookies",
      image: p.images[0]?.url || "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395003/thar-delight/placeholder.jpg",
      rating: parseFloat(avgRating),
      reviews: reviewCount,
      inventory: p.inventory,
      inStock: (p.inventory?.quantity ?? 999) > 0,
    };
  });
}


