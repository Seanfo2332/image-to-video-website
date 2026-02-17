import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "../../../../../../auth";
import prisma from "@/lib/prisma";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const adjustSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  amount: z.number().int().refine((n) => n !== 0, "amount must be non-zero"),
  reason: z.string().max(500).optional(),
});

// POST /api/admin/credits/adjust - admin adjusts user credits
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 10 adjustments per minute per admin
  if (!rateLimit(`admin-adjust:${session.user.id}`, 10)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const parsed = adjustSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }
  const { userId, amount, reason } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Prevent negative balance
  if (amount < 0 && user.credits + amount < 0) {
    return NextResponse.json(
      { error: `Cannot deduct ${Math.abs(amount)} credits. User only has ${user.credits}.` },
      { status: 400 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type: "admin_adjustment",
        description: reason || `Admin adjustment by ${session.user.email}`,
      },
    });

    return updatedUser;
  });

  return NextResponse.json({
    success: true,
    newBalance: result.credits,
  });
}
