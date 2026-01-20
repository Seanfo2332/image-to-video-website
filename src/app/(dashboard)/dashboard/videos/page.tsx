"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileVideo,
  Download,
  Play,
  Calendar,
  Clock,
  Search,
  Filter,
  MoreVertical,
  FolderOpen,
} from "lucide-react";

// Placeholder video data - will be replaced with API data
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  size: string;
  createdAt: string;
  status: "completed" | "processing" | "failed";
  downloadUrl?: string;
}

// Empty state - no videos yet
const placeholderVideos: Video[] = [];

// Example of what videos will look like when available:
const exampleVideos: Video[] = [
  {
    id: "1",
    title: "Company Overview - Q4 2024",
    thumbnail: "/api/placeholder/320/180",
    duration: "3:45",
    size: "45.2 MB",
    createdAt: "2024-01-20T10:30:00Z",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "2",
    title: "Product Demo - New Features",
    thumbnail: "/api/placeholder/320/180",
    duration: "5:12",
    size: "62.8 MB",
    createdAt: "2024-01-19T15:45:00Z",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "3",
    title: "Marketing Campaign Video",
    thumbnail: "/api/placeholder/320/180",
    duration: "2:30",
    size: "28.4 MB",
    createdAt: "2024-01-18T09:15:00Z",
    status: "processing",
  },
];

export default function VideosPage() {
  const [videos] = useState<Video[]>(placeholderVideos);
  const [searchQuery, setSearchQuery] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const displayVideos = showExamples ? exampleVideos : videos;
  const filteredVideos = displayVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: Video["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FileVideo className="w-8 h-8 text-cyan-400" />
              My Videos
            </h1>
            <p className="text-neutral-400">
              View and download your generated videos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
        </div>
        <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </motion.div>

      {/* Videos Grid or Empty State */}
      {filteredVideos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-12 h-12 text-neutral-600" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            No videos yet
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-6">
            Your generated videos will appear here once they&apos;re ready for download.
            Start by creating a prompt to generate your first video.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/dashboard/create"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/25 flex items-center gap-2"
            >
              Create Prompt
            </motion.a>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {showExamples ? "Hide Examples" : "Show Example Videos"}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-neutral-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileVideo className="w-12 h-12 text-neutral-700" />
                </div>
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Play className="w-6 h-6 text-white ml-1" />
                  </motion.button>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                  {video.duration}
                </div>
                {/* Status badge */}
                <div
                  className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                    video.status
                  )}`}
                >
                  {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-medium mb-2 truncate group-hover:text-cyan-400 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(video.createdAt)}
                  </span>
                  <span>{video.size}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {video.status === "completed" && video.downloadUrl && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </motion.button>
                  )}
                  {video.status === "processing" && (
                    <div className="flex-1 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  )}
                  <button className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20"
      >
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Video Processing Info
        </h3>
        <p className="text-neutral-400 text-sm">
          Videos typically take 5-15 minutes to generate depending on length and complexity.
          You&apos;ll be notified when your video is ready for download. Videos are stored for 30 days.
        </p>
      </motion.div>
    </div>
  );
}
