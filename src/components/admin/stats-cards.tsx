"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, Shield, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    newUsersThisWeek: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/25",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      gradient: "from-emerald-500 to-[#0ABAB5]",
      shadow: "shadow-emerald-500/25",
    },
    {
      title: "Admins",
      value: stats.adminUsers,
      icon: Shield,
      gradient: "from-violet-500 to-purple-500",
      shadow: "shadow-violet-500/25",
    },
    {
      title: "New This Week",
      value: stats.newUsersThisWeek,
      icon: TrendingUp,
      gradient: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow}`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-[#1E293B] mb-1">{card.value}</p>
          <p className="text-slate-500 text-sm">{card.title}</p>
        </motion.div>
      ))}
    </div>
  );
}
