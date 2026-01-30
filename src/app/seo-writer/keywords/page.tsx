"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  FileText,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number | null;
  difficulty: number | null;
  trafficBoost: number | null;
  status: string;
  _count?: {
    articles: number;
  };
}

export default function KeywordsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");

  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (siteId) {
      fetchKeywords();
    }
  }, [siteId]);

  const fetchKeywords = async () => {
    try {
      const response = await fetch(`/api/seo-writer/keywords?siteId=${siteId}`);
      if (response.ok) {
        const data = await response.json();
        setKeywords(data);
      }
    } catch (err) {
      console.error("Failed to fetch keywords:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const discoverMoreKeywords = async () => {
    setIsDiscovering(true);
    setError(null);

    try {
      const response = await fetch("/api/seo-writer/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });

      if (response.ok) {
        const data = await response.json();
        setKeywords([...keywords, ...data.keywords]);
        setSuccess(`Discovered ${data.keywords.length} new keywords!`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to discover keywords");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to discover keywords");
    } finally {
      setIsDiscovering(false);
    }
  };

  const generateArticle = async (keyword: Keyword) => {
    setIsGenerating(keyword.id);
    setError(null);

    try {
      const response = await fetch("/api/seo-writer/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          keywordId: keyword.id,
          generateFeaturedImage: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Article generated! Redirecting...`);

        // Update keyword status locally
        setKeywords(keywords.map(k =>
          k.id === keyword.id ? { ...k, status: "scheduled", _count: { articles: (k._count?.articles ?? 0) + 1 } } : k
        ));

        // Redirect to article editor
        setTimeout(() => {
          router.push(`/seo-writer/articles/${data.article.id}?siteId=${siteId}`);
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate article");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate article");
    } finally {
      setIsGenerating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
            Published
          </span>
        );
      case "scheduled":
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs">
            Has Article
          </span>
        );
      case "skipped":
        return (
          <span className="px-2 py-0.5 rounded-full bg-neutral-500/10 text-neutral-400 text-xs">
            Skipped
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs">
            Pending
          </span>
        );
    }
  };

  const getDifficultyColor = (difficulty: number | null) => {
    if (!difficulty) return "text-neutral-400";
    if (difficulty <= 30) return "text-green-400";
    if (difficulty <= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const filteredKeywords = keywords.filter((kw) =>
    kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/seo-writer?siteId=${siteId}`}>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Keywords</h1>
            <p className="text-neutral-400">
              Discover keywords and generate SEO articles.
            </p>
          </div>
        </div>
        <motion.button
          onClick={discoverMoreKeywords}
          disabled={isDiscovering}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {isDiscovering ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Discover More
        </motion.button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400/50 hover:text-red-400"
          >
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {success}
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-400/50 hover:text-green-400"
          >
            ×
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search keywords..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50"
        />
      </div>

      {/* Keywords Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
        </div>
      ) : filteredKeywords.length === 0 ? (
        <div className="text-center py-20">
          <TrendingUp className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-xl text-white mb-2">No keywords found</h2>
          <p className="text-neutral-400 mb-6">
            {searchQuery
              ? "Try a different search term."
              : "Discover keywords to start generating articles."}
          </p>
          <motion.button
            onClick={discoverMoreKeywords}
            disabled={isDiscovering}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400"
          >
            {isDiscovering ? "Discovering..." : "Discover Keywords"}
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKeywords.map((keyword) => (
            <motion.div
              key={keyword.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-white font-medium">{keyword.keyword}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    {getStatusBadge(keyword.status)}
                    {(keyword._count?.articles ?? 0) > 0 && (
                      <span className="text-xs text-neutral-500">
                        {keyword._count?.articles} article{(keyword._count?.articles ?? 0) > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                {keyword.trafficBoost && (
                  <div className="text-right">
                    <span className="text-green-400 font-medium">
                      +{keyword.trafficBoost}
                    </span>
                    <p className="text-xs text-neutral-500">traffic/mo</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                {keyword.searchVolume && (
                  <span>
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    {keyword.searchVolume.toLocaleString()} searches
                  </span>
                )}
                {keyword.difficulty && (
                  <span className={getDifficultyColor(keyword.difficulty)}>
                    Difficulty: {keyword.difficulty}/100
                  </span>
                )}
              </div>

              <motion.button
                onClick={() => generateArticle(keyword)}
                disabled={isGenerating === keyword.id || keyword.status === "published"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 font-medium flex items-center justify-center gap-2 hover:from-green-500/30 hover:to-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating === keyword.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (keyword._count?.articles ?? 0) > 0 ? (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Another
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Article
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
