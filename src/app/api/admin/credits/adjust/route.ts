import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import prisma from "@/lib/prisma";

// POST /api/admin/credits/adjust - admin adjusts user credits
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, amount, reason } = await request.json();

  if (!userId || typeof amount !== "number" || amount === 0) {
    return NextResponse.json(
      { error: "userId and non-zero amount are required" },
      { status: 400 }
    );
  }

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
