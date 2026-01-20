import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    // Only protect specific routes that need auth
    "/admin/:path*",
    "/create/:path*",
    "/generate/:path*",
  ],
};
