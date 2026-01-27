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
    const imageStyle = formData.get("生成图片选项") as string || "";
    const scriptTopic = formData.get("口播主题") as string || "";
    const voiceId = formData.get("声音身份 ID") as string || "";
    const language = formData.get("语言") as string || "";
    const duration = formData.get("口播 (分钟)") as string || "";
    const customPrompt = formData.get("自定义图片提示词") as string || "";

    // Save submission to database if user is logged in
    let submission = null;
    if (session?.user?.id) {
      submission = await prisma.promptSubmission.create({
        data: {
          userId: session.user.id,
          materialUrl: "video-generator",
          imageStyle: imageStyle,
          scriptStyle: scriptTopic,
          language: language,
          voiceId: voiceId,
          fileFormat: duration,
          videoMaterial: customPrompt,
          status: "processing",
          progress: 0,
          currentStep: "Submitting to video workflow...",
        },
      });

      // Deduct credits
      try {
        await checkAndDeductCredits(session.user.id, "video", submission.id);
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
    }

    // n8n webhook URL for video generator
    const n8nWebhookUrl = "https://autoskz.app.n8n.cloud/webhook/b40bb04c-1ba1-4c0c-b3b2-cc418930bf09";

    // Create FormData for n8n (must be multipart/form-data)
    const n8nFormData = new FormData();

    // Create a proper Blob from the image file for the form
    const imageBuffer = await image.arrayBuffer();
    const imageBlob = new Blob([imageBuffer], { type: image.type });
    n8nFormData.append("Image", imageBlob, image.name);

    // Append text fields with Chinese names
    n8nFormData.append("生成图片选项", imageStyle);
    n8nFormData.append("口播主题", scriptTopic);
    n8nFormData.append("声音身份 ID", voiceId);
    n8nFormData.append("语言", language);
    n8nFormData.append("口播 (分钟)", duration);
    n8nFormData.append("自定义图片提示词", customPrompt);

    // Add submissionId and callback URL for n8n
    if (submission) {
      n8nFormData.append("submissionId", submission.id);
      n8nFormData.append("callbackUrl", "https://image-to-video-website.vercel.app/api/n8n/callback");
    }

    console.log("Sending FormData to n8n with fields:", {
      imageStyle, scriptTopic, voiceId, language, duration, customPrompt
    });

    // Forward the form data to n8n
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      body: n8nFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n error:", errorText);

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
        { error: "Failed to submit to n8n", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.text();

    // Update submission status
    if (submission) {
      await prisma.promptSubmission.update({
        where: { id: submission.id },
        data: {
          currentStep: "Video workflow started - generating content...",
          progress: 10,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Video generation started",
      submissionId: submission?.id,
      data,
    });
  } catch (error) {
    console.error("Video generator error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
