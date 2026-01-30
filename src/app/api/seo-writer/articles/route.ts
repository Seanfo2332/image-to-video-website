import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { generateArticle, generateImagePrompt, generateImage } from "@/lib/openai";

// GET - List articles for a site
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const status = searchParams.get("status");

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

    const where: { siteId: string; status?: string } = { siteId };
    if (status) {
      where.status = status;
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        keyword: {
          select: {
            keyword: true,
            trafficBoost: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST - Generate a new article
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      siteId,
      keywordId,
      keyword: keywordText, // Allow passing keyword text directly
      customTitle,
      articleLength = "medium",
      scheduledFor,
      generateFeaturedImage = true,
    } = body;

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    if (!keywordId && !keywordText) {
      return NextResponse.json(
        { error: "Keyword ID or keyword text required" },
        { status: 400 }
      );
    }

    // Get site with brand profile
    const site = await prisma.wordPressSite.findFirst({
      where: { id: siteId, userId: session.user.id },
      include: { brandProfile: true },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (!site.brandProfile) {
      return NextResponse.json(
        { error: "Brand profile not found" },
        { status: 400 }
      );
    }

    // Get or create the keyword
    let keyword = null;
    let targetKeyword = keywordText;

    if (keywordId) {
      keyword = await prisma.keyword.findFirst({
        where: { id: keywordId, profileId: site.brandProfile.id },
      });
      if (!keyword) {
        return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
      }
      targetKeyword = keyword.keyword;
    } else if (keywordText) {
      // Create keyword if it doesn't exist
      keyword = await prisma.keyword.upsert({
        where: {
          profileId_keyword: {
            profileId: site.brandProfile.id,
            keyword: keywordText,
          },
        },
        create: {
          profileId: site.brandProfile.id,
          keyword: keywordText,
          status: "pending",
        },
        update: {},
      });
    }

    // Generate article with AI
    const articleData = await generateArticle(
      targetKeyword,
      {
        brandName: site.brandProfile.brandName,
        brandDescription: site.brandProfile.brandDescription,
        tone: site.brandProfile.tone,
        brandVoice: site.brandProfile.brandVoice,
        contentStyle: site.brandProfile.contentStyle,
        targetAudience: site.brandProfile.targetAudience,
      },
      {
        articleLength: articleLength as "short" | "medium" | "long" | "guide",
        customTitle,
      }
    );

    // Generate featured image if requested
    let featuredImage = null;
    if (generateFeaturedImage && articleData.title) {
      try {
        const imagePrompt = await generateImagePrompt(
          articleData.title,
          site.brandProfile.imageStyle
        );
        featuredImage = await generateImage(imagePrompt);
      } catch (imageError) {
        console.error("Image generation error:", imageError);
        // Continue without image
      }
    }

    // Determine status based on scheduledFor
    const status = scheduledFor ? "scheduled" : "draft";

    // Create article in database
    const article = await prisma.article.create({
      data: {
        siteId: site.id,
        keywordId: keyword?.id,
        title: customTitle || articleData.title || `Article about ${targetKeyword}`,
        slug: articleData.slug || targetKeyword.toLowerCase().replace(/\s+/g, "-"),
        content: articleData.content || "",
        metaDescription: articleData.metaDescription || "",
        featuredImage,
        wordCount: articleData.wordCount || 0,
        articleLength,
        status,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      },
    });

    // Update keyword status
    if (keyword) {
      await prisma.keyword.update({
        where: { id: keyword.id },
        data: { status: scheduledFor ? "scheduled" : "scheduled" },
      });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error generating article:", error);
    return NextResponse.json(
      { error: "Failed to generate article" },
      { status: 500 }
    );
  }
}
