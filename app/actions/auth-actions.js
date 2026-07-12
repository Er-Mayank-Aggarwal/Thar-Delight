"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations";
import { loginLimiter, registerLimiter } from "@/lib/rateLimit";

export async function registerUser(formData) {
  try {
    // Rate limit
    const rl = registerLimiter.check(formData.email || "unknown");
    if (!rl.allowed) {
      return { success: false, error: "Too many registration attempts. Please try again later." };
    }

    // Validate input
    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return { success: false, error: firstError };
    }

    const { firstName, lastName, email, password } = parsed.data;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password: passwordHash,
        role: "CUSTOMER",
      }
    });

    // 4. Set signed JWT session cookie (30 days)
    await createSession(user.id, user.role);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An unexpected error occurred during registration." };
  }
}

export async function loginUser(formData) {
  try {
    // Rate limit
    const rl = loginLimiter.check(formData.email || "unknown");
    if (!rl.allowed) {
      return { success: false, error: "Too many login attempts. Please try again later." };
    }

    // Validate input
    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return { success: false, error: firstError };
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Set signed JWT session cookie with role
    await createSession(user.id, user.role);

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}

export async function logoutUser() {
  await destroySession();
}

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
