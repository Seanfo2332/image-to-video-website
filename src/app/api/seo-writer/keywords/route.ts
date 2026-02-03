import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { discoverKeywords } from "@/lib/openai";

// GET - List keywords for a site/profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const profileId = searchParams.get("profileId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200); // Max 200
    const skip = (page - 1) * limit;

    if (!siteId && !profileId) {
      return NextResponse.json(
        { error: "Site ID or Profile ID required" },
        { status: 400 }
      );
    }

    let targetProfileId = profileId;

    // If siteId is provided, get the profile first
    if (!targetProfileId && siteId) {
      const profile = await prisma.brandProfile.findFirst({
        where: {
          site: {
            id: siteId,
            userId: session.user.id,
          },
        },
        select: { id: true },
      });

      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      targetProfileId = profile.id;
    }

    // Build where clause
    const where: { profileId: string; status?: string } = { profileId: targetProfileId! };
    if (status) {
      where.status = status;
    }

    // Get total count and keywords in parallel
    const [total, keywords] = await Promise.all([
      prisma.keyword.count({ where }),
      prisma.keyword.findMany({
        where,
        include: {
          _count: {
            select: { articles: true },
          },
        },
        orderBy: { trafficBoost: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      keywords,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return NextResponse.json(
      { error: "Failed to fetch keywords" },
      { status: 500 }
    );
  }
}

// POST - Discover keywords for a site
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { siteId } = body;

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    // Get the site and its brand profile
    const site = await prisma.wordPressSite.findFirst({
      where: { id: siteId, userId: session.user.id },
      include: { brandProfile: true },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (!site.brandProfile) {
      return NextResponse.json(
        { error: "Please analyze the website first to create a brand profile" },
        { status: 400 }
      );
    }

    // Discover keywords with AI
    const result = await discoverKeywords({
      brandName: site.brandProfile.brandName,
      brandDescription: site.brandProfile.brandDescription,
      keyThemes: site.brandProfile.keyThemes,
      targetAudience: site.brandProfile.targetAudience,
    });

    // Save keywords to database
    const createdKeywords = [];
    for (const kw of result.keywords || []) {
      try {
        const keyword = await prisma.keyword.upsert({
          where: {
            profileId_keyword: {
              profileId: site.brandProfile.id,
              keyword: kw.keyword,
            },
          },
          update: {
            searchVolume: kw.searchVolume,
            difficulty: kw.difficulty,
            trafficBoost: kw.trafficBoost,
          },
          create: {
            profileId: site.brandProfile.id,
            keyword: kw.keyword,
            searchVolume: kw.searchVolume,
            difficulty: kw.difficulty,
            trafficBoost: kw.trafficBoost,
            status: "pending",
          },
        });
        createdKeywords.push(keyword);
      } catch (e) {
        console.error("Error creating keyword:", e);
      }
    }

    return NextResponse.json({
      success: true,
      keywords: createdKeywords,
    });
  } catch (error) {
    console.error("Error discovering keywords:", error);
    return NextResponse.json(
      { error: "Failed to discover keywords" },
      { status: 500 }
    );
  }
}
