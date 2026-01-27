import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";

// POST /api/credits/redeem - redeem a voucher code
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await request.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Voucher code is required" }, { status: 400 });
  }

  const voucher = await prisma.voucher.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!voucher) {
    return NextResponse.json({ error: "Invalid voucher code" }, { status: 404 });
  }

  if (!voucher.isActive) {
    return NextResponse.json({ error: "This voucher is no longer active" }, { status: 400 });
  }

  if (voucher.expiresAt && voucher.expiresAt < new Date()) {
    return NextResponse.json({ error: "This voucher has expired" }, { status: 400 });
  }

  if (voucher.usedCount >= voucher.maxUses) {
    return NextResponse.json({ error: "This voucher has reached its usage limit" }, { status: 400 });
  }

  // Check if user already redeemed this voucher
  const existing = await prisma.voucherRedemption.findUnique({
    where: {
      userId_voucherId: {
        userId: session.user.id,
        voucherId: voucher.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "You have already redeemed this voucher" }, { status: 400 });
  }

  // Redeem atomically
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: { credits: { increment: voucher.credits } },
    });

    await tx.voucher.update({
      where: { id: voucher.id },
      data: { usedCount: { increment: 1 } },
    });

    await tx.voucherRedemption.create({
      data: {
        userId: session.user.id,
        voucherId: voucher.id,
        creditsAdded: voucher.credits,
      },
    });

    await tx.creditTransaction.create({
      data: {
        userId: session.user.id,
        amount: voucher.credits,
        type: "voucher_redemption",
        description: `Redeemed voucher: ${voucher.code}`,
        voucherId: voucher.id,
      },
    });

    return tx.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });
  });

  return NextResponse.json({
    success: true,
    creditsAdded: voucher.credits,
    newBalance: result?.credits ?? 0,
  });
}
