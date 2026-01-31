import { NextResponse } from "next/server";

const packages = [
  { id: "pkg_50", credits: 50, price: 0.10, currency: "MYR", popular: false },
  { id: "pkg_120", credits: 120, price: 0.30, currency: "MYR", popular: true },
  { id: "pkg_300", credits: 300, price: 0.50, currency: "MYR", popular: false },
  { id: "pkg_800", credits: 800, price: 1.00, currency: "MYR", popular: false },
];

export async function GET() {
  return NextResponse.json({ packages });
}
