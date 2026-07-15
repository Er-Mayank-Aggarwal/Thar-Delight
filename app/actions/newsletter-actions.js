"use server";

import { prisma } from "@/lib/prisma";

export async function subscribeToNewsletter(email) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: "Valid email is required" };
    }

    const existing = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existing) {
      return { success: true, message: "Already subscribed!" };
    }

    await prisma.newsletter.create({
      data: { email }
    });

    return { success: true, message: "Thanks for subscribing!" };
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error);
    return { success: false, error: "Subscription failed. Please try again." };
  }
}
