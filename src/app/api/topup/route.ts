import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";
import { getPaymentGateway } from "@/lib/payment-gateway";

const PACKAGES: Record<string, { credits: number; price: number }> = {
  pkg_50: { credits: 50, price: 5 },
  pkg_120: { credits: 120, price: 10 },
  pkg_300: { credits: 300, price: 20 },
  pkg_800: { credits: 800, price: 50 },
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packageId } = await request.json();
  if (!packageId || typeof packageId !== "string") {
    return NextResponse.json(
      { error: "Package ID is required" },
      { status: 400 }
    );
  }

  const pkg = PACKAGES[packageId];
  if (!pkg) {
    return NextResponse.json(
      { error: "Invalid package" },
      { status: 400 }
    );
  }

  // Create order
  const order = await prisma.topUpOrder.create({
    data: {
      userId: session.user.id,
      credits: pkg.credits,
      amount: pkg.price,
      currency: "USD",
      status: "pending",
    },
  });

  // Process payment
  const gateway = getPaymentGateway();
  const payment = await gateway.createPayment(order.id, pkg.price, "USD");

  if (!payment.success) {
    await prisma.topUpOrder.update({
      where: { id: order.id },
      data: { status: "failed" },
    });

    return NextResponse.json(
      { error: payment.error || "Payment failed" },
      { status: 402 }
    );
  }

  // Payment succeeded — add credits atomically
  const result = await prisma.$transaction(async (tx) => {
    await tx.topUpOrder.update({
      where: { id: order.id },
      data: {
        status: "completed",
        paymentMethod: "mock",
        paymentReference: payment.transactionId,
      },
    });

    await tx.user.update({
      where: { id: session.user.id },
      data: { credits: { increment: pkg.credits } },
    });

    await tx.creditTransaction.create({
      data: {
        userId: session.user.id,
        amount: pkg.credits,
        type: "topup",
        description: `Top-up: ${pkg.credits} credits ($${pkg.price})`,
      },
    });

    return tx.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });
  });

  return NextResponse.json({
    success: true,
    creditsAdded: pkg.credits,
    newBalance: result?.credits ?? 0,
    orderId: order.id,
  });
}
