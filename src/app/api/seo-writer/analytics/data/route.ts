import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Helper to refresh access token if expired
async function refreshAccessToken(gsc: {
  id: string;
  refreshToken: string;
  expiresAt: Date;
  accessToken: string;
}) {
  if (new Date() < gsc.expiresAt) {
    return gsc.accessToken;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      refresh_token: gsc.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const tokens = await response.json();
  const { access_token, expires_in } = tokens;

  // Update token in database
  await prisma.googleSearchConsole.update({
    where: { id: gsc.id },
    data: {
      accessToken: access_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
    },
  });

  return access_token;
}

// GET - Fetch GSC analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const range = searchParams.get("range") || "28d"; // 7d, 28d, 3m

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    // Verify site ownership and get GSC connection
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

    if (!site.googleSearchConsole) {
      return NextResponse.json({ error: "GSC not connected" }, { status: 400 });
    }

    // Get fresh access token
    const accessToken = await refreshAccessToken(site.googleSearchConsole);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (range) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "3m":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      default: // 28d
        startDate.setDate(startDate.getDate() - 28);
    }

    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const propertyUrl = site.googleSearchConsole.propertyUrl;

    // Fetch aggregated data
    const [queriesResponse, pagesResponse] = await Promise.all([
      // Top queries
      fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
          propertyUrl
        )}/searchAnalytics/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            dimensions: ["query"],
            rowLimit: 25,
          }),
        }
      ),
      // Top pages
      fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
          propertyUrl
        )}/searchAnalytics/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            dimensions: ["page"],
            rowLimit: 25,
          }),
        }
      ),
    ]);

    const queriesData = queriesResponse.ok ? await queriesResponse.json() : { rows: [] };
    const pagesData = pagesResponse.ok ? await pagesResponse.json() : { rows: [] };

    // Calculate totals
    let totalClicks = 0;
    let totalImpressions = 0;
    let totalCTR = 0;
    let totalPosition = 0;
    let count = 0;

    const topQueries =
      queriesData.rows?.map((row: any) => {
        totalClicks += row.clicks;
        totalImpressions += row.impressions;
        totalCTR += row.ctr;
        totalPosition += row.position;
        count++;
        return {
          query: row.keys[0],
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        };
      }) || [];

    const topPages =
      pagesData.rows?.map((row: any) => ({
        page: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })) || [];

    return NextResponse.json({
      totalClicks,
      totalImpressions,
      averageCTR: count > 0 ? totalCTR / count : 0,
      averagePosition: count > 0 ? totalPosition / count : 0,
      topQueries,
      topPages,
    });
  } catch (error) {
    console.error("Error fetching GSC data:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
