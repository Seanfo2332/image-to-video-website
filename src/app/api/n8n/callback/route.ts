import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/n8n/callback
// n8n calls this endpoint when workflow status changes
export async function POST(request: Request) {
  try {
    // Verify the request is from n8n (optional: add secret key validation)
    const authHeader = request.headers.get("x-n8n-secret");
    const expectedSecret = process.env.N8N_CALLBACK_SECRET;

    if (expectedSecret && authHeader !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Expected payload from n8n:
    // {
    //   submissionId: string,      // The submission ID we sent to n8n
    //   status: "completed" | "failed" | "processing",
    //   progress?: number,         // 0-100
    //   currentStep?: string,      // e.g., "Generating images", "Creating video"
    //   error?: string,            // Error message if failed
    //   videoUrl?: string,         // Download URL when completed (for videos)
    //   imageUrl?: string,         // Download URL when completed (for images)
    //   videoTitle?: string,       // Optional video title
    //   videoDuration?: string,    // e.g., "3:45"
    //   videoSize?: string,        // e.g., "45.2 MB"
    //   thumbnailUrl?: string      // Optional thumbnail
    // }

    const {
      submissionId,
      status,
      progress,
      currentStep,
      error,
      videoUrl,
      imageUrl,
      videoTitle,
      videoDuration,
      videoSize,
      thumbnailUrl,
      executionId,
    } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId is required" },
        { status: 400 }
      );
    }

    // Find the submission
    const submission = await prisma.promptSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Update submission status
    const updatedSubmission = await prisma.promptSubmission.update({
      where: { id: submissionId },
      data: {
        status: status || submission.status,
        progress: progress ?? submission.progress,
        currentStep: currentStep || submission.currentStep,
        error: error || null,
        videoUrl: videoUrl || submission.videoUrl,
        n8nExecutionId: executionId || submission.n8nExecutionId,
      },
    });

    // If video is completed, create a Video record
    if (status === "completed" && videoUrl) {
      // Check if video already exists for this submission
      const existingVideo = await prisma.video.findFirst({
        where: { submissionId: submissionId },
      });

      if (!existingVideo) {
        await prisma.video.create({
          data: {
            userId: submission.userId,
            title: videoTitle || `Video - ${new Date().toLocaleDateString()}`,
            duration: videoDuration || "0:00",
            size: videoSize || "Unknown",
            status: "completed",
            downloadUrl: videoUrl,
            thumbnailUrl: thumbnailUrl || null,
            submissionId: submissionId,
          },
        });
      }
    }

    // If image is completed, create an Image record
    if (status === "completed" && imageUrl) {
      // Check if image already exists for this submission
      const existingImage = await prisma.image.findFirst({
        where: { submissionId: submissionId },
      });

      if (!existingImage) {
        await prisma.image.create({
          data: {
            userId: submission.userId,
            title: `Image - ${new Date().toLocaleDateString()}`,
            prompt: submission.videoMaterial || "",
            status: "completed",
            downloadUrl: imageUrl,
            thumbnailUrl: imageUrl,
            submissionId: submissionId,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Callback received",
      submissionId,
      status: updatedSubmission.status,
    });
  } catch (error) {
    console.error("n8n callback error:", error);
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: "n8n callback endpoint is active",
    usage: {
      method: "POST",
      url: "/api/n8n/callback",
      headers: {
        "Content-Type": "application/json",
        "x-n8n-secret": "your-secret-key (optional)",
      },
      body: {
        submissionId: "required - the submission ID",
        status: "completed | failed | processing",
        progress: "0-100 (optional)",
        currentStep: "description of current step (optional)",
        error: "error message if failed (optional)",
        videoUrl: "download URL when video completed (optional)",
        imageUrl: "download URL when image completed (optional)",
        videoTitle: "title for the video (optional)",
        videoDuration: "e.g., 3:45 (optional)",
        videoSize: "e.g., 45.2 MB (optional)",
        thumbnailUrl: "thumbnail URL (optional)",
      },
    },
  });
}
