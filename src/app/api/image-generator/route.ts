import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

// n8n form webhook URL
const N8N_WEBHOOK_URL = "https://autoskz.app.n8n.cloud/webhook/image-generator";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth();

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const prompt = formData.get("prompt") as string || "";

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Save submission to database if user is logged in
    let submission = null;
    if (session?.user?.id) {
      submission = await prisma.promptSubmission.create({
        data: {
          userId: session.user.id,
          materialUrl: "image-generator",
          imageStyle: "nano-banana-edit",
          videoMaterial: prompt,
          status: "processing",
          progress: 0,
          currentStep: "Submitting to n8n workflow...",
        },
      });
    }

    try {
      // Create FormData for n8n with the field names from the form
      const n8nFormData = new FormData();

      // Convert image to Blob and append
      const imageBuffer = await image.arrayBuffer();
      const imageBlob = new Blob([imageBuffer], { type: image.type });
      n8nFormData.append("Image", imageBlob, image.name);

      // Append prompt field
      n8nFormData.append("自定义图片提示词", prompt);

      // Add submission tracking
      if (submission) {
        n8nFormData.append("submissionId", submission.id);
        n8nFormData.append("callbackUrl", "https://image-to-video-website.vercel.app/api/n8n/callback");
      }

      // Submit to n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: n8nFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`n8n error: ${errorText}`);
      }

      const responseData = await response.text();

      // Update submission
      if (submission) {
        await prisma.promptSubmission.update({
          where: { id: submission.id },
          data: {
            currentStep: "Workflow started - processing image...",
            progress: 30,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Image generation started",
        submissionId: submission?.id,
        data: responseData,
      });

    } catch (apiError) {
      // Update submission status to failed
      if (submission) {
        await prisma.promptSubmission.update({
          where: { id: submission.id },
          data: {
            status: "failed",
            error: String(apiError),
          },
        });
      }
      throw apiError;
    }

  } catch (error) {
    console.error("Image generator error:", error);
    return NextResponse.json(
      { error: "Failed to generate image", details: String(error) },
      { status: 500 }
    );
  }
}
