import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Revenue Monster callback handler
// This is called by Revenue Monster after a successful payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Revenue Monster callback received:", JSON.stringify(body, null, 2));

    // Extract transaction details from callback
    // Revenue Monster sends: transactionId, orderId, status, amount, etc.
    const {
      transactionId,
      order,
      status,
      paymentMethod,
    } = body;

    const orderId = order?.id;

    if (!orderId) {
      console.error("Missing orderId in callback");
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Find the order
    const topUpOrder = await prisma.topUpOrder.findUnique({
      where: { id: orderId },
    });

    if (!topUpOrder) {
      console.error("Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if already processed
    if (topUpOrder.status === "completed") {
      console.log("Order already completed:", orderId);
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // Only process successful transactions
    if (status !== "SUCCESS") {
      console.log("Transaction not successful:", status);
      await prisma.topUpOrder.update({
        where: { id: orderId },
        data: { status: "failed" },
      });
      return NextResponse.json({ success: true, message: "Status noted" });
    }

    // Process successful payment - add credits atomically
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.topUpOrder.update({
        where: { id: orderId },
        data: {
          status: "completed",
          paymentMethod: paymentMethod || "revenue_monster",
          paymentReference: transactionId,
        },
      });

      // Add credits to user
      await tx.user.update({
        where: { id: topUpOrder.userId },
        data: { credits: { increment: topUpOrder.credits } },
      });

      // Create transaction record
      await tx.creditTransaction.create({
        data: {
          userId: topUpOrder.userId,
          amount: topUpOrder.credits,
          type: "topup",
          description: `Top-up: ${topUpOrder.credits} credits (RM${topUpOrder.amount.toFixed(2)})`,
        },
      });
    });

    console.log("Payment processed successfully:", orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Callback processing error:", error);
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}

// Also handle GET for Revenue Monster redirect verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  console.log("Callback GET:", { status, orderId });

  return NextResponse.json({ status, orderId });
}
