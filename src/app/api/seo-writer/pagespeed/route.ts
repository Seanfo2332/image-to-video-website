import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

const PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;

// GET - Get PageSpeed score for a site (cached or fresh)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const refresh = searchParams.get("refresh") === "true";

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
        pageSpeedCache: true,
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Check if we have a recent cache (less than 24 hours old)
    const cacheAge = site.pageSpeedCache
      ? Date.now() - new Date(site.pageSpeedCache.checkedAt).getTime()
      : Infinity;
    const cacheValid = cacheAge < 24 * 60 * 60 * 1000; // 24 hours

    if (site.pageSpeedCache && cacheValid && !refresh) {
      return NextResponse.json({
        score: site.pageSpeedCache.score,
        loadTime: site.pageSpeedCache.loadTime,
        contentTime: site.pageSpeedCache.contentTime,
        pageJump: site.pageSpeedCache.pageJump,
        checkedAt: site.pageSpeedCache.checkedAt,
        cached: true,
      });
    }

    // Fetch fresh data from PageSpeed Insights API
    const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    apiUrl.searchParams.set("url", site.url);
    apiUrl.searchParams.set("category", "performance");
    apiUrl.searchParams.set("strategy", "mobile");
    if (PAGESPEED_API_KEY) {
      apiUrl.searchParams.set("key", PAGESPEED_API_KEY);
    }

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      console.error("PageSpeed API error:", await response.text());

      // Return cached data if available, even if stale
      if (site.pageSpeedCache) {
        return NextResponse.json({
          score: site.pageSpeedCache.score,
          loadTime: site.pageSpeedCache.loadTime,
          contentTime: site.pageSpeedCache.contentTime,
          pageJump: site.pageSpeedCache.pageJump,
          checkedAt: site.pageSpeedCache.checkedAt,
          cached: true,
          stale: true,
        });
      }

      return NextResponse.json(
        { error: "Failed to fetch PageSpeed data" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const lighthouseResult = data.lighthouseResult;

    // Extract metrics
    const score = Math.round((lighthouseResult.categories.performance.score || 0) * 100);

    // Get timing metrics (in seconds)
    const audits = lighthouseResult.audits;
    const loadTime = (audits["interactive"]?.numericValue || 0) / 1000; // Time to Interactive
    const contentTime = (audits["first-contentful-paint"]?.numericValue || 0) / 1000; // FCP
    const cls = audits["cumulative-layout-shift"]?.numericValue || 0; // CLS
    const pageJump = cls > 0.1; // CLS > 0.1 is considered poor

    // Cache the result
    await prisma.pageSpeedCache.upsert({
      where: { siteId },
      create: {
        siteId,
        score,
        loadTime,
        contentTime,
        pageJump,
        checkedAt: new Date(),
      },
      update: {
        score,
        loadTime,
        contentTime,
        pageJump,
        checkedAt: new Date(),
      },
    });

    return NextResponse.json({
      score,
      loadTime,
      contentTime,
      pageJump,
      checkedAt: new Date().toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching PageSpeed:", error);
    return NextResponse.json(
      { error: "Failed to fetch PageSpeed data" },
      { status: 500 }
    );
  }
}
