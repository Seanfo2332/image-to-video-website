import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Callback endpoint for n8n to update submission with published URLs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, publishedUrls, status, error } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Missing submissionId" },
        { status: 400 }
      );
    }

    // Find the submission
    const submission = await prisma.geoSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Update with published URLs
    const updateData: any = {
      status: status || "completed",
      updatedAt: new Date(),
    };

    if (publishedUrls && Array.isArray(publishedUrls)) {
      updateData.publishedUrls = publishedUrls;
    }

    if (error) {
      updateData.status = "failed";
      updateData.error = error;
    }

    await prisma.geoSubmission.update({
      where: { id: submissionId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Submission updated",
    });
  } catch (error) {
    console.error("Error updating GEO submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
