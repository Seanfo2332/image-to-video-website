"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import Link from "next/link";
import {
  Loader2,
  Lock,
  Download,
  Trash2,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  FileVideo,
  ExternalLink,
  Wand2,
} from "lucide-react";

interface Submission {
  id: string;
  status: string;
  materialUrl: string;
  imageOption: string;
  scriptStyle: string;
  language: string | null;
  voiceId: string;
  fileFormat: string | null;
  videoMaterial: string | null;
  downloadUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: Clock, label: "Pending" },
  processing: { color: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: Loader2, label: "Processing" },
  completed: { color: "text-green-400 bg-green-400/10 border-green-400/20", icon: CheckCircle, label: "Completed" },
  failed: { color: "text-red-400 bg-red-400/10 border-red-400/20", icon: AlertCircle, label: "Failed" },
  cancelled: { color: "text-neutral-400 bg-neutral-400/10 border-neutral-400/20", icon: XCircle, label: "Cancelled" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className={`w-3 h-3 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
}

function SubmissionCard({
  submission,
  onDelete,
  onRefresh,
}: {
  submission: Submission;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/prompts/${submission.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(submission.id);
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const createdDate = new Date(submission.createdAt);
  const timeAgo = getTimeAgo(createdDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={submission.status} />
            <span className="text-xs text-neutral-500">{timeAgo}</span>
          </div>
          <h3 className="text-white font-medium truncate mb-1">
            {submission.imageOption}
          </h3>
          <p className="text-sm text-neutral-400 truncate">
            {submission.scriptStyle} &bull; {submission.voiceId.split("_").pop()?.slice(0, 8)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {submission.status === "completed" && submission.downloadUrl && (
            <a
              href={submission.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            title={submission.status === "processing" ? "Cancel" : "Delete"}
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Material URL preview */}
      <div className="bg-black/30 rounded-xl p-3 mb-3">
        <p className="text-xs text-neutral-500 mb-1">Material URL</p>
        <p className="text-sm text-neutral-300 truncate">{submission.materialUrl}</p>
      </div>

      {/* Error message */}
      {submission.status === "failed" && submission.errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-xs text-red-400">{submission.errorMessage}</p>
        </div>
      )}

      {/* Download section for completed */}
      {submission.status === "completed" && submission.downloadUrl && (
        <a
          href={submission.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-3 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 transition-all"
        >
          <FileVideo className="w-5 h-5" />
          <span className="text-sm font-medium">Download Result</span>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </a>
      )}

      {/* Timestamp */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
        <span>Created: {createdDate.toLocaleString()}</span>
        {submission.completedAt && (
          <span>Completed: {new Date(submission.completedAt).toLocaleString()}</span>
        )}
      </div>
    </motion.div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function SubmissionsPage() {
  const { data: session, status: authStatus } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/prompts");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchSubmissions();
      // Poll for updates every 10 seconds
      const interval = setInterval(fetchSubmissions, 10000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleDelete = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredSubmissions = filter === "all"
    ? submissions
    : submissions.filter((s) => s.status === filter);

  // Stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    processing: submissions.filter((s) => s.status === "processing").length,
    completed: submissions.filter((s) => s.status === "completed").length,
    failed: submissions.filter((s) => s.status === "failed").length,
  };

  // Loading state
  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-gradient-mesh flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Login required
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-gradient-mesh">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass rounded-2xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
            <p className="text-neutral-400 mb-6">
              Please sign in to view your submissions.
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/25"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-gradient-mesh">
      <Navbar />

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              My Submissions
            </h1>
            <p className="text-neutral-400">
              Track your AI prompt generation requests
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchSubmissions}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-purple-500/25"
              >
                <Plus className="w-4 h-4" />
                New Prompt
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "from-purple-500 to-pink-500" },
            { label: "Pending", value: stats.pending, color: "from-yellow-500 to-orange-500" },
            { label: "Processing", value: stats.processing, color: "from-blue-500 to-cyan-500" },
            { label: "Completed", value: stats.completed, color: "from-green-500 to-emerald-500" },
            { label: "Failed", value: stats.failed, color: "from-red-500 to-rose-500" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
            >
              <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "pending", "processing", "completed", "failed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === status
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Wand2 className="w-10 h-10 text-neutral-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {filter === "all" ? "No submissions yet" : `No ${filter} submissions`}
            </h2>
            <p className="text-neutral-400 mb-6">
              {filter === "all"
                ? "Create your first AI prompt to get started"
                : "Try selecting a different filter"}
            </p>
            {filter === "all" && (
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/25"
                >
                  Create Prompt
                </motion.button>
              </Link>
            )}
          </motion.div>
        ) : (
          /* Submissions grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onDelete={handleDelete}
                  onRefresh={fetchSubmissions}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
