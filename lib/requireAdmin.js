import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Verifies the current user is authenticated and has ADMIN or OWNER role.
 * Returns the user object if authorized.
 * Throws an error if not authenticated or not authorized.
 */
export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new Error("Not authorized — admin access required");
  }

  return user;
}
