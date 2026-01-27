import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getUserCredits } from "@/lib/credits";

// GET /api/credits - get current user's credit balance
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const credits = await getUserCredits(session.user.id);
  return NextResponse.json({ credits });
}
