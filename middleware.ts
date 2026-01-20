import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple pass-through middleware (auth handled in pages)
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
