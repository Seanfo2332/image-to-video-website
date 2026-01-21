import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

// GET /api/submissions
// Returns user's prompt submission history
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Build where clause
    const whereClause: any = { userId: session.user.id };
    if (status && status !== "all") {
      whereClause.status = status;
    }

    const submissions = await prisma.promptSubmission.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        materialUrl: true,
        imageStyle: true,
        scriptStyle: true,
        language: true,
        voiceId: true,
        status: true,
        progress: true,
        currentStep: true,
        error: true,
        videoUrl: true,
        createdAt: true,
      },
    });

    // Format for frontend
    const formattedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      materialUrl: sub.materialUrl,
      imageStyle: sub.imageStyle,
      scriptStyle: sub.scriptStyle,
      language: sub.language || "Not specified",
      voiceId: sub.voiceId,
      createdAt: sub.createdAt.toISOString(),
      status: sub.status,
      progress: sub.progress,
      currentStep: sub.currentStep,
      error: sub.error,
      videoId: sub.videoUrl ? sub.id : undefined,
    }));

    return NextResponse.json(formattedSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
