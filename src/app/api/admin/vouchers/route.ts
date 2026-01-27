import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";

// GET /api/admin/vouchers - list all vouchers
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vouchers = await prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { redemptions: true } },
    },
  });

  return NextResponse.json({ vouchers });
}

// POST /api/admin/vouchers - create a new voucher
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code, credits, maxUses, expiresAt } = await request.json();

  if (!code || typeof credits !== "number" || credits <= 0) {
    return NextResponse.json(
      { error: "code and positive credits amount are required" },
      { status: 400 }
    );
  }

  // Check for duplicate code
  const existing = await prisma.voucher.findUnique({
    where: { code: code.trim().toUpperCase() },
  });
  if (existing) {
    return NextResponse.json({ error: "Voucher code already exists" }, { status: 400 });
  }

  const voucher = await prisma.voucher.create({
    data: {
      code: code.trim().toUpperCase(),
      credits,
      maxUses: maxUses || 1,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json({ voucher }, { status: 201 });
}
