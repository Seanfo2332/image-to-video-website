"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  Edit3,
  MoreVertical,
  Image as ImageIcon,
} from "lucide-react";
import { NewArticleModal } from "@/components/seo-writer/new-article-modal";
import { GenerationProgressModal } from "@/components/seo-writer/generation-progress-modal";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string | null;
  featuredImage: string | null;
  wordCount: number;
  articleLength: string;
  status: string;
  wpPostId: string | null;
  scheduledFor: string | null;
  publishedAt: string | null;
  createdAt: string;
  keyword?: {
    keyword: string;
    trafficBoost: number;
  };
}

interface Stats {
  total: number;
  drafts: number;
  published: number;
  scheduled: number;
}

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteId = searchParams.get("siteId");

  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, drafts: 0, published: 0, scheduled: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatingKeyword, setGeneratingKeyword] = useState("");

  useEffect(() => {
    if (siteId) {
      fetchArticles();
    }
  }, [siteId, statusFilter]);

  const fetchArticles = async () => {
    try {
      let url = `/api/seo-writer/articles?siteId=${siteId}`;
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setArticles(data);

        // Calculate stats
        const allArticlesResponse = await fetch(`/api/seo-writer/articles?siteId=${siteId}`);
        if (allArticlesResponse.ok) {
          const allArticles = await allArticlesResponse.json();
          setStats({
            total: allArticles.length,
            drafts: allArticles.filter((a: Article) => a.status === "draft").length,
            published: allArticles.filter((a: Article) => a.status === "published").length,
            scheduled: allArticles.filter((a: Article) => a.status === "scheduled").length,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const response = await fetch(`/api/seo-writer/articles/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setArticles(articles.filter((a) => a.id !== id));
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          drafts: articles.find((a) => a.id === id)?.status === "draft" ? prev.drafts - 1 : prev.drafts,
          published: articles.find((a) => a.id === id)?.status === "published" ? prev.published - 1 : prev.published,
          scheduled: articles.find((a) => a.id === id)?.status === "scheduled" ? prev.scheduled - 1 : prev.scheduled,
        }));
      }
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const handleGenerateArticle = async (data: {
    keyword: string;
    customTitle?: string;
    articleLength: string;
  }) => {
    if (!siteId) return;

    setIsGenerating(true);
    setGeneratingKeyword(data.keyword);
    setGenerationStep(1);
    setIsNewArticleModalOpen(false);

    try {
      // Simulate progress steps
      const progressInterval = setInterval(() => {
        setGenerationStep((prev) => {
          if (prev < 5) return prev + 1;
          return prev;
        });
      }, 3000);

      const response = await fetch("/api/seo-writer/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          keyword: data.keyword,
          customTitle: data.customTitle,
          articleLength: data.articleLength,
        }),
      });

      clearInterval(progressInterval);
      setGenerationStep(5);

      if (response.ok) {
        const article = await response.json();
        // Short delay to show completion
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationStep(0);
          // Redirect to the new article
          router.push(`/seo-writer/articles/${article.id}?siteId=${siteId}`);
        }, 1000);
      } else {
        throw new Error("Failed to generate article");
      }
    } catch (error) {
      console.error("Failed to generate article:", error);
      setIsGenerating(false);
      setGenerationStep(0);
      alert("Failed to generate article. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "draft":
        return <Edit3 className="w-4 h-4 text-neutral-400" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "publishing":
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "draft":
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
      case "scheduled":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "publishing":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div>
          <h1 className="text-3xl font-bold text-white">Articles</h1>
          <p className="text-neutral-400">
            Manage your generated SEO articles.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsNewArticleModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-green-500/25"
        >
          <Plus className="w-4 h-4" />
          New Article
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Total</span>
            <FileText className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Drafts</span>
            <Edit3 className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.drafts}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Published</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.published}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Scheduled</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "draft", "scheduled", "published", "failed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm capitalize whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-xl text-white mb-2">No articles found</h2>
          <p className="text-neutral-400 mb-6">
            {searchQuery
              ? "Try a different search term."
              : "Create your first article to get started."}
          </p>
          <button
            onClick={() => setIsNewArticleModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 font-medium"
          >
            Create Article
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-24 h-24 md:w-32 md:h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-neutral-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Link
                      href={`/seo-writer/articles/${article.id}?siteId=${siteId}`}
                      className="hover:text-green-400 transition-colors"
                    >
                      <h3 className="text-white font-medium text-lg line-clamp-1">
                        {article.title}
                      </h3>
                    </Link>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 flex-shrink-0 ${getStatusColor(
                        article.status
                      )}`}
                    >
                      {getStatusIcon(article.status)}
                      {article.status}
                    </span>
                  </div>

                  <p className="text-neutral-500 text-sm line-clamp-2 mb-3">
                    {article.metaDescription || "No description available"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-neutral-500">
                      {article.wordCount.toLocaleString()} words
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-500">{formatDate(article.createdAt)}</span>
                    {article.keyword && (
                      <>
                        <span className="text-neutral-600">•</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs">
                          {article.keyword.keyword}
                        </span>
                      </>
                    )}
                    {article.scheduledFor && (
                      <>
                        <span className="text-neutral-600">•</span>
                        <span className="text-blue-400 text-xs">
                          Scheduled: {formatDate(article.scheduledFor)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/seo-writer/articles/${article.id}?siteId=${siteId}`}>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4 text-neutral-400" />
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <NewArticleModal
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        onGenerate={handleGenerateArticle}
        isGenerating={isGenerating}
      />

      <GenerationProgressModal
        isOpen={isGenerating}
        currentStep={generationStep}
        keyword={generatingKeyword}
      />
    </div>
  );
}
