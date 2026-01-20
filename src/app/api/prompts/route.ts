import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

// GET /api/prompts - List user's submissions
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await prisma.promptSubmission.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST /api/prompts - Create new submission
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    // Extract form fields
    const materialUrl = formData.get("field-0") as string;
    const imageOption = formData.get("field-2") as string;
    const scriptStyle = formData.get("field-3") as string;
    const language = formData.get("field-4") as string | null;
    const voiceId = formData.get("field-5") as string;
    const fileFormat = formData.get("field-6") as string | null;
    const videoMaterial = formData.get("field-7") as string | null;

    // Validate required fields
    if (!materialUrl || !imageOption || !scriptStyle || !voiceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create submission in database
    const submission = await prisma.promptSubmission.create({
      data: {
        userId: session.user.id,
        status: "pending",
        materialUrl,
        imageOption,
        scriptStyle,
        language,
        voiceId,
        fileFormat,
        videoMaterial,
      },
    });

    // Forward to n8n webhook with submission ID for callback
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_FORM_URL;
    if (webhookUrl) {
      // Create new FormData with submission ID
      const n8nFormData = new FormData();

      // Add all original fields
      for (const [key, value] of formData.entries()) {
        n8nFormData.append(key, value);
      }

      // Add submission ID and callback URL for n8n to use
      n8nFormData.append("submissionId", submission.id);
      n8nFormData.append("callbackUrl", `${process.env.AUTH_URL || "http://localhost:3000"}/api/prompts/callback`);

      // Send to n8n (fire and forget)
      fetch(webhookUrl, {
        method: "POST",
        body: n8nFormData,
      }).catch((err) => {
        console.error("Error sending to n8n:", err);
      });

      // Update status to processing
      await prisma.promptSubmission.update({
        where: { id: submission.id },
        data: { status: "processing" },
      });
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        status: "processing",
      },
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
