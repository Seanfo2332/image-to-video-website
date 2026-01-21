import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

const IMGBB_API_KEY = "8ee0f523460ce1eb330207c3dcf4cfc0";
const KIE_AI_API_KEY = "5fc0241687cbf50ff76ec415096c9388";

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
          currentStep: "Uploading image...",
        },
      });
    }

    try {
      // Step 1: Upload image to imgbb
      const imageBuffer = await image.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString("base64");

      const imgbbFormData = new FormData();
      imgbbFormData.append("key", IMGBB_API_KEY);
      imgbbFormData.append("image", base64Image);
      imgbbFormData.append("expiration", "600");

      const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: imgbbFormData,
      });

      if (!imgbbResponse.ok) {
        throw new Error("Failed to upload image to imgbb");
      }

      const imgbbData = await imgbbResponse.json();
      const imageUrl = imgbbData.data.url;

      // Update progress
      if (submission) {
        await prisma.promptSubmission.update({
          where: { id: submission.id },
          data: {
            currentStep: "Processing with AI...",
            progress: 30,
          },
        });
      }

      // Step 2: Call kie.ai API
      const kieResponse = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${KIE_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/nano-banana-edit",
          callBackUrl: `https://image-to-video-website.vercel.app/api/n8n/callback`,
          input: {
            prompt: prompt || "enhance the image",
            image_urls: [imageUrl],
            output_format: "png",
            image_size: "auto",
          },
        }),
      });

      if (!kieResponse.ok) {
        const errorText = await kieResponse.text();
        throw new Error(`kie.ai API error: ${errorText}`);
      }

      const kieData = await kieResponse.json();

      // Update submission with task ID
      if (submission) {
        await prisma.promptSubmission.update({
          where: { id: submission.id },
          data: {
            currentStep: "AI processing started...",
            progress: 50,
            materialUrl: kieData.data?.taskId || "pending",
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Image generation started",
        submissionId: submission?.id,
        taskId: kieData.data?.taskId,
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
