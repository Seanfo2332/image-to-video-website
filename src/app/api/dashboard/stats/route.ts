import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

// GET /api/dashboard/stats
// Returns user's dashboard statistics
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Connect to database to get real stats
    // For now, return placeholder data
    const stats = {
      videosCreated: 0,
      promptsGenerated: 0,
      activeWorkflows: 0,
    };

    // In production, this would query the database:
    // const videosCreated = await prisma.video.count({
    //   where: { userId: session.user.id }
    // });
    // const promptsGenerated = await prisma.promptSubmission.count({
    //   where: { userId: session.user.id }
    // });
    // const activeWorkflows = await prisma.promptSubmission.count({
    //   where: {
    //     userId: session.user.id,
    //     status: { in: ['queued', 'processing'] }
    //   }
    // });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
