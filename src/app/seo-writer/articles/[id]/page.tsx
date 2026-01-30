"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Copy,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string | null;
  featuredImage: string | null;
  wordCount: number;
  status: string;
  wpPostId: string | null;
  publishedAt: string | null;
  createdAt: string;
  site: {
    name: string;
    url: string;
  };
  keyword?: {
    keyword: string;
    trafficBoost: number;
  };
}

export default function ArticleEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/seo-writer/articles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setMetaDescription(data.metaDescription || "");
      } else {
        setError("Article not found");
      }
    } catch (err) {
      setError("Failed to load article");
    } finally {
      setIsLoading(false);
    }
  };

  const saveArticle = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/seo-writer/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          metaDescription,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setArticle({ ...article!, ...updated });
        setSuccess("Article saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      setError("Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const publishArticle = async () => {
    if (!confirm("Are you sure you want to publish this article to WordPress?")) {
      return;
    }

    setIsPublishing(true);
    setError(null);
    setSuccess(null);

    try {
      // Save first
      await saveArticle();

      // Then publish
      const response = await fetch(`/api/seo-writer/articles/${id}/publish`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setArticle({ ...article!, status: "published", wpPostId: data.wpPost.id });
        setSuccess(`Published successfully! View at: ${data.wpPost.link}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish article");
    } finally {
      setIsPublishing(false);
    }
  };

  const htmlToMarkdown = (html: string): string => {
    let md = html;

    // Convert headings
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');

    // Convert bold and italic
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Convert links
    md = md.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Convert lists
    md = md.replace(/<ul[^>]*>/gi, '\n');
    md = md.replace(/<\/ul>/gi, '\n');
    md = md.replace(/<ol[^>]*>/gi, '\n');
    md = md.replace(/<\/ol>/gi, '\n');
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

    // Convert paragraphs
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

    // Convert line breaks
    md = md.replace(/<br\s*\/?>/gi, '\n');

    // Convert blockquotes
    md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');

    // Remove remaining HTML tags
    md = md.replace(/<[^>]+>/g, '');

    // Clean up extra whitespace
    md = md.replace(/\n{3,}/g, '\n\n');
    md = md.trim();

    return md;
  };

  const downloadMarkdown = () => {
    const markdown = htmlToMarkdown(content);
    const fullMarkdown = `# ${title}\n\n${markdown}`;
    const blob = new Blob([fullMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMarkdown = () => {
    const markdown = htmlToMarkdown(content);
    const fullMarkdown = `# ${title}\n\n${markdown}`;
    navigator.clipboard.writeText(fullMarkdown);
    setSuccess("Markdown copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl text-white mb-2">Article not found</h2>
        <Link href={`/seo-writer/articles?siteId=${siteId}`}>
          <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400">
            Back to Articles
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/seo-writer/articles?siteId=${siteId}`}>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  article.status === "published"
                    ? "bg-green-500/20 text-green-400"
                    : article.status === "draft"
                    ? "bg-neutral-500/20 text-neutral-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {article.status}
              </span>
              {article.wpPostId && (
                <span className="text-xs text-neutral-500">
                  WP Post #{article.wpPostId}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={copyMarkdown}
            className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            title="Copy as Markdown"
          >
            <Copy className="w-4 h-4" />
            Copy MD
          </button>
          <button
            onClick={downloadMarkdown}
            className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            title="Download as Markdown"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={saveArticle}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
          <motion.button
            onClick={publishArticle}
            disabled={isPublishing || article.status === "published"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {article.status === "published" ? "Published" : "Publish"}
          </motion.button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <label className="block text-sm text-neutral-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-lg font-medium focus:outline-none focus:border-green-500/50"
            />
          </div>

          {/* Content */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-neutral-400">Content Preview</label>
              <span className="text-xs text-neutral-500">
                {content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <div className="rounded-lg bg-white overflow-hidden border border-neutral-200">
              <article
                className="max-w-none p-6 md:p-8 lg:p-12"
                style={{
                  color: '#1e293b',
                  lineHeight: '1.75',
                }}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  .article-content p {
                    color: #334155;
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 1.5rem;
                  }
                  .article-content h2 {
                    color: #0f172a;
                    font-size: 28px;
                    font-weight: 700;
                    margin-top: 3rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.3;
                  }
                  .article-content h3 {
                    color: #1e293b;
                    font-size: 22px;
                    font-weight: 600;
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                    line-height: 1.4;
                  }
                  .article-content h4 {
                    color: #1e293b;
                    font-size: 18px;
                    font-weight: 600;
                    margin-top: 2rem;
                    margin-bottom: 0.75rem;
                    line-height: 1.4;
                  }
                  .article-content strong {
                    color: #0f172a;
                    font-weight: 700;
                  }
                  .article-content a {
                    color: #2563eb;
                    text-decoration: none;
                  }
                  .article-content a:hover {
                    text-decoration: underline;
                  }
                  .article-content ul, .article-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                  }
                  .article-content li {
                    color: #334155;
                    font-size: 17px;
                    margin-bottom: 0.5rem;
                    line-height: 1.8;
                  }
                  .article-content blockquote {
                    border-left: 4px solid #3b82f6;
                    padding-left: 1rem;
                    margin: 1.5rem 0;
                    color: #475569;
                    font-style: italic;
                  }
                  .article-content > *:first-child {
                    margin-top: 0;
                  }
                `}} />
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </article>
            </div>
            <details className="mt-4">
              <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-400">
                Edit HTML Source
              </summary>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full mt-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-green-500/50"
              />
            </details>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO Settings */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-white font-medium mb-4">SEO Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {metaDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-white font-medium mb-4">Featured Image</h3>
            {article.featuredImage ? (
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="w-full h-40 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-neutral-600" />
              </div>
            )}
          </div>

          {/* Article Info */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-white font-medium mb-4">Article Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Word Count</span>
                <span className="text-white">{article.wordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Created</span>
                <span className="text-white">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
              {article.publishedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Published</span>
                  <span className="text-white">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {article.keyword && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Target Keyword</span>
                  <span className="text-blue-400">{article.keyword.keyword}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
