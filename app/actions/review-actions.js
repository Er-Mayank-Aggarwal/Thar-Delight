"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitReview(data) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Please log in to submit a review" };
    }

    const parsed = reviewSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message || "Invalid review data" };
    }

    const { productId, rating, comment } = parsed.data;
    const userId = session.userId;
    
    // Check if user actually bought the product
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId,
        items: {
          some: {
            productId
          }
        }
      }
    });

    if (!hasPurchased) {
      return { success: false, error: "You can only review products you have purchased" };
    }
    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existingReview) {
      return { success: false, error: "You have already reviewed this product" };
    }

    await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
        isPublished: false // Send to moderation queue
      }
    });

    revalidatePath(`/product/[slug]`, "page");
    return { success: true, message: "Review submitted! It will appear once approved by moderation." };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}
