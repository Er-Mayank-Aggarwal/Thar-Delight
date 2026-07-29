import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import { prisma } from "./prisma";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
    },
  },
  user: {
    // Map Better Auth fields to our existing User model fields
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
      },
    },
  },
});


/**
 * Get the current session from Better Auth (server-side).
 * Returns { userId, role } to maintain backward compatibility
 * with all existing server actions that call getSession().
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return null;

    return {
      userId: session.user.id,
      role: session.user.role || "CUSTOMER",
    };
  } catch {
    return null;
  }
}

/**
 * Destroy the session (server-side logout).
 */
export async function destroySession() {
  // Better Auth handles logout via its API route.
  // This function is kept for backward compatibility but
  // actual logout should be done via the client.
}
