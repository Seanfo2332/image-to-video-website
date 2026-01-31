import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";
import { verifyCheckout } from "@/lib/revenue-monster";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = request.nextUrl.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await prisma.topUpOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify user owns this order
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // If already completed, return success
    if (order.status === "completed") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
      });

      return NextResponse.json({
        status: "completed",
        credits: order.credits,
        newBalance: user?.credits || 0,
      });
    }

    // If pending and has checkout reference, verify with Revenue Monster
    if (order.status === "pending" && order.paymentReference) {
      try {
        const verification = await verifyCheckout(order.paymentReference);

        if (verification.success && verification.status === "SUCCESS") {
          // Process the payment
          const result = await prisma.$transaction(async (tx) => {
            await tx.topUpOrder.update({
              where: { id: orderId },
              data: {
                status: "completed",
                paymentMethod: "revenue_monster",
                paymentReference: verification.transactionId || order.paymentReference,
              },
            });

            await tx.user.update({
              where: { id: session.user.id },
              data: { credits: { increment: order.credits } },
            });

            await tx.creditTransaction.create({
              data: {
                userId: session.user.id,
                amount: order.credits,
                type: "topup",
                description: `Top-up: ${order.credits} credits (RM${order.amount.toFixed(2)})`,
              },
            });

            return tx.user.findUnique({
              where: { id: session.user.id },
              select: { credits: true },
            });
          });

          return NextResponse.json({
            status: "completed",
            credits: order.credits,
            newBalance: result?.credits || 0,
          });
        } else if (verification.status === "FAILED" || verification.status === "CANCELLED") {
          await prisma.topUpOrder.update({
            where: { id: orderId },
            data: { status: "failed" },
          });

          return NextResponse.json({
            status: "failed",
            reason: verification.status,
          });
        }
      } catch (verifyError) {
        console.error("Verification error:", verifyError);
        // Continue with pending status if verification fails
      }
    }

    return NextResponse.json({
      status: order.status,
      credits: order.credits,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
