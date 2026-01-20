"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

interface SignupsChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function SignupsChart({ data }: SignupsChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="liquid-glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">
        Signups (Last 30 Days)
      </h3>

      <div className="h-48 flex items-end gap-1">
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 100;
          return (
            <motion.div
              key={item.date}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 4)}%` }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
              className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t hover:from-cyan-400 hover:to-blue-400 transition-colors cursor-pointer group relative"
              title={`${format(parseISO(item.date), "MMM d")}: ${item.count} signups`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  <p className="font-medium">{format(parseISO(item.date), "MMM d")}</p>
                  <p className="text-neutral-400">{item.count} signups</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>{format(parseISO(data[0]?.date || new Date().toISOString()), "MMM d")}</span>
        <span>{format(parseISO(data[data.length - 1]?.date || new Date().toISOString()), "MMM d")}</span>
      </div>
    </motion.div>
  );
}
