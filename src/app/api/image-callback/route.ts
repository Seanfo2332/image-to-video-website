import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get submissionId from query params
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get("submissionId");

    // Get the callback data from kie.ai
    const data = await request.json();

    console.log("Image callback received:", { submissionId, data });

    // Extract the image URL from the callback
    // kie.ai sends: { code: 200, data: { taskId, resultJson: "{...}" } }
    let imageUrl = "";

    if (data.data?.resultJson) {
      try {
        const resultJson = typeof data.data.resultJson === "string"
          ? JSON.parse(data.data.resultJson)
          : data.data.resultJson;
        imageUrl = resultJson.resultUrls?.[0] || "";
      } catch (e) {
        console.error("Failed to parse resultJson:", e);
      }
    }

    // Also check if imageUrl is directly in data
    if (!imageUrl && data.output?.images?.[0]) {
      imageUrl = data.output.images[0];
    }

    if (!imageUrl && data.imageUrl) {
      imageUrl = data.imageUrl;
    }

    // Update the submission in database
    if (submissionId) {
      await prisma.promptSubmission.update({
        where: { id: submissionId },
        data: {
          status: imageUrl ? "completed" : "failed",
          progress: 100,
          currentStep: imageUrl ? "Image generated successfully!" : "Failed to generate image",
          videoUrl: imageUrl || null,  // Using videoUrl field to store image URL
          error: imageUrl ? null : "No image URL in callback",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Callback processed",
      submissionId,
      imageUrl,
    });

  } catch (error) {
    console.error("Image callback error:", error);
    return NextResponse.json(
      { error: "Callback processing failed", details: String(error) },
      { status: 500 }
    );
  }
}

// Also handle GET for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: "Image callback endpoint ready" });
}
