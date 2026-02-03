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
    gradient: "from-[#0ABAB5] to-[#089691]",
    shadow: "shadow-[#0ABAB5]/25",
  },
  {
    name: "My Videos",
    description: "View and download your generated videos",
    href: "/dashboard/videos",
    icon: FileVideo,
    gradient: "from-violet-500 to-purple-500",
    shadow: "shadow-violet-500/25",
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
        return <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />;
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
      color: "text-[#0ABAB5]",
      bgColor: "from-[#D1F5F3] to-[#0ABAB5]/10",
    },
    {
      name: "Prompts Generated",
      value: stats.promptsGenerated,
      icon: Wand2,
      href: "/dashboard/history",
      color: "text-violet-500",
      bgColor: "from-violet-100 to-purple-50",
    },
    {
      name: "Active Workflows",
      value: stats.activeWorkflows,
      icon: Activity,
      href: "/dashboard/history?status=processing",
      color: "text-amber-500",
      bgColor: "from-amber-100 to-orange-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">
          {greeting()}, {session?.user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-slate-500 text-lg">
          Welcome to your AI video generation dashboard.
        </p>
      </motion.div>

      {/* Stats Cards - Clickable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {statsConfig.map((stat, index) => (
          <Link key={stat.name} href={stat.href}>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-[#0ABAB5]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm mb-1 group-hover:text-slate-600 transition-colors">
                    {stat.name}
                  </p>
                  {isLoading ? (
                    <div className="h-8 w-12 bg-slate-100 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-[#1E293B]">{stat.value}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-slate-400 group-hover:text-[#0ABAB5] transition-colors">
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
        <h2 className="text-xl font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 cursor-pointer group relative overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 ${action.shadow} shadow-lg`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                    {action.name}
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#0ABAB5]" />
                  </h3>
                  <p className="text-slate-500">{action.description}</p>
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
          <h2 className="text-xl font-semibold text-[#1E293B] flex items-center gap-2">
            <History className="w-5 h-5 text-violet-500" />
            Recent Activity
          </h2>
          <Link
            href="/dashboard/history"
            className="text-sm text-slate-500 hover:text-[#0ABAB5] transition-colors flex items-center gap-1"
          >
            View all
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-slate-100 rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No recent activity yet</p>
            <Link href="/dashboard/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-[#D1F5F3] text-[#089691] text-sm font-medium hover:bg-[#0ABAB5]/20 transition-colors"
              >
                Create your first prompt
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ x: 4 }}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0ABAB5]/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === "prompt"
                      ? "bg-violet-100"
                      : "bg-[#D1F5F3]"
                  }`}>
                    {activity.type === "prompt" ? (
                      <Wand2 className="w-5 h-5 text-violet-500" />
                    ) : (
                      <FileVideo className="w-5 h-5 text-[#0ABAB5]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1E293B] font-medium truncate">{activity.title}</p>
                    <p className="text-sm text-slate-400">{formatDate(activity.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                    <span className={`text-sm ${
                      activity.status === "completed" ? "text-emerald-500" :
                      activity.status === "processing" ? "text-amber-500" :
                      "text-red-500"
                    }`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Getting Started
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#D1F5F3] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm font-bold text-[#089691]">1</span>
            </div>
            <div>
              <h4 className="text-[#1E293B] font-medium">Create a Prompt</h4>
              <p className="text-slate-500 text-sm">
                Use the Prompt Generator to create AI-optimized prompts for your video content.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#D1F5F3] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm font-bold text-[#089691]">2</span>
            </div>
            <div>
              <h4 className="text-[#1E293B] font-medium">Track Progress</h4>
              <p className="text-slate-500 text-sm">
                Monitor your workflow status in the History page. You can cancel running workflows if needed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#D1F5F3] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm font-bold text-[#089691]">3</span>
            </div>
            <div>
              <h4 className="text-[#1E293B] font-medium">Download Videos</h4>
              <p className="text-slate-500 text-sm">
                Once complete, find your videos in My Videos and download them to your computer.
              </p>
            </div>
          </div>
        </div>
        <Link href="/dashboard/create">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(10, 186, 181, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 px-6 py-3 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium shadow-lg shadow-[#0ABAB5]/25 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
