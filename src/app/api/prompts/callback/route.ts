import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/prompts/callback - Webhook for n8n to update status
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      submissionId,
      status,
      downloadUrl,
      resultData,
      errorMessage,
    } = data;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Missing submissionId" },
        { status: 400 }
      );
    }

    // Find the submission
    const submission = await prisma.promptSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Don't update if already cancelled
    if (submission.status === "cancelled") {
      return NextResponse.json({
        success: false,
        message: "Submission was cancelled",
      });
    }

    // Update the submission
    const updateData: {
      status?: string;
      downloadUrl?: string;
      resultData?: string;
      errorMessage?: string;
      completedAt?: Date;
    } = {};

    if (status) {
      updateData.status = status;
    }

    if (downloadUrl) {
      updateData.downloadUrl = downloadUrl;
    }

    if (resultData) {
      updateData.resultData = typeof resultData === "string"
        ? resultData
        : JSON.stringify(resultData);
    }

    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    // Set completedAt if status is completed or failed
    if (status === "completed" || status === "failed") {
      updateData.completedAt = new Date();
    }

    await prisma.promptSubmission.update({
      where: { id: submissionId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing callback:", error);
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}
