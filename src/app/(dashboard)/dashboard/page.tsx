"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wand2,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
  FileVideo,
  History,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Activity,
  Trophy,
} from "lucide-react";

// Types for stats and recent activity
interface DashboardStats {
  videosCreated: number;
  promptsGenerated: number;
  activeWorkflows: number;
}

interface RecentActivity {
  id: string;
  type: "prompt" | "video";
  title: string;
  status: "completed" | "processing" | "failed";
  createdAt: string;
}

const quickActions = [
  {
    name: "Prompt Generator",
    description: "Create AI prompts for video generation",
    href: "/dashboard/create",
    icon: Wand2,
    color: "tiffany",
  },
  {
    name: "My Videos",
    description: "View and download your generated videos",
    href: "/dashboard/videos",
    icon: FileVideo,
    color: "gold",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    videosCreated: 0,
    promptsGenerated: 0,
    activeWorkflows: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats and recent activity from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/activity"),
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: RecentActivity["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const statsConfig = [
    {
      name: "Videos Created",
      value: stats.videosCreated,
      icon: FileVideo,
      href: "/dashboard/videos",
      iconBg: "bg-[#D1F5F3]",
      iconColor: "text-[#0ABAB5]",
    },
    {
      name: "Prompts Generated",
      value: stats.promptsGenerated,
      icon: Wand2,
      href: "/dashboard/history",
      iconBg: "bg-[#D4AF37]/10",
      iconColor: "text-[#D4AF37]",
    },
    {
      name: "Active Workflows",
      value: stats.activeWorkflows,
      icon: Activity,
      href: "/dashboard/history?status=processing",
      iconBg: "bg-[#1E3A5F]/10",
      iconColor: "text-[#1E3A5F]",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-2">
          {greeting()}, {session?.user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-[#334155] text-lg">
          Welcome to your AI video generation dashboard.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
      >
        {statsConfig.map((stat, index) => (
          <Link key={stat.name} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm cursor-pointer hover:shadow-premium hover:border-[#0ABAB5]/20 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#334155] text-sm mb-1">
                    {stat.name}
                  </p>
                  {isLoading ? (
                    <div className="h-9 w-16 bg-[#F1F5F9] rounded animate-pulse" />
                  ) : (
                    <p className="text-3xl font-semibold text-[#1A1A2E]">{stat.value}</p>
                  )}
                </div>
                <div className={`w-14 h-14 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-[#334155] group-hover:text-[#0ABAB5] transition-colors">
                <span>View details</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#D4AF37]" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quickActions.map((action, index) => (
            <Link key={action.name} href={action.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="p-6 rounded-2xl bg-white border border-[#E2E8F0] cursor-pointer group relative overflow-hidden hover:shadow-premium-lg transition-all duration-200"
              >
                {/* Gold accent line for premium action */}
                {action.color === "gold" && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
                )}

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    action.color === "tiffany"
                      ? "bg-[#D1F5F3] group-hover:bg-[#0ABAB5]"
                      : "bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]"
                  } transition-colors duration-200`}>
                    <action.icon className={`w-7 h-7 ${
                      action.color === "tiffany"
                        ? "text-[#0ABAB5] group-hover:text-white"
                        : "text-[#D4AF37] group-hover:text-white"
                    } transition-colors duration-200`} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A2E] mb-2 flex items-center gap-2">
                    {action.name}
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#0ABAB5]" />
                  </h3>
                  <p className="text-[#334155]">{action.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1A1A2E] flex items-center gap-2">
            <History className="w-5 h-5 text-[#0ABAB5]" />
            Recent Activity
          </h2>
          <Link
            href="/dashboard/history"
            className="text-sm text-[#334155] hover:text-[#0ABAB5] transition-colors flex items-center gap-1"
          >
            View all
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-[#F1F5F9] rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-[#F1F5F9] rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] text-center">
            <History className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
            <p className="text-[#334155] mb-4">No recent activity yet</p>
            <Link href="/dashboard/create">
              <button className="px-4 py-2 rounded-lg bg-[#D1F5F3] text-[#089691] text-sm font-medium hover:bg-[#0ABAB5]/20 transition-colors">
                Create your first prompt
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0ABAB5]/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === "prompt"
                      ? "bg-[#D4AF37]/10"
                      : "bg-[#D1F5F3]"
                  }`}>
                    {activity.type === "prompt" ? (
                      <Wand2 className="w-5 h-5 text-[#D4AF37]" />
                    ) : (
                      <FileVideo className="w-5 h-5 text-[#0ABAB5]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1A1A2E] font-medium truncate">{activity.title}</p>
                    <p className="text-sm text-[#334155]">{formatDate(activity.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                    <span className={`text-sm ${
                      activity.status === "completed" ? "text-emerald-500" :
                      activity.status === "processing" ? "text-[#D4AF37]" :
                      "text-red-500"
                    }`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Getting Started
        </h2>
        <div className="space-y-5">
          {[
            {
              step: 1,
              title: "Create a Prompt",
              description: "Use the Prompt Generator to create AI-optimized prompts for your video content.",
            },
            {
              step: 2,
              title: "Track Progress",
              description: "Monitor your workflow status in the History page. You can cancel running workflows if needed.",
            },
            {
              step: 3,
              title: "Download Videos",
              description: "Once complete, find your videos in My Videos and download them to your computer.",
            },
          ].map((item, index) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#D1F5F3] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#089691]">{item.step}</span>
              </div>
              <div>
                <h4 className="text-[#1A1A2E] font-medium">{item.title}</h4>
                <p className="text-[#334155] text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/dashboard/create">
          <button className="mt-6 px-6 py-3 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium shadow-lg shadow-[#0ABAB5]/20 flex items-center gap-2 transition-all duration-200">
            <Sparkles className="w-5 h-5" />
            Start Creating
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
