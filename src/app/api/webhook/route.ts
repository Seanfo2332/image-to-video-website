import { NextRequest, NextResponse } from "next/server";

// n8n webhook endpoint for video generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract video generation parameters
    const { prompt, style, duration, format } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // TODO: Send to n8n webhook for processing
    // Replace with your n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style: style || "cinematic",
          duration: duration || 30,
          format: format || "mp4",
          timestamp: new Date().toISOString(),
        }),
      });

      const n8nData = await n8nResponse.json();

      return NextResponse.json({
        success: true,
        message: "Video generation started",
        jobId: n8nData.jobId || crypto.randomUUID(),
        status: "processing",
      });
    }

    // Mock response if n8n webhook not configured
    return NextResponse.json({
      success: true,
      message: "Video generation started (demo mode)",
      jobId: crypto.randomUUID(),
      status: "processing",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle webhook callbacks from n8n
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json(
      { error: "Job ID is required" },
      { status: 400 }
    );
  }

  // TODO: Fetch job status from database or n8n
  return NextResponse.json({
    jobId,
    status: "processing",
    progress: 50,
    message: "Generating video frames...",
  });
}
