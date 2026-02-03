import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";

// GET /api/dashboard/activity
// Returns user's recent activity (prompts and videos)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get recent submissions and videos in parallel
    const [recentSubmissions, recentVideos] = await Promise.all([
      prisma.promptSubmission.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          scriptStyle: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.video.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // Combine and format activity
    const activity = [
      ...recentSubmissions.map((sub) => ({
        id: sub.id,
        type: "prompt" as const,
        title: sub.scriptStyle || "Prompt Submission",
        status: sub.status === "completed" ? "completed" as const :
                sub.status === "failed" ? "failed" as const : "processing" as const,
        createdAt: sub.createdAt.toISOString(),
      })),
      ...recentVideos.map((vid) => ({
        id: vid.id,
        type: "video" as const,
        title: vid.title,
        status: vid.status === "completed" ? "completed" as const :
                vid.status === "failed" ? "failed" as const : "processing" as const,
        createdAt: vid.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching dashboard activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
