"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitReview(data) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Please log in to submit a review" };
    }

    const { productId, rating, comment } = data;
    const userId = session.userId;

    if (!rating || rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }
    
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
