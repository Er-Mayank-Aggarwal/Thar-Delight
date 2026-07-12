import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "fallback-dev-secret-change-in-production"
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin-controls")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("user_session")?.value;

  // No session → redirect to login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    url.searchParams.set("error", "Please log in to access the admin panel.");
    return NextResponse.redirect(url);
  }

  try {
    // Verify JWT
    const { payload } = await jwtVerify(token, SECRET);

    if (!payload.userId) {
      throw new Error("Invalid session");
    }

    // Fetch user role from API by reading from DB via edge-compatible fetch
    // Since we can't use Prisma in edge middleware, we embed the role in the JWT.
    // For now, we'll check if the role is embedded in the token payload.
    // The createSession function will be updated to include the role.
    const role = payload.role;

    if (role !== "ADMIN" && role !== "OWNER") {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      url.searchParams.set("error", "You do not have admin access.");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    // Invalid/expired token → redirect to login
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    url.searchParams.set("error", "Session expired. Please log in again.");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin-controls/:path*"],
};
