import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

// GET /api/dashboard/activity
// Returns user's recent activity (prompts and videos)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Connect to database to get real activity
    // For now, return empty array
    const activity: Array<{
      id: string;
      type: "prompt" | "video";
      title: string;
      status: "completed" | "processing" | "failed";
      createdAt: string;
    }> = [];

    // In production, this would query the database:
    // const recentPrompts = await prisma.promptSubmission.findMany({
    //   where: { userId: session.user.id },
    //   orderBy: { createdAt: 'desc' },
    //   take: 5,
    //   select: {
    //     id: true,
    //     scriptStyle: true,
    //     status: true,
    //     createdAt: true,
    //   }
    // });
    //
    // const recentVideos = await prisma.video.findMany({
    //   where: { userId: session.user.id },
    //   orderBy: { createdAt: 'desc' },
    //   take: 5,
    //   select: {
    //     id: true,
    //     title: true,
    //     status: true,
    //     createdAt: true,
    //   }
    // });
    //
    // Merge and sort by date

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching dashboard activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
