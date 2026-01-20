import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

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

    // TODO: Get submission from database
    // const submission = await prisma.promptSubmission.findUnique({
    //   where: {
    //     id,
    //     userId: session.user.id
    //   }
    // });
    //
    // if (!submission) {
    //   return NextResponse.json({ error: "Not found" }, { status: 404 });
    // }

    return NextResponse.json({
      message: `Submission ${id} details will be available when database is connected`,
    });
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

    // TODO: Cancel workflow in n8n and update database
    // 1. Get the submission
    // const submission = await prisma.promptSubmission.findUnique({
    //   where: {
    //     id,
    //     userId: session.user.id
    //   }
    // });
    //
    // if (!submission) {
    //   return NextResponse.json({ error: "Not found" }, { status: 404 });
    // }
    //
    // 2. Only allow cancelling queued or processing workflows
    // if (!['queued', 'processing'].includes(submission.status)) {
    //   return NextResponse.json(
    //     { error: "Cannot cancel completed workflow" },
    //     { status: 400 }
    //   );
    // }
    //
    // 3. Call n8n API to cancel the workflow
    // await fetch(`${N8N_URL}/api/v1/executions/${submission.n8nExecutionId}/stop`, {
    //   method: 'POST',
    //   headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY }
    // });
    //
    // 4. Update submission status
    // await prisma.promptSubmission.update({
    //   where: { id },
    //   data: { status: 'cancelled' }
    // });

    return NextResponse.json({
      message: `Workflow ${id} cancel functionality will be connected to n8n`,
      success: true,
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
      // TODO: Retry failed workflow
      // 1. Get the submission
      // const submission = await prisma.promptSubmission.findUnique({
      //   where: {
      //     id,
      //     userId: session.user.id
      //   }
      // });
      //
      // 2. Only allow retrying failed workflows
      // if (submission.status !== 'failed') {
      //   return NextResponse.json(
      //     { error: "Can only retry failed workflows" },
      //     { status: 400 }
      //   );
      // }
      //
      // 3. Reset status and trigger n8n again
      // await prisma.promptSubmission.update({
      //   where: { id },
      //   data: { status: 'queued', error: null }
      // });
      //
      // 4. Trigger n8n webhook again with submission data

      return NextResponse.json({
        message: `Workflow ${id} retry functionality will be connected to n8n`,
        success: true,
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
