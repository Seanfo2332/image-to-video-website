import type { NextAuthConfig } from "next-auth";

// Simplified auth config - main config is in auth.ts
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
} satisfies NextAuthConfig;
