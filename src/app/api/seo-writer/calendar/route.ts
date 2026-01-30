import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

// GET - Get articles for calendar view (grouped by date)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const month = searchParams.get("month"); // Format: YYYY-MM
    const year = searchParams.get("year");

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    // Verify site ownership
    const site = await prisma.wordPressSite.findFirst({
      where: {
        id: siteId,
        userId: session.user.id,
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Build date filter if month/year provided
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      dateFilter = {
        OR: [
          {
            scheduledFor: {
              gte: startDate,
              lt: endDate,
            },
          },
          {
            AND: [
              { scheduledFor: null },
              {
                createdAt: {
                  gte: startDate,
                  lt: endDate,
                },
              },
            ],
          },
        ],
      };
    }

    const articles = await prisma.article.findMany({
      where: {
        siteId,
        ...dateFilter,
      },
      select: {
        id: true,
        title: true,
        featuredImage: true,
        status: true,
        scheduledFor: true,
        createdAt: true,
        keyword: {
          select: {
            keyword: true,
          },
        },
      },
      orderBy: [
        { scheduledFor: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Group articles by date
    const grouped: Record<string, typeof articles> = {};
    articles.forEach((article) => {
      const dateKey = article.scheduledFor
        ? new Date(article.scheduledFor).toISOString().split("T")[0]
        : new Date(article.createdAt).toISOString().split("T")[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(article);
    });

    return NextResponse.json({
      articles,
      grouped,
    });
  } catch (error) {
    console.error("Error fetching calendar articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 }
    );
  }
}

// PATCH - Reschedule an article
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { articleId, scheduledFor } = body;

    if (!articleId) {
      return NextResponse.json({ error: "Article ID required" }, { status: 400 });
    }

    // Verify article ownership
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        site: {
          userId: session.user.id,
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Update the article
    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status: scheduledFor ? "scheduled" : "draft",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error rescheduling article:", error);
    return NextResponse.json(
      { error: "Failed to reschedule article" },
      { status: 500 }
    );
  }
}
