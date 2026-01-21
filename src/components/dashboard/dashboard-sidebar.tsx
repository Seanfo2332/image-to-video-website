"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wand2,
  LogOut,
  Users,
  Shield,
  Menu,
  X,
  FileVideo,
  History,
  Home,
  Video,
  ImageIcon,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Prompt Generator", href: "/dashboard/create", icon: Wand2 },
  { name: "Image Generator", href: "/dashboard/image-generator", icon: ImageIcon },
  { name: "Video Generator", href: "/dashboard/video-generator", icon: Video },
  { name: "My Videos", href: "/dashboard/videos", icon: FileVideo },
  { name: "History", href: "/dashboard/history", icon: History },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">AvatarAI</span>
            <p className="text-xs text-cyan-400">Video Generator</p>
          </div>
        </Link>
      </div>

      {/* User Profile */}
      {session?.user && (
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden flex-shrink-0">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <p className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* Admin Link (if admin) */}
        {session?.user?.role === "admin" && (
          <>
            <div className="my-4 border-t border-white/5" />
            <p className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Administration
            </p>
            <Link href="/admin/dashboard" onClick={() => setIsMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Admin Panel</span>
              </motion.div>
            </Link>
          </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link href="/" onClick={() => setIsMobileOpen(false)}>
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Site</span>
          </motion.div>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
        >
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </motion.div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">AvatarAI</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-white rounded-lg hover:bg-white/5"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] bg-[#0f0f14] border-r border-white/5 flex flex-col z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#0f0f14] border-r border-white/10 flex-col z-50">
        <SidebarContent />
      </aside>
    </>
  );
}
