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

    if (!siteId && !profileId) {
      return NextResponse.json(
        { error: "Site ID or Profile ID required" },
        { status: 400 }
      );
    }

    let keywords;

    if (profileId) {
      keywords = await prisma.keyword.findMany({
        where: { profileId },
        include: {
          _count: {
            select: { articles: true },
          },
        },
        orderBy: { trafficBoost: "desc" },
      });
    } else if (siteId) {
      // Get profile for the site first
      const profile = await prisma.brandProfile.findFirst({
        where: {
          site: {
            id: siteId,
            userId: session.user.id,
          },
        },
      });

      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      keywords = await prisma.keyword.findMany({
        where: { profileId: profile.id },
        include: {
          _count: {
            select: { articles: true },
          },
        },
        orderBy: { trafficBoost: "desc" },
      });
    }

    return NextResponse.json(keywords);
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
