import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";

// GET /api/dashboard/stats
// Returns user's dashboard statistics
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get real stats from database
    const [videosCreated, promptsGenerated, activeWorkflows] = await Promise.all([
      prisma.video.count({
        where: { userId: session.user.id },
      }),
      prisma.promptSubmission.count({
        where: { userId: session.user.id },
      }),
      prisma.promptSubmission.count({
        where: {
          userId: session.user.id,
          status: { in: ["queued", "processing"] },
        },
      }),
    ]);

    return NextResponse.json({
      videosCreated,
      promptsGenerated,
      activeWorkflows,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
