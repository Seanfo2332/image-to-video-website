"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Clock, Zap, ArrowUpDown } from "lucide-react";

interface SiteSpeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: string;
  siteName: string;
  siteUrl: string;
}

interface SpeedData {
  score: number;
  loadTime: number;
  contentTime: number;
  pageJump: boolean;
  checkedAt: string;
}

export function SiteSpeedModal({
  isOpen,
  onClose,
  siteId,
  siteName,
  siteUrl,
}: SiteSpeedModalProps) {
  const [speedData, setSpeedData] = useState<SpeedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && siteId) {
      fetchSpeedData();
    }
  }, [isOpen, siteId]);

  const fetchSpeedData = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `/api/seo-writer/pagespeed?siteId=${siteId}${forceRefresh ? "&refresh=true" : ""}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSpeedData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch speed data");
      }
    } catch (err) {
      setError("Failed to fetch speed data");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { ring: "stroke-[#0ABAB5]", text: "text-[#0ABAB5]", bg: "bg-[#0ABAB5]" };
    if (score >= 50) return { ring: "stroke-[#D4AF37]", text: "text-[#D4AF37]", bg: "bg-[#D4AF37]" };
    return { ring: "stroke-red-500", text: "text-red-500", bg: "bg-red-500" };
  };

  const getMetricStatus = (value: number, thresholds: { good: number; fair: number }) => {
    if (value <= thresholds.good) return { color: "text-[#0ABAB5]", label: "Good" };
    if (value <= thresholds.fair) return { color: "text-[#D4AF37]", label: "Needs work" };
    return { color: "text-red-500", label: "Poor" };
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const circumference = 2 * Math.PI * 54; // radius = 54
  const scoreColors = speedData ? getScoreColor(speedData.score) : getScoreColor(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-premium-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A2E]">Site Speed</h2>
                <p className="text-sm text-[#334155] truncate">{siteName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <X className="w-5 h-5 text-[#334155]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoading && !speedData ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-[#0ABAB5] animate-spin mb-4" />
                  <p className="text-[#334155]">Analyzing site speed...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => fetchSpeedData(true)}
                    className="px-4 py-2 rounded-lg bg-[#D1F5F3] text-[#0ABAB5] text-sm font-medium hover:bg-[#0ABAB5]/20 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : speedData ? (
                <>
                  {/* Circular Score */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        {/* Background circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-[#E2E8F0]"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className={scoreColors.ring}
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (speedData.score / 100) * circumference}
                          style={{ transition: "stroke-dashoffset 0.5s ease" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${scoreColors.text}`}>
                          {speedData.score}
                        </span>
                        <span className="text-xs text-[#334155]">/ 100</span>
                      </div>
                    </div>
                    <p className={`mt-2 text-sm font-medium ${scoreColors.text}`}>
                      {speedData.score >= 90
                        ? "Excellent"
                        : speedData.score >= 50
                        ? "Needs Improvement"
                        : "Poor"}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="space-y-3">
                    {/* Load Time */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F1F5F9]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-[#1E3A5F]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#1A1A2E] font-medium">Load Time</p>
                          <p className="text-xs text-[#334155]">Time to fully load</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${getMetricStatus(speedData.loadTime, { good: 2.5, fair: 4 }).color}`}>
                          {speedData.loadTime.toFixed(1)}s
                        </p>
                        <p className={`text-xs ${getMetricStatus(speedData.loadTime, { good: 2.5, fair: 4 }).color}`}>
                          {getMetricStatus(speedData.loadTime, { good: 2.5, fair: 4 }).label}
                        </p>
                      </div>
                    </div>

                    {/* Content Appearance */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F1F5F9]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#1A1A2E] font-medium">Content Appearance</p>
                          <p className="text-xs text-[#334155]">First contentful paint</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${getMetricStatus(speedData.contentTime, { good: 1.8, fair: 3 }).color}`}>
                          {speedData.contentTime.toFixed(1)}s
                        </p>
                        <p className={`text-xs ${getMetricStatus(speedData.contentTime, { good: 1.8, fair: 3 }).color}`}>
                          {getMetricStatus(speedData.contentTime, { good: 1.8, fair: 3 }).label}
                        </p>
                      </div>
                    </div>

                    {/* Page Jump */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F1F5F9]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#D1F5F3] flex items-center justify-center">
                          <ArrowUpDown className="w-5 h-5 text-[#0ABAB5]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#1A1A2E] font-medium">Layout Shift</p>
                          <p className="text-xs text-[#334155]">Content movement</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${speedData.pageJump ? "text-red-500" : "text-[#0ABAB5]"}`}>
                          {speedData.pageJump ? "Yes" : "No"}
                        </p>
                        <p className={`text-xs ${speedData.pageJump ? "text-red-500" : "text-[#0ABAB5]"}`}>
                          {speedData.pageJump ? "Detected" : "Stable"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Last Checked */}
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <p className="text-xs text-[#334155]">
                      Last checked: {formatTime(speedData.checkedAt)}
                    </p>
                    <button
                      onClick={() => fetchSpeedData(true)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#334155] text-sm hover:bg-[#E2E8F0] hover:text-[#1A1A2E] transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                      Check again
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#334155] mb-4">No speed data available</p>
                  <button
                    onClick={() => fetchSpeedData(true)}
                    className="px-4 py-2 rounded-lg bg-[#D1F5F3] text-[#0ABAB5] text-sm font-medium hover:bg-[#0ABAB5]/20 transition-colors"
                  >
                    Analyze Site Speed
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
