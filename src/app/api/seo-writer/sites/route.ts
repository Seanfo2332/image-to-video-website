import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

// GET - List all WordPress sites for the user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sites = await prisma.wordPressSite.findMany({
      where: { userId: session.user.id },
      include: {
        brandProfile: {
          select: {
            id: true,
            brandName: true,
            language: true,
            imageStyle: true,
          },
        },
        pageSpeedCache: {
          select: {
            score: true,
            checkedAt: true,
          },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Reasonable limit for sites per user
    });

    // Don't expose the app password
    const safeSites = sites.map((site) => ({
      ...site,
      appPassword: "••••••••",
    }));

    return NextResponse.json(safeSites);
  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

// POST - Create a new WordPress site
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, username, appPassword } = body;

    if (!name || !url || !username || !appPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Normalize URL
    let normalizedUrl = url.trim().toLowerCase();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    normalizedUrl = normalizedUrl.replace(/\/$/, ""); // Remove trailing slash

    // Check if site already exists
    const existing = await prisma.wordPressSite.findFirst({
      where: {
        userId: session.user.id,
        url: normalizedUrl,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This site is already connected" },
        { status: 400 }
      );
    }

    const site = await prisma.wordPressSite.create({
      data: {
        userId: session.user.id,
        name,
        url: normalizedUrl,
        username,
        appPassword,
        isConnected: false,
      },
    });

    return NextResponse.json({
      ...site,
      appPassword: "••••••••",
    });
  } catch (error) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a WordPress site and all associated data
export async function DELETE(request: NextRequest) {
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

    // Delete site (cascades to related records due to onDelete: Cascade in schema)
    await prisma.wordPressSite.delete({
      where: { id: siteId },
    });

    return NextResponse.json({ success: true, message: "Site deleted successfully" });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 }
    );
  }
}
