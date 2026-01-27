import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";
import { checkAndDeductCredits, InsufficientCreditsError } from "@/lib/credits";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth();

    const formData = await request.formData();

    // Extract form fields
    const image = formData.get("Image") as File;
    const videoContent = formData.get("视频内容") as string || "";

    // Validate required fields
    if (!image) {
      return NextResponse.json(
        { error: "Portrait image is required" },
        { status: 400 }
      );
    }

    if (!videoContent.trim()) {
      return NextResponse.json(
        { error: "Video content/script is required" },
        { status: 400 }
      );
    }

    // Save submission to database if user is logged in
    let submission = null;
    if (session?.user?.id) {
      submission = await prisma.promptSubmission.create({
        data: {
          userId: session.user.id,
          materialUrl: "lip-sync-generator",
          imageStyle: "lip-sync",
          scriptStyle: "narration",
          language: "auto",
          voiceId: "English_AttractiveGirl",
          fileFormat: "mp4",
          videoMaterial: videoContent.substring(0, 500), // Store first 500 chars
          status: "processing",
          progress: 0,
          currentStep: "Submitting to lip sync workflow...",
        },
      });

      // Deduct credits
      try {
        await checkAndDeductCredits(session.user.id, "lip-sync", submission.id);
      } catch (err) {
        // Roll back submission
        await prisma.promptSubmission.update({
          where: { id: submission.id },
          data: { status: "failed", error: "Insufficient credits" },
        });
        if (err instanceof InsufficientCreditsError) {
          return NextResponse.json(
            { error: "Insufficient credits", required: err.required, available: err.available },
            { status: 402 }
          );
        }
        throw err;
      }
    }

    // n8n webhook URL for lip sync video generator
    // Uses the form trigger webhook from n8n workflow
    const n8nWebhookUrl = process.env.N8N_LIP_SYNC_WEBHOOK ||
      "https://autoskz.app.n8n.cloud/webhook/db6f5740-439b-4a6b-acfb-e07383ad356c";

    // Create FormData for n8n (must be multipart/form-data to match form trigger)
    const n8nFormData = new FormData();

    // Create a proper Blob from the image file for the form
    const imageBuffer = await image.arrayBuffer();
    const imageBlob = new Blob([imageBuffer], { type: image.type });
    n8nFormData.append("Image", imageBlob, image.name);

    // Append video content (script) with Chinese field name to match n8n form
    n8nFormData.append("视频内容", videoContent);

    // Add submissionId and callback URL for n8n to report back
    if (submission) {
      n8nFormData.append("submissionId", submission.id);
      const callbackUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/n8n/callback`
        : "https://image-to-video-website.vercel.app/api/n8n/callback";
      n8nFormData.append("callbackUrl", callbackUrl);
    }

    console.log("Sending lip sync request to n8n:", {
      imageType: image.type,
      imageName: image.name,
      contentLength: videoContent.length,
      submissionId: submission?.id,
    });

    // Forward the form data to n8n
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      body: n8nFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n lip sync error:", errorText);

      // Update submission status to failed
      if (submission) {
        await prisma.promptSubmission.update({
          where: { id: submission.id },
          data: {
            status: "failed",
            error: `n8n error: ${errorText}`,
          },
        });
      }

      return NextResponse.json(
        { error: "Failed to submit to lip sync workflow", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.text();

    // Update submission status
    if (submission) {
      await prisma.promptSubmission.update({
        where: { id: submission.id },
        data: {
          currentStep: "Lip sync workflow started - generating audio and video...",
          progress: 10,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Lip sync video generation started",
      submissionId: submission?.id,
      data,
    });
  } catch (error) {
    console.error("Lip sync generator error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
