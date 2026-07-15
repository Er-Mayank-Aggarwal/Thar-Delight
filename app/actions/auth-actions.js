"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * Logout is now handled client-side via Better Auth's signOut().
 * This server action is kept for backward compatibility if needed.
 */
export async function logoutUser() {
  // Better Auth handles logout via client-side signOut()
  // No server-side action needed
}

/**
 * Get the currently logged-in user's profile from the database.
 * Uses Better Auth's session management instead of custom JWT.
 */
export async function getSessionUser() {
  const session = await getSession();

  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, role: true }
    });
    return user;
  } catch (error) {
    return null;
  }
}
