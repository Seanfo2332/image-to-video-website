import { NextResponse } from "next/server";

const packages = [
  { id: "pkg_50", credits: 50, price: 22, currency: "MYR", popular: false },
  { id: "pkg_120", credits: 120, price: 44, currency: "MYR", popular: true },
  { id: "pkg_300", credits: 300, price: 88, currency: "MYR", popular: false },
  { id: "pkg_800", credits: 800, price: 220, currency: "MYR", popular: false },
];

export async function GET() {
  return NextResponse.json({ packages });
}
