import { NextRequest, NextResponse } from "next/server";

// GET /api/download?url=...&filename=...
// Proxies image download to avoid CORS issues
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    const filename = request.nextUrl.searchParams.get("filename") || "image.png";

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the image from the external URL
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    // Return the image with download headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}
