"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getRecentSales = unstable_cache(
  async () => {
    try {
      const recentOrders = await prisma.order.findMany({
        where: {
          orderStatus: {
            notIn: ["CANCELLED", "RETURNED"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          user: { select: { name: true } },
          address: { select: { city: true } },
          items: {
            take: 1,
            include: {
              product: { select: { name: true, images: { take: 1, where: { isPrimary: true } } } },
            },
          },
        },
      });

      return recentOrders.map((order) => {
        const firstName = order.user?.name?.split(" ")[0] || "Someone";
        const city = order.address?.city ? `from ${order.address.city}` : "";
        const productName = order.items[0]?.product?.name || "a product";
        const imageUrl = order.items[0]?.product?.images[0]?.url || null;

        return {
          id: order.id,
          firstName,
          city,
          productName,
          imageUrl,
          timestamp: order.createdAt.toISOString(),
        };
      });
    } catch (error) {
      console.error("Failed to fetch recent sales:", error);
      return [];
    }
  },
  ["recent-sales-popup"],
  { revalidate: 300 } // Cache for 5 minutes to avoid spamming the DB
);
