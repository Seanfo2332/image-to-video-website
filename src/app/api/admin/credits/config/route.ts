import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import prisma from "@/lib/prisma";

// GET /api/admin/credits/config - view all workflow costs
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configs = await prisma.creditConfig.findMany({
    orderBy: { workflowType: "asc" },
  });

  return NextResponse.json({ configs });
}

// PUT /api/admin/credits/config - update workflow costs
export async function PUT(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { configs } = await request.json();

  if (!Array.isArray(configs)) {
    return NextResponse.json({ error: "configs array is required" }, { status: 400 });
  }

  const updated = await prisma.$transaction(
    configs.map((c: { workflowType: string; cost: number; label: string }) =>
      prisma.creditConfig.upsert({
        where: { workflowType: c.workflowType },
        update: { cost: c.cost, label: c.label },
        create: { workflowType: c.workflowType, cost: c.cost, label: c.label },
      })
    )
  );

  return NextResponse.json({ success: true, configs: updated });
}
