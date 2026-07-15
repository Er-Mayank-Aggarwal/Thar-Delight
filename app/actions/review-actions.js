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
    
    // Optional: Check if user actually bought the product
    // We'll skip that for now to make it easier to test

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
        isPublished: true // Auto-publish for now
      }
    });

    revalidatePath(`/product/[slug]`, "page");
    return { success: true, message: "Review submitted successfully!" };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}
