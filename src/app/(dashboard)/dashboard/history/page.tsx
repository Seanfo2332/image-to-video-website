"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  StopCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Calendar,
  Wand2,
  FileVideo,
  ExternalLink,
} from "lucide-react";

// Workflow status types
type WorkflowStatus = "queued" | "processing" | "completed" | "failed" | "cancelled";

interface PromptSubmission {
  id: string;
  materialUrl: string;
  imageStyle: string;
  scriptStyle: string;
  language: string;
  voiceId: string;
  createdAt: string;
  status: WorkflowStatus;
  progress?: number; // 0-100 for processing status
  currentStep?: string; // e.g., "Generating script", "Creating video"
  videoId?: string; // Links to video when completed
  error?: string;
}

// Empty state - will be populated by API
const placeholderSubmissions: PromptSubmission[] = [];

// Example data to show what it will look like
const exampleSubmissions: PromptSubmission[] = [
  {
    id: "sub-001",
    materialUrl: "https://example.com/article/company-overview",
    imageStyle: "YouTube 标准口播",
    scriptStyle: "企业深度解析",
    language: "中文 (Chinese)",
    voiceId: "Voice 1 - Natural Male",
    createdAt: "2024-01-20T14:30:00Z",
    status: "processing",
    progress: 65,
    currentStep: "Generating video frames...",
  },
  {
    id: "sub-002",
    materialUrl: "https://example.com/product-demo",
    imageStyle: "YouTube 标准口播西装",
    scriptStyle: "自定义脚本",
    language: "英语 (English)",
    voiceId: "Voice 2 - Professional",
    createdAt: "2024-01-20T12:15:00Z",
    status: "completed",
    progress: 100,
    videoId: "vid-001",
  },
  {
    id: "sub-003",
    materialUrl: "https://example.com/quarterly-report",
    imageStyle: "YouTube 标准口播",
    scriptStyle: "企业深度解析",
    language: "中文 (Chinese)",
    voiceId: "Voice 3 - Energetic",
    createdAt: "2024-01-19T16:45:00Z",
    status: "failed",
    error: "Script generation failed: Content too long",
  },
  {
    id: "sub-004",
    materialUrl: "https://example.com/news-update",
    imageStyle: "足球直播",
    scriptStyle: "足球",
    language: "中文 (Chinese)",
    voiceId: "Voice 4 - Calm",
    createdAt: "2024-01-19T10:00:00Z",
    status: "cancelled",
  },
  {
    id: "sub-005",
    materialUrl: "https://example.com/marketing-content",
    imageStyle: "YouTube 标准口播",
    scriptStyle: "企业深度解析-素材",
    language: "英语 (English)",
    voiceId: "Voice 5 - Dynamic",
    createdAt: "2024-01-20T15:00:00Z",
    status: "queued",
  },
];

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<PromptSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch submissions from API
  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/submissions");
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Auto-poll for progress updates when there are processing/queued submissions
  useEffect(() => {
    const hasActiveJobs = submissions.some(
      (s) => s.status === "processing" || s.status === "queued"
    );
    if (!hasActiveJobs) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/submissions");
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error("Failed to poll submissions:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [submissions]);

  const displaySubmissions = showExamples ? exampleSubmissions : submissions;

  const filteredSubmissions = displaySubmissions.filter((sub) => {
    const matchesSearch = sub.materialUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.scriptStyle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case "queued":
        return <Clock className="w-5 h-5" />;
      case "processing":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "failed":
        return <XCircle className="w-5 h-5" />;
      case "cancelled":
        return <StopCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case "queued":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "processing":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "completed":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "failed":
        return "bg-red-100 text-red-600 border-red-200";
      case "cancelled":
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Update the local state
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, status: "cancelled" as WorkflowStatus, currentStep: "Cancelled by user" }
              : s
          )
        );
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      // Optimistically update UI
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: "processing" as WorkflowStatus, progress: 0, currentStep: "Retrying...", error: undefined }
            : s
        )
      );

      const response = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry" }),
      });

      if (!response.ok) {
        const data = await response.json();
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, status: "failed" as WorkflowStatus, error: data.error || "Retry failed" }
              : s
          )
        );
        alert(data.error || "Failed to retry");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const statusCounts = {
    all: displaySubmissions.length,
    queued: displaySubmissions.filter((s) => s.status === "queued").length,
    processing: displaySubmissions.filter((s) => s.status === "processing").length,
    completed: displaySubmissions.filter((s) => s.status === "completed").length,
    failed: displaySubmissions.filter((s) => s.status === "failed").length,
    cancelled: displaySubmissions.filter((s) => s.status === "cancelled").length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
          <History className="w-8 h-8 text-violet-500" />
          Prompt History
        </h1>
        <p className="text-slate-500">
          Track your prompt submissions and workflow status
        </p>
      </motion.div>

      {/* Status Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        {(["all", "processing", "queued", "completed", "failed", "cancelled"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === status
                ? "bg-[#D1F5F3] text-[#089691] border border-[#0ABAB5]/30"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 text-xs">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by URL or style..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
          />
        </div>
      </motion.div>

      {/* Submissions List or Empty State */}
      {filteredSubmissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <History className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1E293B] mb-3">
            No submissions yet
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Your prompt submissions and their workflow status will appear here.
            Start by creating your first prompt.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/dashboard/create"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium shadow-lg shadow-[#0ABAB5]/25 flex items-center gap-2 transition-colors"
            >
              <Wand2 className="w-5 h-5" />
              Create Prompt
            </motion.a>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#1E293B] hover:bg-slate-50 transition-all"
            >
              {showExamples ? "Hide Examples" : "Show Example History"}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#0ABAB5]/30 hover:shadow-md transition-all"
            >
              {/* Main Row */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {getStatusIcon(submission.status)}
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(submission.createdAt)}
                      </span>
                    </div>
                    <p className="text-[#1E293B] font-medium truncate mb-1">
                      {submission.scriptStyle}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {submission.materialUrl}
                    </p>

                    {/* Progress bar for processing */}
                    {submission.status === "processing" && submission.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-500">
                            {submission.currentStep || "Processing..."}
                          </span>
                          <span className="text-sm text-amber-600">{submission.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${submission.progress}%` }}
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Error message */}
                    {submission.status === "failed" && submission.error && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {submission.error}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Action buttons based on status */}
                    {(submission.status === "processing" || submission.status === "queued") && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(submission.id);
                        }}
                        disabled={cancellingId === submission.id}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {cancellingId === submission.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <StopCircle className="w-4 h-4" />
                        )}
                        Cancel
                      </motion.button>
                    )}

                    {submission.status === "failed" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(submission.id);
                        }}
                        className="px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all text-sm font-medium flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Retry
                      </motion.button>
                    )}

                    {submission.status === "completed" && submission.videoId && (
                      <motion.a
                        href={`/dashboard/videos`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all text-sm font-medium flex items-center gap-1.5"
                      >
                        <FileVideo className="w-4 h-4" />
                        View Video
                      </motion.a>
                    )}

                    <button className="p-2 text-slate-400 hover:text-[#1E293B] transition-colors">
                      {expandedId === submission.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedId === submission.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Image Style</p>
                          <p className="text-sm text-[#1E293B]">{submission.imageStyle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Script Style</p>
                          <p className="text-sm text-[#1E293B]">{submission.scriptStyle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Language</p>
                          <p className="text-sm text-[#1E293B]">{submission.language}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Voice</p>
                          <p className="text-sm text-[#1E293B]">{submission.voiceId}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-1">Material URL</p>
                        <a
                          href={submission.materialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0ABAB5] hover:text-[#089691] flex items-center gap-1"
                        >
                          {submission.materialUrl}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 rounded-2xl bg-violet-50 border border-violet-200"
      >
        <h3 className="text-[#1E293B] font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-violet-500" />
          Workflow Status Info
        </h3>
        <ul className="text-slate-600 text-sm space-y-1">
          <li><span className="text-blue-600">Queued:</span> Waiting to be processed</li>
          <li><span className="text-amber-600">Processing:</span> Currently generating your video</li>
          <li><span className="text-emerald-600">Completed:</span> Video is ready for download</li>
          <li><span className="text-red-600">Failed:</span> An error occurred - you can retry</li>
          <li><span className="text-slate-500">Cancelled:</span> Workflow was stopped</li>
        </ul>
      </motion.div>
    </div>
  );
}
