import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";
import { createCheckout } from "@/lib/revenue-monster";

// Credit packages with MYR pricing
const PACKAGES: Record<string, { credits: number; price: number; priceMYR: number }> = {
  pkg_50: { credits: 50, price: 5, priceMYR: 2200 }, // RM22.00
  pkg_120: { credits: 120, price: 10, priceMYR: 4400 }, // RM44.00
  pkg_300: { credits: 300, price: 20, priceMYR: 8800 }, // RM88.00
  pkg_800: { credits: 800, price: 50, priceMYR: 22000 }, // RM220.00
};

export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Create order in database
    const order = await prisma.topUpOrder.create({
      data: {
        userId: session.user.id,
        credits: pkg.credits,
        amount: pkg.priceMYR / 100, // Store as MYR decimal
        currency: "MYR",
        status: "pending",
      },
    });

    // Get base URL for redirects
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;

    // Create Revenue Monster checkout
    const checkout = await createCheckout({
      orderId: order.id,
      amount: pkg.priceMYR, // Amount in cents
      title: `${pkg.credits} Credits Top-up`,
      details: `Purchase ${pkg.credits} credits for your account`,
      redirectUrl: `${baseUrl}/dashboard/billing/complete?orderId=${order.id}`,
      notifyUrl: `${baseUrl}/api/topup/callback`,
    });

    if (!checkout.success) {
      // Update order as failed
      await prisma.topUpOrder.update({
        where: { id: order.id },
        data: { status: "failed" },
      });

      return NextResponse.json(
        { error: checkout.error || "Failed to create checkout" },
        { status: 500 }
      );
    }

    // Update order with checkout ID
    await prisma.topUpOrder.update({
      where: { id: order.id },
      data: {
        paymentReference: checkout.checkoutId,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.checkoutUrl,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
