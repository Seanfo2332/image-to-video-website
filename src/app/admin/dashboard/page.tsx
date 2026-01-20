import { auth } from "../../../../auth";
import { StatsCards } from "@/components/admin/stats-cards";
import { SignupsChart } from "@/components/admin/signups-chart";
import { RecentUsers } from "@/components/admin/recent-users";

async function getStats() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return null;
  }

  // Fetch stats from API (in production, you'd call the API endpoint)
  // For server-side, we can directly use prisma
  const { prisma } = await import("@/lib/prisma");
  const { subDays, format } = await import("date-fns");

  const now = new Date();
  const weekAgo = subDays(now, 7);
  const monthAgo = subDays(now, 30);

  const [totalUsers, activeUsers, adminUsers, newUsersThisWeek, recentUsers] =
    await Promise.all([
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

  // Get signups over the last 30 days
  const signupsByDay = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(now, i), "yyyy-MM-dd");
    signupsByDay.set(date, 0);
  }

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

  usersInRange.forEach((user) => {
    const date = format(user.createdAt, "yyyy-MM-dd");
    signupsByDay.set(date, (signupsByDay.get(date) || 0) + 1);
  });

  const signupsChart = Array.from(signupsByDay.entries()).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  return {
    stats: {
      totalUsers,
      activeUsers,
      adminUsers,
      newUsersThisWeek,
    },
    recentUsers: recentUsers.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      provider: user.accounts[0]?.provider || "credentials",
    })),
    signupsChart,
  };
}

export default async function AdminDashboardPage() {
  const data = await getStats();

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-neutral-400">
          Welcome to the admin dashboard. Here&apos;s an overview of your users.
        </p>
      </div>

      <StatsCards stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SignupsChart data={data.signupsChart} />
        <RecentUsers users={data.recentUsers} />
      </div>
    </div>
  );
}
