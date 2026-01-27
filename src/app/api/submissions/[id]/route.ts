import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";

// GET /api/submissions/[id]
// Returns a specific submission
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const submission = await prisma.promptSubmission.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}

// DELETE /api/submissions/[id]
// Cancels a workflow
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // 1. Get the submission
    const submission = await prisma.promptSubmission.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2. Only allow cancelling queued or processing workflows
    if (!["queued", "processing"].includes(submission.status)) {
      return NextResponse.json(
        { error: "Cannot cancel a workflow that is not queued or processing" },
        { status: 400 }
      );
    }

    // 3. Try to stop the n8n execution if we have an execution ID
    const n8nApiKey = process.env.N8N_API_KEY;
    const n8nBaseUrl = process.env.N8N_BASE_URL || "https://autoskz.app.n8n.cloud";

    if (n8nApiKey && submission.n8nExecutionId) {
      const execId = submission.n8nExecutionId;
      const headers = { "X-N8N-API-KEY": n8nApiKey };

      try {
        // Try to stop the running execution first
        const stopRes = await fetch(`${n8nBaseUrl}/api/v1/executions/${execId}/stop`, {
          method: "POST",
          headers,
        });

        // If stop didn't work (e.g. execution is waiting, not running), delete it
        if (!stopRes.ok) {
          await fetch(`${n8nBaseUrl}/api/v1/executions/${execId}`, {
            method: "DELETE",
            headers,
          });
        }
      } catch (n8nError) {
        console.error("Failed to stop n8n execution:", n8nError);
        // Continue with cancellation even if n8n stop fails
      }
    }

    // 4. Update submission status to cancelled
    const updated = await prisma.promptSubmission.update({
      where: { id },
      data: {
        status: "cancelled",
        currentStep: "Cancelled by user",
        error: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Workflow cancelled",
      submission: updated,
    });
  } catch (error) {
    console.error("Error cancelling workflow:", error);
    return NextResponse.json(
      { error: "Failed to cancel workflow" },
      { status: 500 }
    );
  }
}

// PATCH /api/submissions/[id]
// Retry a failed workflow
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (body.action === "retry") {
      // 1. Get the submission
      const submission = await prisma.promptSubmission.findUnique({
        where: {
          id,
          userId: session.user.id,
        },
      });

      if (!submission) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      // 2. Only allow retrying failed or cancelled workflows
      if (!["failed", "cancelled"].includes(submission.status)) {
        return NextResponse.json(
          { error: "Can only retry failed or cancelled workflows" },
          { status: 400 }
        );
      }

      // 3. Reset status
      await prisma.promptSubmission.update({
        where: { id },
        data: {
          status: "processing",
          progress: 0,
          currentStep: "Retrying - Submitting to workflow...",
          error: null,
          videoUrl: null,
        },
      });

      // 4. Re-trigger the n8n webhook
      const n8nWebhookUrl = process.env.N8N_LIP_SYNC_WEBHOOK ||
        "https://autoskz.app.n8n.cloud/webhook/e7bbdce5-71ee-498e-9198-260e2cc50b92";

      const callbackUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/n8n/callback`
        : "https://image-to-video-website.vercel.app/api/n8n/callback";

      // Build the form data for retry using stored data
      const n8nFormData = new FormData();
      n8nFormData.append("视频内容", submission.videoMaterial || "");
      n8nFormData.append("submissionId", submission.id);
      n8nFormData.append("callbackUrl", callbackUrl);

      // Note: For retry, the original image is not stored.
      // If image is needed, user should create a new submission.
      // This retry only works if the n8n workflow can handle text-only input.

      try {
        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          body: n8nFormData,
        });

        if (!response.ok) {
          await prisma.promptSubmission.update({
            where: { id },
            data: {
              status: "failed",
              error: "Failed to re-trigger workflow",
            },
          });
          return NextResponse.json(
            { error: "Failed to re-trigger workflow" },
            { status: 500 }
          );
        }
      } catch (fetchError) {
        await prisma.promptSubmission.update({
          where: { id },
          data: {
            status: "failed",
            error: "Network error when retrying",
          },
        });
        return NextResponse.json(
          { error: "Network error when retrying" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Workflow retry started",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
