import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth();

    const formData = await request.formData();

    // Extract form fields for database storage
    const materialUrl = formData.get("field-0") as string || "";
    const imageStyle = formData.get("field-2") as string || "";
    const scriptStyle = formData.get("field-3") as string || "";
    const language = formData.get("field-4") as string || "";
    const voiceId = formData.get("field-5") as string || "";
    const fileFormat = formData.get("field-6") as string || "";
    const videoMaterial = formData.get("field-7") as string || "";

    // Save submission to database if user is logged in
    let submission = null;
    if (session?.user?.id) {
      submission = await prisma.promptSubmission.create({
        data: {
          userId: session.user.id,
          materialUrl,
          imageStyle,
          scriptStyle,
          language: language || null,
          voiceId,
          fileFormat: fileFormat || null,
          videoMaterial: videoMaterial || null,
          status: "processing",
          progress: 0,
          currentStep: "Submitting to workflow...",
        },
      });
    }

    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_FORM_URL ||
      "https://n8n.srv1007594.hstgr.cloud/webhook/ad77bb16-47ef-46ce-a7dd-e479259f81b8";

    // Forward the form data to n8n
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      body: formData,
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
          currentStep: "Workflow started - generating content...",
          progress: 10,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      submissionId: submission?.id,
      data,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
