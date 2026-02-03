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
      iconBg: "bg-[#D1F5F3]",
      iconColor: "text-[#0ABAB5]",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Admins",
      value: stats.adminUsers,
      icon: Shield,
      iconBg: "bg-[#1E3A5F]/10",
      iconColor: "text-[#1E3A5F]",
    },
    {
      title: "New This Week",
      value: stats.newUsersThisWeek,
      icon: TrendingUp,
      iconBg: "bg-[#D4AF37]/10",
      iconColor: "text-[#D4AF37]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-premium hover:border-[#0ABAB5]/20 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}
            >
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A2E] mb-1">{card.value}</p>
          <p className="text-[#334155] text-sm">{card.title}</p>
        </motion.div>
      ))}
    </div>
  );
}
