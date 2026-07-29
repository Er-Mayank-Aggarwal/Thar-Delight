"use server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";
import { newsletterLimiter } from "@/lib/rateLimit";

export async function subscribeToNewsletter(rawEmail) {
  try {
    const parsed = newsletterSchema.safeParse({ email: rawEmail });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message || "Valid email is required" };
    }

    const email = parsed.data.email.toLowerCase();

    // Rate limiting check
    const rl = newsletterLimiter.check(email);
    if (!rl.allowed) {
      return { success: false, error: "Too many subscription attempts. Please try again later." };
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

