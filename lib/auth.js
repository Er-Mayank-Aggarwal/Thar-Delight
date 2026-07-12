import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "user_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "fallback-dev-secret-change-in-production"
);

/**
 * Create a signed JWT session cookie for the given user.
 * Includes userId and role in the token payload so middleware can
 * perform role checks without a database call.
 */
export async function createSession(userId, role) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

/**
 * Verify the session cookie and return { userId, role } or null.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

/**
 * Destroy the session by deleting the cookie.
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Verify a JWT token string (for use in middleware where cookies() is not available).
 * Returns { userId, role } or null.
 */
export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}
