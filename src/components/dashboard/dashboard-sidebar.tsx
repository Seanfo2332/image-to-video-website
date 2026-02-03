"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wand2,
  LogOut,
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
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
            active
              ? "bg-[#D1F5F3] text-[#089691] border border-[#0ABAB5]/20"
              : "text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9]"
          }`}
        >
          <item.icon className="w-4 h-4" />
          <span className="font-medium text-sm">{item.name}</span>
        </div>
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <Link href="/dashboard" className="flex items-center">
          <img src="/alphafin-full-logo.png" alt="AlphaFin" className="h-10 w-auto" />
        </Link>
      </div>

      {/* User Profile with gold accent */}
      {session?.user && (
        <div className="p-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#F1F5F9]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-[#D4AF37]/30">
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
              <p className="text-sm font-semibold text-[#1A1A2E] truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-xs text-[#334155] truncate">
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
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              pathname === "/dashboard"
                ? "bg-[#D1F5F3] text-[#089691] border border-[#0ABAB5]/20"
                : "text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </div>
        </Link>

        {/* SEO & GEO Category */}
        <div className="pt-5">
          <p className="px-4 py-2 text-[10px] font-semibold text-[#0ABAB5] uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-3 h-3" />
            SEO & GEO
          </p>
          <div className="space-y-1 mt-1">
            {seoGeoItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={() => setIsMobileOpen(false)} />
            ))}
          </div>
        </div>

        {/* Image & Video Category */}
        <div className="pt-5">
          <p className="px-4 py-2 text-[10px] font-semibold text-[#0ABAB5] uppercase tracking-wider flex items-center gap-2">
            <Video className="w-3 h-3" />
            Image & Video
          </p>
          <div className="space-y-1 mt-1">
            {mediaItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={() => setIsMobileOpen(false)} />
            ))}
          </div>
        </div>

        {/* Other */}
        <div className="pt-5">
          <p className="px-4 py-2 text-[10px] font-semibold text-[#334155] uppercase tracking-wider">
            Other
          </p>
          <div className="space-y-1 mt-1">
            {otherItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={() => setIsMobileOpen(false)} />
            ))}
          </div>
        </div>

        {/* Admin Link (if admin) */}
        {session?.user?.role === "admin" && (
          <div className="pt-5">
            <p className="px-4 py-2 text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Administration
            </p>
            <Link href="/admin/dashboard" onClick={() => setIsMobileOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-200 mt-1">
                <Shield className="w-4 h-4" />
                <span className="font-medium text-sm">Admin Panel</span>
              </div>
            </Link>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-1">
        <Link href="/" onClick={() => setIsMobileOpen(false)}>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#334155] hover:text-[#0ABAB5] hover:bg-[#F1F5F9] transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm">Back to Site</span>
          </div>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Sign Out</span>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center">
            <img src="/alphafin-full-logo.png" alt="AlphaFin" className="h-8 w-auto" />
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-[#1A1A2E] rounded-lg hover:bg-[#F1F5F9] transition-colors"
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
              className="md:hidden fixed inset-0 bg-[#1A1A2E]/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#E2E8F0] flex flex-col z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#E2E8F0] flex-col z-50">
        <SidebarContent />
      </aside>
    </>
  );
}
