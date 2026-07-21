import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getProductBySlugCached = cache(async (slug) => {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      inventory: true,
      images: true,
      category: true,
      reviews: { where: { isPublished: true }, include: { user: { select: { name: true } } } }
    }
  });
});
