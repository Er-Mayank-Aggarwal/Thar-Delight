"use server";

import { prisma } from "@/lib/prisma";

export async function trackOrderPublic(identifier) {
  if (!identifier || typeof identifier !== "string" || identifier.trim().length < 4) {
    return { success: false, error: "Please enter a valid Order ID (e.g. cm... or 8 characters) or 10-digit Phone Number." };
  }

  const clean = identifier.trim().replace(/^#/, "");

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: clean },
          { id: { startsWith: clean } },
          { address: { phone: clean } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        shipment: true,
        history: {
          orderBy: { createdAt: "asc" },
        },
        address: {
          select: {
            city: true,
            state: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "No order found matching your search. Please check your Order ID or phone number." };
    }

    return {
      success: true,
      order: {
        id: order.id,
        shortId: order.id.slice(0, 8).toUpperCase(),
        createdAt: order.createdAt.toISOString(),
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        destination: `${order.address?.city || ""}, ${order.address?.state || ""}`.trim().replace(/^,\s*/, ""),
        items: order.items.map((i) => ({
          name: i.product?.name || "Product",
          quantity: i.quantity,
          image: i.product?.images?.[0]?.url || "",
        })),
        shipment: order.shipment
          ? {
              courierName: order.shipment.courierName,
              trackingNumber: order.shipment.trackingNumber,
              estimatedDate: order.shipment.estimatedDate?.toISOString() || null,
              deliveredAt: order.shipment.deliveredAt?.toISOString() || null,
            }
          : null,
        history: order.history.map((h) => ({
          status: h.status,
          date: h.createdAt.toISOString(),
        })),
      },
    };
  } catch (err) {
    console.error("Public tracking error:", err);
    return { success: false, error: "Failed to look up order. Please try again later." };
  }
}

