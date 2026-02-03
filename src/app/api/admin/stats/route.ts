import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const weekAgo = subDays(now, 7);
    const monthAgo = subDays(now, 30);

    // Get basic stats
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      newUsersThisWeek,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: weekAgo,
          },
        },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          accounts: {
            select: { provider: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    // Initialize signups by day map with zeros
    const signupsByDay = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(now, i), "yyyy-MM-dd");
      signupsByDay.set(date, 0);
    }

    // Get users in range (single query, no redundant groupBy)
    const usersInRange = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: monthAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Count users per day
    usersInRange.forEach((user) => {
      const date = format(user.createdAt, "yyyy-MM-dd");
      if (signupsByDay.has(date)) {
        signupsByDay.set(date, signupsByDay.get(date)! + 1);
      }
    });

    const signupsChart = Array.from(signupsByDay.entries()).map(
      ([date, count]) => ({
        date,
        count,
      })
    );

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        newUsersThisWeek,
      },
      recentUsers: recentUsers.map((user) => ({
        ...user,
        provider: user.accounts[0]?.provider || "credentials",
        accounts: undefined,
      })),
      signupsChart,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
