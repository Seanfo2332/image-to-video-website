"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";

interface RecentUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  provider: string;
}

interface RecentUsersProps {
  users: RecentUser[];
}

export function RecentUsers({ users }: RecentUsersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="liquid-glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Recent Signups</h3>

      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No recent signups</p>
        ) : (
          users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.email}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user.name || "No name"}
                </p>
                <p className="text-neutral-500 text-sm truncate">{user.email}</p>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-neutral-400 capitalize">
                  {user.provider}
                </span>
                <p className="text-xs text-neutral-500 mt-1">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
