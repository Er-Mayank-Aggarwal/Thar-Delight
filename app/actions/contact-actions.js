"use server";

import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validations";
import { contactLimiter } from "@/lib/rateLimit";

export async function submitContactMessage(data) {
  try {
    const parsed = contactMessageSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
    }

    const { name, email, phone, subject, message } = parsed.data;

    // Rate limiting check based on email
    const rl = contactLimiter.check(email.toLowerCase());
    if (!rl.allowed) {
      return { success: false, error: "Too many messages sent. Please try again in a minute." };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        subject,
        message,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return { success: false, error: "Failed to submit message. Please try again later." };
  }
}

