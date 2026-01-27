import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/credits/config - get workflow costs (public for frontend display)
export async function GET() {
  const configs = await prisma.creditConfig.findMany({
    orderBy: { workflowType: "asc" },
  });

  return NextResponse.json({ configs });
}
