import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getProductBySlugCached = cache(async (slug) => {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        inventory: true,
        images: true,
        category: true,
        reviews: { where: { isPublished: true }, include: { user: { select: { name: true } } } }
      }
    });
  } catch (error) {
    console.warn("Failed to fetch cached product by slug:", error?.message || error);
    return null;
  }
});
