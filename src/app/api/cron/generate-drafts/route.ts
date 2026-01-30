import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateArticle, generateImagePrompt, generateImage } from "@/lib/openai";

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;

  return authHeader === `Bearer ${cronSecret}`;
}

// POST - Auto-generate articles to fill 7 days ahead
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    if (!verifyCronSecret(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all sites with auto-publish enabled
    const sitesWithAutoPublish = await prisma.autoPublishSettings.findMany({
      where: {
        enabled: true,
      },
      include: {
        site: {
          include: {
            brandProfile: {
              include: {
                keywords: {
                  where: {
                    status: "pending", // Only pending keywords
                  },
                  orderBy: {
                    trafficBoost: "desc", // Prioritize high-traffic keywords
                  },
                },
              },
            },
          },
        },
      },
    });

    const results = [];

    for (const settings of sitesWithAutoPublish) {
      const { site, daysAhead, publishTime, timezone } = settings;

      if (!site.brandProfile || site.brandProfile.keywords.length === 0) {
        results.push({
          siteId: site.id,
          siteName: site.name,
          status: "skipped",
          reason: "No brand profile or pending keywords",
        });
        continue;
      }

      // Check how many scheduled articles exist for the next N days
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const scheduledArticles = await prisma.article.findMany({
        where: {
          siteId: site.id,
          status: "scheduled",
          scheduledFor: {
            gte: today,
            lte: futureDate,
          },
        },
        select: {
          scheduledFor: true,
        },
      });

      // Get dates that already have scheduled articles
      const scheduledDates = new Set(
        scheduledArticles.map((a) =>
          a.scheduledFor?.toISOString().split("T")[0]
        )
      );

      // Find empty days that need articles (including today)
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
        results.push({
          siteId: site.id,
          siteName: site.name,
          status: "complete",
          reason: `All ${daysAhead} days filled`,
        });
        continue;
      }

      // Generate articles for empty days (max 3 per run to avoid timeout)
      const maxArticlesPerRun = 3;
      const daysToFill = emptyDays.slice(0, maxArticlesPerRun);
      const pendingKeywords = site.brandProfile.keywords;

      const siteResults = [];

      for (let i = 0; i < daysToFill.length && i < pendingKeywords.length; i++) {
        const targetDate = daysToFill[i];
        const keyword = pendingKeywords[i];

        try {
          // Generate article content
          const articleData = await generateArticle(keyword.keyword, {
            brandName: site.brandProfile.brandName,
            brandDescription: site.brandProfile.brandDescription,
            tone: site.brandProfile.tone,
            brandVoice: site.brandProfile.brandVoice,
            contentStyle: site.brandProfile.contentStyle,
            targetAudience: site.brandProfile.targetAudience,
          });

          // Generate featured image
          let featuredImage = null;
          try {
            const imagePrompt = await generateImagePrompt(
              articleData.title,
              site.brandProfile.imageStyle
            );
            featuredImage = await generateImage(imagePrompt);
          } catch (imgError) {
            console.error("Image generation failed:", imgError);
          }

          // Set scheduled time (9:00 AM in site's timezone)
          const [hours, minutes] = publishTime.split(":").map(Number);
          const scheduledFor = new Date(targetDate);
          scheduledFor.setHours(hours, minutes, 0, 0);

          // Create article
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

          // Update keyword status
          await prisma.keyword.update({
            where: { id: keyword.id },
            data: { status: "scheduled" },
          });

          siteResults.push({
            articleId: article.id,
            keyword: keyword.keyword,
            scheduledFor: scheduledFor.toISOString(),
            status: "generated",
          });
        } catch (error) {
          console.error(`Failed to generate article for keyword "${keyword.keyword}":`, error);
          siteResults.push({
            keyword: keyword.keyword,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      results.push({
        siteId: site.id,
        siteName: site.name,
        status: "processed",
        emptyDays: emptyDays.length,
        articlesGenerated: siteResults.filter((r) => r.status === "generated").length,
        details: siteResults,
      });
    }

    return NextResponse.json({
      message: `Processed ${results.length} sites`,
      results,
    });
  } catch (error) {
    console.error("Error in auto-generate cron:", error);
    return NextResponse.json(
      { error: "Failed to run auto-generate" },
      { status: 500 }
    );
  }
}

// Also allow GET for Vercel Cron (which uses GET by default)
export async function GET(request: NextRequest) {
  return POST(request);
}
