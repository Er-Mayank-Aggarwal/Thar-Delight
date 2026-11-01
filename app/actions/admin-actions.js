"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { orderStatusSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getAdminOrders() {
  await requireAdmin();

  const dbOrders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } }, address: true, payment: true },
    orderBy: { createdAt: "desc" }
  });

  return dbOrders.map(o => ({
    id: o.id, // Full ID for updates
    displayId: o.id.slice(0, 8).toUpperCase(),
    customer: {
      name: o.user?.name || "Guest",
      email: o.user?.email || "N/A",
      phone: o.address?.phone || "N/A",
      address: o.address?.city || "N/A"
    },
    date: o.createdAt.toISOString().split('T')[0],
    time: o.createdAt.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata",  timeZone: "Asia/Kolkata",  hour: "2-digit", minute: "2-digit" }),
    total: o.total,
    status: o.orderStatus.toLowerCase(),
    paymentMethod: o.payment?.paymentMethod || "COD", 
    items: o.items.map(i => ({
      name: i.product.name,
      qty: i.quantity,
      price: i.price
    }))
  }));
}

export async function getAdminCustomers() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    include: { orders: true, addresses: true }
  });

  return users.map(u => ({
    id: u.id,
    name: u.name || "Guest",
    email: u.email || "N/A",
    phone: u.phone || "N/A",
    role: u.role,
    city: u.addresses?.[0]?.city || "N/A",
    joinedDate: u.createdAt.toISOString(),
    lastOrderDate: u.orders.length > 0 
      ? u.orders.sort((a,b) => b.createdAt - a.createdAt)[0].createdAt.toISOString() 
      : u.createdAt.toISOString(),
    totalOrders: u.orders.length,
    totalSpent: u.orders.reduce((sum, o) => sum + o.total, 0)
  }));
}

export async function getAdminReviews() {
  await requireAdmin();

  const reviews = await prisma.review.findMany({
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" }
  });

  return reviews.map(r => ({
    id: r.id,
    product: { name: r.product.name },
    customer: { name: r.user?.name || "Guest" },
    rating: r.rating,
    comment: r.comment || "",
    date: r.createdAt.toISOString().split('T')[0],
    isApproved: r.isPublished
  }));
}

export async function approveReview(id) {
  await requireAdmin();
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { isPublished: true },
      include: { product: true }
    });
    if (review.product && review.product.slug) {
      revalidatePath(`/product/${review.product.slug}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to approve review:", error);
    return { success: false, error: "Failed to approve review" };
  }
}

export async function deleteReview(id) {
  await requireAdmin();
  try {
    const review = await prisma.review.delete({
      where: { id },
      include: { product: true }
    });
    if (review.product && review.product.slug) {
      revalidatePath(`/product/${review.product.slug}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  await requireAdmin();

  // Validate input
  const parsed = orderStatusSchema.safeParse({ orderId, newStatus: newStatus.toUpperCase() });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const { orderId: targetOrderId, newStatus: statusToSet } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: targetOrderId },
        include: { items: true },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      const prevStatus = order.orderStatus;
      if (prevStatus === statusToSet) {
        return;
      }

      const isCancellingOrReturning = ["CANCELLED", "RETURNED"].includes(statusToSet);
      const wasCancelledOrReturned = ["CANCELLED", "RETURNED"].includes(prevStatus);

      // If moving TO Cancelled/Returned from an active status -> RESTOCK inventory
      if (isCancellingOrReturning && !wasCancelledOrReturned) {
        for (const item of order.items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              quantity: { increment: item.quantity },
            },
          });
        }
      }

      // If moving FROM Cancelled/Returned back to an active status -> DEDUCT inventory again
      if (!isCancellingOrReturning && wasCancelledOrReturned) {
        for (const item of order.items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              quantity: { decrement: item.quantity },
            },
          });
        }
      }

      // Update order status
      await tx.order.update({
        where: { id: targetOrderId },
        data: { orderStatus: statusToSet },
      });

      // Create status history record
      await tx.orderStatusHistory.create({
        data: {
          orderId: targetOrderId,
          status: statusToSet,
        },
      });
    });

    revalidatePath("/account");
    revalidatePath("/admin-controls/orders");
    revalidatePath("/admin-controls/inventory");

    return { success: true };

  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: error.message || "Failed to update order status" };
  }
}

export async function updateCustomerRole(userId, newRole) {
  await requireAdmin();

  if (!["CUSTOMER", "ADMIN", "OWNER"].includes(newRole)) {
    return { success: false, error: "Invalid role" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update role:", error);
    return { success: false, error: "Failed to update role" };
  }
}

export async function getAdminContactMessages() {
  await requireAdmin();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return messages.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone || "N/A",
    subject: m.subject || "N/A",
    message: m.message,
    date: m.createdAt.toISOString()
  }));
}

export async function getNewsletterSubscribers() {
  await requireAdmin();

  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" }
  });

  return subscribers.map(s => ({
    id: s.id,
    email: s.email,
    date: s.createdAt.toISOString()
  }));
}
