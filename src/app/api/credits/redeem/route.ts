import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const redeemSchema = z.object({
  code: z.string().min(1).max(50).regex(/^[A-Za-z0-9_-]+$/, "Invalid voucher code format"),
});

class RedeemError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// POST /api/credits/redeem - redeem a voucher code
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 5 redemptions per minute per user
  if (!rateLimit(`redeem:${session.user.id}`, 5)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const parsed = redeemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { code } = parsed.data;
  const normalizedCode = code.trim().toUpperCase();

  // All checks and redemption inside a single transaction to prevent race conditions
  try {
    const result = await prisma.$transaction(async (tx) => {
      const voucher = await tx.voucher.findUnique({
        where: { code: normalizedCode },
      });

      if (!voucher) {
        throw new RedeemError("Invalid voucher code", 404);
      }

      if (!voucher.isActive) {
        throw new RedeemError("This voucher is no longer active", 400);
      }

      if (voucher.expiresAt && voucher.expiresAt < new Date()) {
        throw new RedeemError("This voucher has expired", 400);
      }

      if (voucher.usedCount >= voucher.maxUses) {
        throw new RedeemError("This voucher has reached its usage limit", 400);
      }

      const existing = await tx.voucherRedemption.findUnique({
        where: {
          userId_voucherId: {
            userId: session.user.id,
            voucherId: voucher.id,
          },
        },
      });

      if (existing) {
        throw new RedeemError("You have already redeemed this voucher", 400);
      }

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

      const updatedUser = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
      });

      return { credits: voucher.credits, newBalance: updatedUser?.credits ?? 0 };
    });

    return NextResponse.json({
      success: true,
      creditsAdded: result.credits,
      newBalance: result.newBalance,
    });
  } catch (err) {
    if (err instanceof RedeemError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}
