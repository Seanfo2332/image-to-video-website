"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Globe,
  FileText,
} from "lucide-react";

interface Submission {
  id: string;
  language: string;
  category: string;
  businessTitle: string;
  businessContent: string;
  status: string;
  publishedUrls: string[];
  error: string | null;
  createdAt: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  "F&B": "🍽️",
  "Crypto": "₿",
  "Beauty": "💄",
  "Property": "🏠",
  "Finance": "💰",
  "Other/News": "📰",
};

export default function GeoSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/geo-content/submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "processing":
      default:
        return <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "failed":
        return "bg-red-50 text-red-600 border-red-200";
      case "processing":
      default:
        return "bg-amber-50 text-amber-600 border-amber-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/geo-content"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0ABAB5] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to GEO Content
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-[#0ABAB5] flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">My Submissions</h1>
            <p className="text-slate-500">
              Track your GEO content and view published articles
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#0ABAB5] animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && submissions.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-[#1E293B] mb-2">
            No submissions yet
          </h3>
          <p className="text-slate-500 mb-6">
            Submit your first GEO content to get started
          </p>
          <Link
            href="/dashboard/geo-content"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ABAB5] text-white hover:bg-[#089691] transition-colors"
          >
            <Globe className="w-4 h-4" />
            Create Submission
          </Link>
        </div>
      )}

      {/* Submissions List */}
      {!isLoading && submissions.length > 0 && (
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#0ABAB5]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title & Category */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">
                      {CATEGORY_ICONS[submission.category] || "📄"}
                    </span>
                    <h3 className="text-lg font-semibold text-[#1E293B] truncate">
                      {submission.businessTitle}
                    </h3>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100">
                      {submission.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">
                      {submission.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(submission.createdAt)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {getStatusIcon(submission.status)}
                      {submission.status.charAt(0).toUpperCase() +
                        submission.status.slice(1)}
                    </span>

                    {submission.error && (
                      <span className="text-xs text-red-500">
                        {submission.error}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Published URLs */}
              {submission.publishedUrls && submission.publishedUrls.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Published on {submission.publishedUrls.length} website
                    {submission.publishedUrls.length > 1 ? "s" : ""}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submission.publishedUrls.map((url, i) => {
                      // Extract domain from URL
                      let domain = url;
                      try {
                        domain = new URL(url).hostname.replace("www.", "");
                      } catch {}

                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D1F5F3] text-[#089691] hover:bg-[#0ABAB5]/20 transition-colors text-sm"
                        >
                          <Globe className="w-3 h-3" />
                          {domain}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Processing Message */}
              {submission.status === "processing" && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-amber-600 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Your content is being processed and will be published
                    shortly...
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Auto-refresh for processing items */}
      {submissions.some((s) => s.status === "processing") && (
        <p className="text-center text-xs text-slate-500 mt-6">
          This page will auto-refresh to show updates
        </p>
      )}
    </div>
  );
}
