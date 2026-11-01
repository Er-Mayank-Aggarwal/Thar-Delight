import { NextResponse } from "next/server";

/**
 * Next.js 16 Proxy — runs on every matched route before rendering.
 *
 * Responsibilities:
 *  1. Protect /admin-controls/* routes (admin/owner only)
 *
 * Note: Security headers are handled in next.config.mjs headers()
 */

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin-controls")) {
    return NextResponse.next();
  }

  try {
    const sessionResponse = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!sessionResponse.ok) {
      return NextResponse.rewrite(new URL("/_not-found", request.url));
    }

    const session = await sessionResponse.json();

    if (!session?.user) {
      return NextResponse.rewrite(new URL("/_not-found", request.url));
    }

    const role = session.user.role;

    if (role !== "ADMIN" && role !== "OWNER") {
      return NextResponse.rewrite(new URL("/_not-found", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }
}

export const config = {
  matcher: ["/admin-controls/:path*"],
};
