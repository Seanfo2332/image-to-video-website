import { NextResponse } from "next/server";

const packages = [
  { id: "pkg_50", credits: 50, price: 5, currency: "USD", popular: false },
  { id: "pkg_120", credits: 120, price: 10, currency: "USD", popular: true },
  { id: "pkg_300", credits: 300, price: 20, currency: "USD", popular: false },
  { id: "pkg_800", credits: 800, price: 50, currency: "USD", popular: false },
];

export async function GET() {
  return NextResponse.json({ packages });
}
