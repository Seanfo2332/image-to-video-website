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
  Images,
  Mic2,
  Coins,
  PenTool,
  Globe,
  MapPin,
} from "lucide-react";
import { useState } from "react";

// SEO & GEO category
const seoGeoItems = [
  { name: "SEO Writer", href: "/seo-writer", icon: PenTool },
  { name: "GEO Content", href: "/dashboard/geo-content", icon: MapPin },
];

// Image & Video category
const mediaItems = [
  { name: "Prompt Generator", href: "/dashboard/create", icon: Wand2 },
  { name: "Image Generator", href: "/dashboard/image-generator", icon: ImageIcon },
  { name: "Video Generator", href: "/dashboard/video-generator", icon: Video },
  { name: "Lip Sync Video", href: "/dashboard/lip-sync", icon: Mic2 },
  { name: "My Images", href: "/dashboard/images", icon: Images },
  { name: "My Videos", href: "/dashboard/videos", icon: FileVideo },
];

// Other items
const otherItems = [
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Billing", href: "/dashboard/billing", icon: Coins },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  };

  const NavItem = ({ item, onClick }: { item: { name: string; href: string; icon: any }; onClick?: () => void }) => {
    const active = isActive(item.href);
    return (
      <Link href={item.href} onClick={onClick}>
        <motion.div
          whileHover={{ x: 4 }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
            active
              ? "bg-[#D1F5F3] text-[#089691] border border-[#0ABAB5]/30"
              : "text-slate-600 hover:text-[#0ABAB5] hover:bg-slate-50"
          }`}
        >
          <item.icon className="w-4 h-4" />
          <span className="font-medium text-sm">{item.name}</span>
        </motion.div>
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img src="/alphafin-full-logo.png" alt="AlphaFin" className="h-10 w-auto" />
        </Link>
      </div>

      {/* User Profile */}
      {session?.user && (
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center overflow-hidden flex-shrink-0">
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
              <p className="text-sm font-semibold text-[#1E293B] truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Dashboard Home */}
        <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
          <motion.div
            whileHover={{ x: 4 }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              pathname === "/dashboard"
                ? "bg-[#D1F5F3] text-[#089691] border border-[#0ABAB5]/30"
                : "text-slate-600 hover:text-[#0ABAB5] hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </motion.div>
        </Link>

        {/* SEO & GEO Category */}
        <div className="pt-4">
          <p className="px-4 py-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-3 h-3" />
            SEO & GEO
          </p>
          <div className="space-y-1">
            {seoGeoItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={() => setIsMobileOpen(false)} />
            ))}
          </div>
        </div>

        {/* Image & Video Category */}
        <div className="pt-4">
          <p className="px-4 py-2 text-xs font-semibold text-[#0ABAB5] uppercase tracking-wider flex items-center gap-2">
            <Video className="w-3 h-3" />
            Image & Video
          </p>
          <div className="space-y-1">
            {mediaItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={() => setIsMobileOpen(false)} />
            ))}
          </div>
        </div>

        {/* Other */}
        <div className="pt-4">
          <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Other
          </p>
          <div className="space-y-1">
            {otherItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={() => setIsMobileOpen(false)} />
            ))}
          </div>
        </div>

        {/* Admin Link (if admin) */}
        {session?.user?.role === "admin" && (
          <div className="pt-4">
            <p className="px-4 py-2 text-xs font-semibold text-violet-600 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Administration
            </p>
            <Link href="/admin/dashboard" onClick={() => setIsMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-violet-600 hover:text-violet-700 hover:bg-violet-50 transition-all"
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium text-sm">Admin Panel</span>
              </motion.div>
            </Link>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <Link href="/" onClick={() => setIsMobileOpen(false)}>
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:text-[#0ABAB5] hover:bg-slate-50 transition-all"
          >
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm">Back to Site</span>
          </motion.div>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
        >
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Sign Out</span>
          </motion.div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/alphafin-logo.png" alt="AlphaFin" className="h-8 w-auto" />
            <span className="text-lg font-bold text-[#1E293B]">AlphaFin</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-[#1E293B] rounded-lg hover:bg-slate-100"
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
              className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-200 flex flex-col z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex-col z-50">
        <SidebarContent />
      </aside>
    </>
  );
}
