import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

// GET - Get brand profile for a site
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

    const profile = await prisma.brandProfile.findFirst({
      where: {
        site: {
          id: siteId,
          userId: session.user.id,
        },
      },
      include: {
        _count: {
          select: { keywords: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching brand profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand profile" },
      { status: 500 }
    );
  }
}

// PATCH - Update brand profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { siteId, ...updateData } = body;

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.brandProfile.findFirst({
      where: {
        site: {
          id: siteId,
          userId: session.user.id,
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update allowed fields
    const {
      brandName,
      brandDescription,
      tone,
      targetAudience,
      contentStyle,
      brandVoice,
      keyThemes,
      language,
      imageStyle,
    } = updateData;

    const profile = await prisma.brandProfile.update({
      where: { id: existing.id },
      data: {
        ...(brandName !== undefined && { brandName }),
        ...(brandDescription !== undefined && { brandDescription }),
        ...(tone !== undefined && { tone }),
        ...(targetAudience !== undefined && { targetAudience }),
        ...(contentStyle !== undefined && { contentStyle }),
        ...(brandVoice !== undefined && { brandVoice }),
        ...(keyThemes !== undefined && { keyThemes }),
        ...(language !== undefined && { language }),
        ...(imageStyle !== undefined && { imageStyle }),
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating brand profile:", error);
    return NextResponse.json(
      { error: "Failed to update brand profile" },
      { status: 500 }
    );
  }
}
