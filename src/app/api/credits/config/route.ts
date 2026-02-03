import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple in-memory cache for config list (5 minute TTL)
let configCache: { configs: any[]; expiresAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// GET /api/credits/config - get workflow costs (public for frontend display)
export async function GET() {
  // Return cached if valid
  if (configCache && configCache.expiresAt > Date.now()) {
    return NextResponse.json({ configs: configCache.configs });
  }

  const configs = await prisma.creditConfig.findMany({
    orderBy: { workflowType: "asc" },
  });

  // Cache the result
  configCache = {
    configs,
    expiresAt: Date.now() + CACHE_TTL,
  };

  return NextResponse.json({ configs });
}
