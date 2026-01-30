import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";

// n8n webhook URL for GEO content submission
const N8N_GEO_WEBHOOK = process.env.N8N_GEO_CONTENT_WEBHOOK || "";

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

    // Prepare payload for n8n
    const payload = {
      language,
      category,
      businessTitle,
      businessContent,
      coverImage: coverImageBase64,
      contentImages: contentImagesBase64,
      userId: session.user.id,
      userEmail: session.user.email,
      submittedAt: new Date().toISOString(),
    };

    // Send to n8n webhook
    if (N8N_GEO_WEBHOOK) {
      const n8nResponse = await fetch(N8N_GEO_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!n8nResponse.ok) {
        console.error("n8n webhook failed:", await n8nResponse.text());
        return NextResponse.json(
          { error: "Failed to submit to workflow" },
          { status: 500 }
        );
      }

      const result = await n8nResponse.json().catch(() => ({}));

      return NextResponse.json({
        success: true,
        message: "Content submitted successfully",
        result,
      });
    } else {
      // If no webhook configured, just return success (for testing)
      console.log("GEO Content submission (no webhook configured):", {
        language,
        category,
        businessTitle,
        contentLength: businessContent.length,
        hasCoverImage: !!coverImageBase64,
        contentImagesCount: contentImagesBase64.length,
      });

      return NextResponse.json({
        success: true,
        message: "Content submitted successfully (webhook not configured)",
      });
    }
  } catch (error) {
    console.error("Error submitting GEO content:", error);
    return NextResponse.json(
      { error: "Failed to submit content" },
      { status: 500 }
    );
  }
}
