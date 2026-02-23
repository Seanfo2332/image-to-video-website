import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { generateArticle, generateImagePrompt, generateImage } from "@/lib/openai";

// POST - Generate scheduled articles to fill the calendar (session-authenticated)
// Called after setup to immediately populate the calendar instead of waiting for cron
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

    // Get site with brand profile and pending keywords
    const site = await prisma.wordPressSite.findFirst({
      where: { id: siteId, userId: session.user.id },
      include: {
        brandProfile: {
          include: {
            keywords: {
              where: { status: "pending" },
              orderBy: { trafficBoost: "desc" },
            },
          },
        },
      },
    });

    if (!site?.brandProfile || site.brandProfile.keywords.length === 0) {
      return NextResponse.json({ error: "No pending keywords" }, { status: 400 });
    }

    // Get or create auto-publish settings
    let settings = await prisma.autoPublishSettings.findUnique({
      where: { siteId },
    });

    if (!settings) {
      settings = await prisma.autoPublishSettings.create({
        data: {
          siteId,
          enabled: true,
          publishTime: "09:00",
          timezone: "Asia/Kuala_Lumpur",
          daysAhead: 7,
        },
      });
    }

    const { daysAhead, publishTime } = settings;

    // Find which days already have scheduled articles
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const existingArticles = await prisma.article.findMany({
      where: {
        siteId,
        scheduledFor: { gte: today, lte: futureDate },
      },
      select: { scheduledFor: true },
    });

    const scheduledDates = new Set(
      existingArticles.map((a) => a.scheduledFor?.toISOString().split("T")[0])
    );

    // Find empty days
    const emptyDays: Date[] = [];
    for (let i = 0; i <= daysAhead; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      if (!scheduledDates.has(dateStr)) {
        emptyDays.push(date);
      }
    }

    if (emptyDays.length === 0) {
      return NextResponse.json({ message: "All days already filled", generated: 0 });
    }

    // Generate articles (max 3 per request to avoid timeout)
    const maxPerRequest = 3;
    const daysToFill = emptyDays.slice(0, maxPerRequest);
    const pendingKeywords = site.brandProfile.keywords;
    const results = [];

    for (let i = 0; i < daysToFill.length && i < pendingKeywords.length; i++) {
      const targetDate = daysToFill[i];
      const keyword = pendingKeywords[i];

      try {
        const articleData = await generateArticle(keyword.keyword, {
          brandName: site.brandProfile.brandName,
          brandDescription: site.brandProfile.brandDescription,
          tone: site.brandProfile.tone,
          brandVoice: site.brandProfile.brandVoice,
          contentStyle: site.brandProfile.contentStyle,
          targetAudience: site.brandProfile.targetAudience,
        });

        let featuredImage = null;
        try {
          const imagePrompt = await generateImagePrompt(
            articleData.title,
            site.brandProfile.imageStyle
          );
          featuredImage = await generateImage(imagePrompt);
        } catch {
          // Continue without image
        }

        const [hours, minutes] = publishTime.split(":").map(Number);
        const scheduledFor = new Date(targetDate);
        scheduledFor.setHours(hours, minutes, 0, 0);

        const article = await prisma.article.create({
          data: {
            siteId: site.id,
            keywordId: keyword.id,
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            metaDescription: articleData.metaDescription,
            featuredImage,
            wordCount: articleData.wordCount || 0,
            articleLength: "medium",
            status: "scheduled",
            scheduledFor,
          },
        });

        await prisma.keyword.update({
          where: { id: keyword.id },
          data: { status: "scheduled" },
        });

        results.push({ articleId: article.id, keyword: keyword.keyword, date: scheduledFor.toISOString() });
      } catch (error) {
        console.error(`Failed to generate article for "${keyword.keyword}":`, error);
        results.push({ keyword: keyword.keyword, error: "generation failed" });
      }
    }

    return NextResponse.json({
      message: `Generated ${results.filter((r) => "articleId" in r).length} articles`,
      generated: results.filter((r) => "articleId" in r).length,
      remaining: emptyDays.length - daysToFill.length,
      results,
    });
  } catch (error) {
    console.error("Error generating schedule:", error);
    return NextResponse.json(
      { error: "Failed to generate schedule" },
      { status: 500 }
    );
  }
}
