"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactMessage(data) {
  try {
    const { name, email, subject, message } = data;
    
    if (!name || !email || !message) {
      return { success: false, error: "Name, email, and message are required" };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: subject, // Storing subject in phone field since schema doesn't have subject
        message,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return { success: false, error: "Failed to submit message. Please try again later." };
  }
}
