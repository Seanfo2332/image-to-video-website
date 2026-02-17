import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Public routes that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/auth",           // NextAuth routes (login, register, etc.)
  "/api/n8n/callback",   // n8n callback (validated by secret header)
  "/api/image-callback", // Image callback (validated by secret header)
  "/api/cron",           // Cron jobs
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /api/* routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Verify JWT token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Enforce admin role on /api/admin/* routes
  if (pathname.startsWith("/api/admin") && token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
