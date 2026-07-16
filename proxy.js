import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin-controls")) {
    return NextResponse.next();
  }

  // Use Better Auth's session API to verify the user
  // We fetch the session from the auth API using the request cookies
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
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      url.searchParams.set("error", "Please log in to access the admin panel.");
      return NextResponse.redirect(url);
    }

    const session = await sessionResponse.json();

    if (!session?.user) {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      url.searchParams.set("error", "Please log in to access the admin panel.");
      return NextResponse.redirect(url);
    }

    // Check role — Better Auth stores it on the user object
    const role = session.user.role;

    if (role !== "ADMIN" && role !== "OWNER") {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      url.searchParams.set("error", "You do not have admin access.");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    // Error fetching session → redirect to login
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    url.searchParams.set("error", "Session expired. Please log in again.");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin-controls/:path*"],
};
