"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Plus,
  FileText,
  TrendingUp,
  Calendar,
  ExternalLink,
  Settings,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface Site {
  id: string;
  name: string;
  url: string;
  isConnected: boolean;
  brandProfile: {
    brandName: string;
    language: string;
  } | null;
  _count: {
    articles: number;
  };
}

interface Article {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  keyword?: {
    keyword: string;
    trafficBoost: number;
  };
}

export default function SEOWriterPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (selectedSite) {
      fetchArticles(selectedSite.id);
    }
  }, [selectedSite]);

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/seo-writer/sites");
      if (response.ok) {
        const data = await response.json();
        setSites(data);
        if (data.length > 0) {
          setSelectedSite(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticles = async (siteId: string) => {
    try {
      const response = await fetch(`/api/seo-writer/articles?siteId=${siteId}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        // Handle both paginated and non-paginated responses
        const articlesList = data.articles || data;
        setRecentArticles(articlesList.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-[#0ABAB5]" />;
      case "draft":
        return <FileText className="w-4 h-4 text-[#334155]" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-[#D4AF37]" />;
      case "publishing":
        return <Loader2 className="w-4 h-4 text-[#0ABAB5] animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-[#334155]" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // No sites - show setup CTA
  if (!isLoading && sites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-[#D1F5F3] flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-[#0ABAB5]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A2E] mb-4">
            Welcome to SEO Writer
          </h1>
          <p className="text-[#334155] text-lg mb-8 max-w-md mx-auto">
            Connect your WordPress site and let AI generate SEO-optimized content automatically.
          </p>
          <Link href="/seo-writer/setup">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium shadow-lg shadow-[#0ABAB5]/20 flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="w-5 h-5" />
              Connect Your Website
            </motion.button>
          </Link>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-[#1A1A2E] font-medium mb-2">AI Analysis</h3>
              <p className="text-[#334155] text-sm">
                AI analyzes your website to understand your brand voice and style.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#1E3A5F]" />
              </div>
              <h3 className="text-[#1A1A2E] font-medium mb-2">Keyword Research</h3>
              <p className="text-[#334155] text-sm">
                Discover high-value keywords that drive organic traffic.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-premium transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#D1F5F3] flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#0ABAB5]" />
              </div>
              <h3 className="text-[#1A1A2E] font-medium mb-2">Auto-Publish</h3>
              <p className="text-[#334155] text-sm">
                Generate and publish SEO articles directly to WordPress.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A2E] mb-2">SEO Writer</h1>
          <p className="text-[#334155]">
            Generate and publish SEO-optimized content to your WordPress sites.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/seo-writer/setup">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#1A1A2E] font-medium hover:border-[#0ABAB5] hover:bg-[#D1F5F3]/30 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Site
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Site Selector */}
      {sites.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => setSelectedSite(site)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedSite?.id === site.id
                    ? "bg-[#D1F5F3] text-[#0ABAB5] border border-[#0ABAB5]/30"
                    : "bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
                }`}
              >
                {site.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#0ABAB5] animate-spin" />
        </div>
      ) : selectedSite ? (
        <>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-premium hover:border-[#0ABAB5]/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#334155] text-sm">Total Articles</span>
                <div className="w-10 h-10 rounded-xl bg-[#D1F5F3] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0ABAB5]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1A1A2E]">
                {selectedSite._count.articles}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-premium hover:border-[#0ABAB5]/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#334155] text-sm">Connection</span>
                <div className="w-10 h-10 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#1E3A5F]" />
                </div>
              </div>
              <p className="text-lg font-medium text-[#1A1A2E] flex items-center gap-2">
                {selectedSite.isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#0ABAB5]" />
                    Connected
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
                    Not Connected
                  </>
                )}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-premium hover:border-[#0ABAB5]/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#334155] text-sm">Brand Profile</span>
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <p className="text-lg font-medium text-[#1A1A2E]">
                {selectedSite.brandProfile ? (
                  <span className="text-[#0ABAB5]">Configured</span>
                ) : (
                  <span className="text-[#D4AF37]">Pending</span>
                )}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-premium hover:border-[#0ABAB5]/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#334155] text-sm">Language</span>
                <div className="w-10 h-10 rounded-xl bg-[#D1F5F3] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#0ABAB5]" />
                </div>
              </div>
              <p className="text-lg font-medium text-[#1A1A2E]">
                {selectedSite.brandProfile?.language || "English"}
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <Link href={`/seo-writer/keywords?siteId=${selectedSite.id}`}>
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1E3A5F]/30 hover:shadow-premium cursor-pointer group transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-[#1E3A5F]" />
                </div>
                <h3 className="text-[#1A1A2E] font-medium mb-1 flex items-center gap-2">
                  Keywords
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0ABAB5]" />
                </h3>
                <p className="text-[#334155] text-sm">
                  Discover and manage SEO keywords
                </p>
              </motion.div>
            </Link>
            <Link href={`/seo-writer/articles?siteId=${selectedSite.id}`}>
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0ABAB5]/30 hover:shadow-premium cursor-pointer group transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D1F5F3] flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-[#0ABAB5]" />
                </div>
                <h3 className="text-[#1A1A2E] font-medium mb-1 flex items-center gap-2">
                  Articles
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0ABAB5]" />
                </h3>
                <p className="text-[#334155] text-sm">
                  View and manage generated articles
                </p>
              </motion.div>
            </Link>
            <Link href={`/seo-writer/settings?siteId=${selectedSite.id}`}>
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#D4AF37]/30 hover:shadow-premium cursor-pointer group transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-3">
                  <Settings className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-[#1A1A2E] font-medium mb-1 flex items-center gap-2">
                  Settings
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0ABAB5]" />
                </h3>
                <p className="text-[#334155] text-sm">
                  Configure site and brand settings
                </p>
              </motion.div>
            </Link>
          </motion.div>

          {/* Recent Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1A1A2E] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0ABAB5]" />
                Recent Articles
              </h2>
              <Link
                href={`/seo-writer/articles?siteId=${selectedSite.id}`}
                className="text-sm text-[#334155] hover:text-[#0ABAB5] transition-colors flex items-center gap-1"
              >
                View all
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {recentArticles.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] text-center">
                <FileText className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
                <p className="text-[#334155] mb-4">No articles yet</p>
                <Link href={`/seo-writer/keywords?siteId=${selectedSite.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-[#D1F5F3] text-[#0ABAB5] text-sm font-medium hover:bg-[#0ABAB5]/20 transition-colors"
                  >
                    Generate your first article
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/seo-writer/articles/${article.id}`}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0ABAB5]/30 hover:shadow-premium transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1A1A2E] font-medium truncate">
                            {article.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-[#334155]">
                              {formatDate(article.createdAt)}
                            </span>
                            {article.keyword && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                                +{article.keyword.trafficBoost} traffic
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(article.status)}
                          <span
                            className={`text-sm capitalize ${
                              article.status === "published"
                                ? "text-[#0ABAB5]"
                                : article.status === "draft"
                                ? "text-[#334155]"
                                : article.status === "failed"
                                ? "text-red-500"
                                : "text-[#D4AF37]"
                            }`}
                          >
                            {article.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </>
      ) : null}
    </div>
  );
}
