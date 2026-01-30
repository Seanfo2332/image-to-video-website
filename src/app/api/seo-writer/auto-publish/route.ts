import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch auto-publish settings for a site
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

    // Verify user owns the site
    const site = await prisma.wordPressSite.findFirst({
      where: { id: siteId, userId: session.user.id },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Get or create auto-publish settings
    let settings = await prisma.autoPublishSettings.findUnique({
      where: { siteId },
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.autoPublishSettings.create({
        data: {
          siteId,
          enabled: false,
          publishTime: "09:00",
          timezone: "Asia/Kuala_Lumpur",
          daysAhead: 7,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching auto-publish settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST - Update auto-publish settings for a site
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { siteId, enabled, publishTime, timezone, daysAhead } = body;

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    // Verify user owns the site
    const site = await prisma.wordPressSite.findFirst({
      where: { id: siteId, userId: session.user.id },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Upsert auto-publish settings
    const settings = await prisma.autoPublishSettings.upsert({
      where: { siteId },
      create: {
        siteId,
        enabled: enabled ?? false,
        publishTime: publishTime ?? "09:00",
        timezone: timezone ?? "Asia/Kuala_Lumpur",
        daysAhead: daysAhead ?? 7,
      },
      update: {
        ...(enabled !== undefined && { enabled }),
        ...(publishTime !== undefined && { publishTime }),
        ...(timezone !== undefined && { timezone }),
        ...(daysAhead !== undefined && { daysAhead }),
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating auto-publish settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
