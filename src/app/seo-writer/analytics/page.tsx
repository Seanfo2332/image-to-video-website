"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Loader2,
  AlertCircle,
  Search,
  MousePointer,
  Eye,
  ArrowUpRight,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

interface GSCData {
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  topQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  topPages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [gscData, setGscData] = useState<GSCData | null>(null);
  const [dateRange, setDateRange] = useState("28d"); // 7d, 28d, 3m

  useEffect(() => {
    if (siteId) {
      checkConnection();
    }
  }, [siteId]);

  useEffect(() => {
    if (siteId && isConnected) {
      fetchAnalytics();
    }
  }, [siteId, isConnected, dateRange]);

  const checkConnection = async () => {
    try {
      const response = await fetch(`/api/seo-writer/analytics/status?siteId=${siteId}`);
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
      }
    } catch (error) {
      console.error("Failed to check connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/seo-writer/analytics/data?siteId=${siteId}&range=${dateRange}`
      );
      if (response.ok) {
        const data = await response.json();
        setGscData(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch(`/api/seo-writer/analytics/connect?siteId=${siteId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
        }
      }
    } catch (error) {
      console.error("Failed to initiate connection:", error);
      setIsConnecting(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercent = (num: number) => `${(num * 100).toFixed(1)}%`;

  if (!siteId) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-xl text-white mb-2">No site selected</h2>
        <p className="text-neutral-400 mb-6">Please select a site first.</p>
        <Link href="/seo-writer">
          <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400">
            Go to SEO Writer
          </button>
        </Link>
      </div>
    );
  }

  // Not connected state
  if (!isLoading && !isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Connect Google Search Console
          </h1>
          <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
            Track your SEO performance, see which keywords bring traffic, and monitor your rankings.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/25 flex items-center gap-3 mx-auto disabled:opacity-50"
          >
            {isConnecting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Connect Google Search Console
          </motion.button>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Track Rankings</h3>
              <p className="text-neutral-400 text-sm">
                See where your articles rank in search results.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Impressions & Clicks</h3>
              <p className="text-neutral-400 text-sm">
                Monitor how often your content appears and gets clicked.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Top Keywords</h3>
              <p className="text-neutral-400 text-sm">
                Discover which keywords drive traffic to your site.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Analytics
            <CheckCircle className="w-6 h-6 text-green-400" />
          </h1>
          <p className="text-neutral-400">Google Search Console data</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {[
              { value: "7d", label: "7 days" },
              { value: "28d", label: "28 days" },
              { value: "3m", label: "3 months" },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  dateRange === range.value
                    ? "bg-green-500/20 text-green-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-neutral-400 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {isLoading && !gscData ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
        </div>
      ) : gscData ? (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm">Total Clicks</span>
                <MousePointer className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {formatNumber(gscData.totalClicks)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm">Impressions</span>
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {formatNumber(gscData.totalImpressions)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm">Avg. CTR</span>
                <ArrowUpRight className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {formatPercent(gscData.averageCTR)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm">Avg. Position</span>
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {gscData.averagePosition.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Top Queries & Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Queries */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                Top Queries
              </h2>
              <div className="space-y-3">
                {gscData.topQueries.slice(0, 10).map((query, index) => (
                  <div
                    key={query.query}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-neutral-500 text-sm w-6">
                        {index + 1}
                      </span>
                      <span className="text-white truncate">{query.query}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-400">{query.clicks} clicks</span>
                      <span className="text-neutral-500">#{query.position.toFixed(0)}</span>
                    </div>
                  </div>
                ))}
                {gscData.topQueries.length === 0 && (
                  <p className="text-neutral-500 text-center py-4">No data available</p>
                )}
              </div>
            </div>

            {/* Top Pages */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                Top Pages
              </h2>
              <div className="space-y-3">
                {gscData.topPages.slice(0, 10).map((page, index) => {
                  const pageName = page.page.replace(/^https?:\/\/[^/]+/, "");
                  return (
                    <div
                      key={page.page}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-neutral-500 text-sm w-6">
                          {index + 1}
                        </span>
                        <span className="text-white truncate" title={page.page}>
                          {pageName || "/"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400">{page.clicks} clicks</span>
                        <span className="text-neutral-500">
                          {formatPercent(page.ctr)} CTR
                        </span>
                      </div>
                    </div>
                  );
                })}
                {gscData.topPages.length === 0 && (
                  <p className="text-neutral-500 text-center py-4">No data available</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl text-white mb-2">No analytics data</h2>
          <p className="text-neutral-400">
            It may take some time for data to appear after connecting.
          </p>
        </div>
      )}
    </div>
  );
}
