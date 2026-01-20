import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

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
      return NextResponse.json(
        { error: "Failed to submit to n8n", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.text();

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
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
