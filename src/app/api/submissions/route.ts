import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

// Workflow status types
type WorkflowStatus = "queued" | "processing" | "completed" | "failed" | "cancelled";

interface PromptSubmission {
  id: string;
  materialUrl: string;
  imageStyle: string;
  scriptStyle: string;
  language: string;
  voiceId: string;
  createdAt: string;
  status: WorkflowStatus;
  progress?: number;
  currentStep?: string;
  videoId?: string;
  error?: string;
}

// GET /api/submissions
// Returns user's prompt submission history
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // TODO: Connect to database to get real submissions
    // For now, return empty array
    const submissions: PromptSubmission[] = [];

    // In production, this would query the database:
    // const whereClause: any = { userId: session.user.id };
    // if (status && status !== 'all') {
    //   whereClause.status = status;
    // }
    //
    // const submissions = await prisma.promptSubmission.findMany({
    //   where: whereClause,
    //   orderBy: { createdAt: 'desc' },
    // });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST /api/submissions
// This would be called when a new prompt is submitted
// The actual submission goes to n8n, but we'd track it here
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // TODO: Store submission in database and trigger n8n workflow
    // const submission = await prisma.promptSubmission.create({
    //   data: {
    //     userId: session.user.id,
    //     materialUrl: body.materialUrl,
    //     imageStyle: body.imageStyle,
    //     scriptStyle: body.scriptStyle,
    //     language: body.language,
    //     voiceId: body.voiceId,
    //     status: 'queued',
    //   }
    // });
    //
    // Then trigger n8n webhook with submission ID for tracking

    return NextResponse.json({
      message: "Submission tracking will be implemented when n8n is ready",
      // id: submission.id
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
