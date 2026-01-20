import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

// GET /api/videos
// Returns user's generated videos
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Connect to database to get real videos
    // For now, return empty array
    const videos: Array<{
      id: string;
      title: string;
      thumbnail: string;
      duration: string;
      size: string;
      createdAt: string;
      status: "completed" | "processing" | "failed";
      downloadUrl?: string;
    }> = [];

    // In production, this would query the database:
    // const videos = await prisma.video.findMany({
    //   where: { userId: session.user.id },
    //   orderBy: { createdAt: 'desc' },
    // });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
