import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";
import { checkAndDeductCredits, InsufficientCreditsError } from "@/lib/credits";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

// n8n Webhook URL - no spaces in path
const N8N_WEBHOOK_URL = process.env.N8N_IMAGE_GENERATOR_WEBHOOK || "https://autoskz.app.n8n.cloud/webhook/image-generator-api";
// Callback URL - use env variable for flexibility (localhost vs production)
const CALLBACK_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://image-to-video-website.vercel.app";

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 requests per minute per user
    if (!rateLimit(`generator:${session.user.id}`, 10)) {
      return rateLimitResponse();
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const prompt = formData.get("prompt") as string || "enhance the image";

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB) and type
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be under 10MB" },
        { status: 400 }
      );
    }

    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!ALLOWED_TYPES.includes(image.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt must be under 2000 characters" },
        { status: 400 }
      );
    }

    // Save submission to database
    const submission = await prisma.promptSubmission.create({
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

    // Deduct credits
    try {
      await checkAndDeductCredits(session.user.id, "image", submission.id);
    } catch (err) {
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
          submissionId: submission.id,
          callbackUrl: `${CALLBACK_BASE_URL}/api/n8n/callback`,
        }),
      });

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        throw new Error(`n8n error: ${errorText}`);
      }

      // Update progress
      await prisma.promptSubmission.update({
        where: { id: submission.id },
        data: {
          currentStep: "n8n workflow started - processing image...",
          progress: 20,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Image generation started",
        submissionId: submission.id,
      });

    } catch (apiError) {
      // Update submission status to failed
      await prisma.promptSubmission.update({
        where: { id: submission.id },
        data: {
          status: "failed",
          error: String(apiError),
        },
      });
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
