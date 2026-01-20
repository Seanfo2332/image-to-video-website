import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    // Match all paths except static files and api routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
