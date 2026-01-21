import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

// GET /api/videos
// Returns user's generated videos
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const videos = await prisma.video.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Format for frontend
    const formattedVideos = videos.map((vid) => ({
      id: vid.id,
      title: vid.title,
      thumbnail: vid.thumbnailUrl || "/api/placeholder/320/180",
      duration: vid.duration || "0:00",
      size: vid.size || "0 MB",
      createdAt: vid.createdAt.toISOString(),
      status: vid.status,
      downloadUrl: vid.downloadUrl,
    }));

    return NextResponse.json(formattedVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
