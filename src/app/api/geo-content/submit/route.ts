import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

// n8n webhook URL for GEO content submission
const N8N_GEO_WEBHOOK = process.env.N8N_GEO_CONTENT_WEBHOOK || "https://n8nb30.app.n8n.cloud/webhook/news";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const language = formData.get("language") as string;
    const category = formData.get("category") as string;
    const businessTitle = formData.get("businessTitle") as string;
    const businessContent = formData.get("businessContent") as string;
    const coverImage = formData.get("coverImage") as File | null;

    // Get all content images
    const contentImages: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("contentImage_") && value instanceof File) {
        contentImages.push(value);
      }
    }

    if (!category || !businessTitle || !businessContent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert images to base64 for n8n
    let coverImageBase64 = "";
    if (coverImage && coverImage.size > 0) {
      const buffer = await coverImage.arrayBuffer();
      coverImageBase64 = `data:${coverImage.type};base64,${Buffer.from(buffer).toString("base64")}`;
    }

    const contentImagesBase64: string[] = [];
    for (const img of contentImages) {
      if (img.size > 0) {
        const buffer = await img.arrayBuffer();
        contentImagesBase64.push(
          `data:${img.type};base64,${Buffer.from(buffer).toString("base64")}`
        );
      }
    }

    // Create submission record in database
    const submission = await prisma.geoSubmission.create({
      data: {
        userId: session.user.id,
        language,
        category,
        businessTitle,
        businessContent,
        coverImageUrl: coverImageBase64 ? "pending" : null,
        status: "processing",
      },
    });

    // Prepare payload for n8n (matching your form trigger fields)
    const payload = {
      submissionId: submission.id,
      Category: category,
      "企业标题": businessTitle,
      "企业内容": businessContent,
      language,
      coverImage: coverImageBase64,
      contentImages: contentImagesBase64,
      userId: session.user.id,
      userEmail: session.user.email,
      submittedAt: new Date().toISOString(),
    };

    // Send to n8n webhook
    try {
      const n8nResponse = await fetch(N8N_GEO_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!n8nResponse.ok) {
        console.error("n8n webhook failed:", await n8nResponse.text());
        // Update submission status to failed
        await prisma.geoSubmission.update({
          where: { id: submission.id },
          data: {
            status: "failed",
            error: "Failed to send to workflow"
          },
        });
        return NextResponse.json(
          { error: "Failed to submit to workflow" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Content submitted successfully",
        submissionId: submission.id,
      });
    } catch (webhookError) {
      console.error("Webhook error:", webhookError);
      await prisma.geoSubmission.update({
        where: { id: submission.id },
        data: {
          status: "failed",
          error: "Webhook connection failed"
        },
      });
      return NextResponse.json(
        { error: "Failed to connect to workflow" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting GEO content:", error);
    return NextResponse.json(
      { error: "Failed to submit content" },
      { status: 500 }
    );
  }
}
