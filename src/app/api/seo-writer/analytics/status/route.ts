import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

// GET - Check if GSC is connected for a site
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    // Verify site ownership
    const site = await prisma.wordPressSite.findFirst({
      where: {
        id: siteId,
        userId: session.user.id,
      },
      include: {
        googleSearchConsole: true,
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const connected = !!site.googleSearchConsole;
    const propertyUrl = site.googleSearchConsole?.propertyUrl || null;

    return NextResponse.json({
      connected,
      propertyUrl,
    });
  } catch (error) {
    console.error("Error checking GSC status:", error);
    return NextResponse.json(
      { error: "Failed to check connection status" },
      { status: 500 }
    );
  }
}
