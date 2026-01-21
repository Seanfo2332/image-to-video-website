import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

// n8n Webhook URL - no spaces in path
const N8N_WEBHOOK_URL = process.env.N8N_IMAGE_GENERATOR_WEBHOOK || "https://autoskz.app.n8n.cloud/webhook/image-generator-api";
// Callback URL - use env variable for flexibility (localhost vs production)
const CALLBACK_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://image-to-video-website.vercel.app";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth();

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const prompt = formData.get("prompt") as string || "enhance the image";

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
          scriptStyle: "image-edit",
          voiceId: "",
          videoMaterial: prompt,
          status: "processing",
          progress: 0,
          currentStep: "Sending to n8n workflow...",
        },
      });
    }

    try {
      // Convert image to base64 with data URI prefix for n8n
      const imageBuffer = await image.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString("base64");
      const mimeType = image.type || "image/png";

      // Send JSON to n8n webhook
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          imageMimeType: mimeType,
          imageFileName: image.name || "image.png",
          prompt: prompt,
          submissionId: submission?.id || "",
          callbackUrl: `${CALLBACK_BASE_URL}/api/n8n/callback`,
        }),
      });

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        throw new Error(`n8n error: ${errorText}`);
      }

      // Update progress
      if (submission) {
        await prisma.promptSubmission.update({
          where: { id: submission.id },
          data: {
            currentStep: "n8n workflow started - processing image...",
            progress: 20,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Image generation started",
        submissionId: submission?.id,
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
