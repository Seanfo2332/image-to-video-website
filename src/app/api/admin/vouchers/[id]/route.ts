import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import prisma from "@/lib/prisma";

// PATCH /api/admin/vouchers/[id] - toggle active status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const voucher = await prisma.voucher.findUnique({ where: { id } });
  if (!voucher) {
    return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
  }

  const updated = await prisma.voucher.update({
    where: { id },
    data: {
      isActive: body.isActive ?? voucher.isActive,
      maxUses: body.maxUses ?? voucher.maxUses,
      expiresAt: body.expiresAt !== undefined ? (body.expiresAt ? new Date(body.expiresAt) : null) : voucher.expiresAt,
    },
  });

  return NextResponse.json({ voucher: updated });
}

// DELETE /api/admin/vouchers/[id] - delete a voucher
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Delete redemptions first, then voucher
  await prisma.$transaction([
    prisma.voucherRedemption.deleteMany({ where: { voucherId: id } }),
    prisma.voucher.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
