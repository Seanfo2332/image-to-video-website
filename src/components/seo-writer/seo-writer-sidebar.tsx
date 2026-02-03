"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  Home,
  BarChart3,
  Calendar,
  FileText,
  Search,
  Settings,
  ChevronDown,
  Zap,
  Globe,
  Loader2,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { SiteSpeedModal } from "./site-speed-modal";

interface Site {
  id: string;
  name: string;
  url: string;
  isConnected: boolean;
  brandProfile: {
    brandName: string;
  } | null;
  _count: {
    articles: number;
  };
  pageSpeedCache?: {
    score: number;
    checkedAt: string;
  } | null;
}

export function SEOWriterSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const siteIdParam = searchParams.get("siteId");

  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [speedScore, setSpeedScore] = useState<number | null>(null);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (selectedSite) {
      fetchScheduledCount(selectedSite.id);
      if (selectedSite.pageSpeedCache) {
        setSpeedScore(selectedSite.pageSpeedCache.score);
      } else {
        setSpeedScore(null);
      }
    }
  }, [selectedSite]);

  useEffect(() => {
    if (sites.length > 0 && siteIdParam) {
      const site = sites.find((s) => s.id === siteIdParam);
      if (site) {
        setSelectedSite(site);
      }
    } else if (sites.length > 0 && !siteIdParam) {
      // Auto-select first site and update URL
      setSelectedSite(sites[0]);
      const newUrl = `${pathname}?siteId=${sites[0].id}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [sites, siteIdParam, pathname]);

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/seo-writer/sites");
      if (response.ok) {
        const data = await response.json();
        setSites(data);
        if (data.length > 0 && !selectedSite) {
          setSelectedSite(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScheduledCount = async (siteId: string) => {
    try {
      const response = await fetch(`/api/seo-writer/articles?siteId=${siteId}&status=scheduled`);
      if (response.ok) {
        const data = await response.json();
        setScheduledCount(data.length);
      }
    } catch (error) {
      console.error("Failed to fetch scheduled count:", error);
    }
  };

  const handleSiteChange = (site: Site) => {
    setSelectedSite(site);
    setIsDropdownOpen(false);
    // Use router.push to properly update the URL and trigger re-renders
    const basePath = pathname.split("?")[0];
    window.location.href = `${basePath}?siteId=${site.id}`;
  };

  // Use URL param as primary source, fallback to selectedSite
  const siteId = siteIdParam || selectedSite?.id;

  const navItems = [
    {
      name: "Home",
      href: `/seo-writer${siteId ? `?siteId=${siteId}` : ""}`,
      icon: Home,
      exact: true,
    },
    {
      name: "Analytics",
      href: `/seo-writer/analytics${siteId ? `?siteId=${siteId}` : ""}`,
      icon: BarChart3,
    },
    {
      name: "Calendar",
      href: `/seo-writer/calendar${siteId ? `?siteId=${siteId}` : ""}`,
      icon: Calendar,
      badge: scheduledCount > 0 ? scheduledCount : null,
    },
    {
      name: "Articles",
      href: `/seo-writer/articles${siteId ? `?siteId=${siteId}` : ""}`,
      icon: FileText,
    },
    {
      name: "Keywords",
      href: `/seo-writer/keywords${siteId ? `?siteId=${siteId}` : ""}`,
      icon: Search,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    const basePath = href.split("?")[0];
    if (exact) {
      return pathname === basePath;
    }
    return pathname.startsWith(basePath) && basePath !== "/seo-writer";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#0ABAB5] bg-[#D1F5F3]";
    if (score >= 50) return "text-[#D4AF37] bg-[#D4AF37]/10";
    return "text-red-500 bg-red-100";
  };

  const SidebarContent = () => (
    <>
      {/* Logo & Site Selector */}
      <div className="p-4 border-b border-[#E2E8F0]">
        {/* App Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center shadow-lg shadow-[#0ABAB5]/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-[#1A1A2E]">SEO Writer</span>
            <p className="text-xs text-[#0ABAB5]">AI Content</p>
          </div>
        </div>

        {/* Site Selector Dropdown */}
        {isLoading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-5 h-5 text-[#334155] animate-spin" />
          </div>
        ) : sites.length > 0 ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] hover:bg-[#E2E8F0] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-4 h-4 text-[#334155] flex-shrink-0" />
                <span className="text-[#1A1A2E] text-sm font-medium truncate">
                  {selectedSite?.name || "Select site"}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {speedScore !== null && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSpeedModalOpen(true);
                    }}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(speedScore)}`}
                  >
                    {speedScore}
                  </button>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-[#334155] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-[#E2E8F0] rounded-xl shadow-premium-lg z-50"
              >
                {sites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => handleSiteChange(site)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#F1F5F9] transition-colors ${
                      selectedSite?.id === site.id ? "bg-[#D1F5F3]" : ""
                    }`}
                  >
                    <Globe className="w-4 h-4 text-[#334155]" />
                    <span className="text-sm text-[#1A1A2E] truncate">{site.name}</span>
                    {selectedSite?.id === site.id && (
                      <Zap className="w-3 h-3 text-[#0ABAB5] ml-auto" />
                    )}
                  </button>
                ))}
                <div className="border-t border-[#E2E8F0] mt-2 pt-2 px-2">
                  <Link href="/seo-writer/setup" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-[#F1F5F9] transition-colors text-[#334155] text-sm">
                      + Add new site
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <Link href="/seo-writer/setup" onClick={() => setIsMobileOpen(false)}>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#D1F5F3] border border-[#0ABAB5]/30 text-[#0ABAB5] text-sm font-medium hover:bg-[#0ABAB5]/20 transition-colors">
              + Connect Website
            </button>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href.split("?")[0]
            : isActive(item.href, item.exact);

          return (
            <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-[#D1F5F3] text-[#1A1A2E] border border-[#0ABAB5]/30"
                    : "text-[#334155] hover:text-[#1A1A2E] hover:bg-[#F1F5F9]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${active ? "text-[#0ABAB5]" : ""}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Settings */}
        <Link
          href={`/seo-writer/settings${siteId ? `?siteId=${siteId}` : ""}`}
          onClick={() => setIsMobileOpen(false)}
        >
          <motion.div
            whileHover={{ x: 4 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname.includes("/settings")
                ? "bg-[#D1F5F3] text-[#1A1A2E] border border-[#0ABAB5]/30"
                : "text-[#334155] hover:text-[#1A1A2E] hover:bg-[#F1F5F9]"
            }`}
          >
            <Settings className={`w-5 h-5 ${pathname.includes("/settings") ? "text-[#0ABAB5]" : ""}`} />
            <span className="font-medium">Settings</span>
          </motion.div>
        </Link>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-2">
        <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#334155] hover:text-[#1A1A2E] hover:bg-[#F1F5F9] transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </motion.div>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
        >
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/seo-writer" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#1A1A2E]">SEO Writer</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-[#1A1A2E] rounded-lg hover:bg-[#F1F5F9]"
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
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#E2E8F0] flex flex-col z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#E2E8F0] flex-col z-50 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Site Speed Modal */}
      {selectedSite && (
        <SiteSpeedModal
          isOpen={isSpeedModalOpen}
          onClose={() => setIsSpeedModalOpen(false)}
          siteId={selectedSite.id}
          siteName={selectedSite.name}
          siteUrl={selectedSite.url}
        />
      )}
    </>
  );
}
