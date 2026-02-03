"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileVideo,
  Download,
  Play,
  Calendar,
  Clock,
  Search,
  Filter,
  FolderOpen,
  X,
  ExternalLink,
} from "lucide-react";

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

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get array of video URLs (handles comma-separated URLs)
  const getVideoUrls = (video: Video): string[] => {
    if (!video.downloadUrl) return [];
    return video.downloadUrl.split(",").map((url) => url.trim()).filter(Boolean);
  };

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/videos");
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
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
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "processing":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-600 border-red-200";
    }
  };

  const handlePlayVideo = (video: Video, index: number = 0) => {
    setSelectedVideo(video);
    setCurrentVideoIndex(index);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
    setCurrentVideoIndex(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleDownload = async (video: Video, urlToDownload?: string) => {
    const url = urlToDownload || video.downloadUrl;
    if (!url) return;

    try {
      // Fetch the video and create a blob for direct download
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${video.title.replace(/[^a-zA-Z0-9]/g, "_")}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback: open in new tab if fetch fails (CORS issue)
      window.open(url, "_blank");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4"
            onClick={handleClosePlayer}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClosePlayer}
                className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Video title */}
              <h3 className="text-white text-xl font-semibold mb-4">
                {selectedVideo.title}
                {getVideoUrls(selectedVideo).length > 1 && (
                  <span className="text-slate-400 text-sm font-normal ml-2">
                    (Part {currentVideoIndex + 1} of {getVideoUrls(selectedVideo).length})
                  </span>
                )}
              </h3>

              {/* Video player */}
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={getVideoUrls(selectedVideo)[currentVideoIndex]}
                  className="w-full aspect-video"
                  controls
                  autoPlay
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    // Auto-play next video if available
                    const urls = getVideoUrls(selectedVideo);
                    if (currentVideoIndex < urls.length - 1) {
                      setCurrentVideoIndex(currentVideoIndex + 1);
                    }
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video segments selector (if multiple videos) */}
              {getVideoUrls(selectedVideo).length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                  {getVideoUrls(selectedVideo).map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentVideoIndex(idx)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        currentVideoIndex === idx
                          ? "bg-[#0ABAB5] text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      Part {idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-slate-400 text-sm">
                  {selectedVideo.duration} • {selectedVideo.size}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={getVideoUrls(selectedVideo)[currentVideoIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in New Tab
                  </a>
                  <button
                    onClick={() => handleDownload(selectedVideo, getVideoUrls(selectedVideo)[currentVideoIndex])}
                    className="px-4 py-2 rounded-lg bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
              <FileVideo className="w-8 h-8 text-[#0ABAB5]" />
              My Videos
            </h1>
            <p className="text-slate-500">
              View and download your generated videos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
          />
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0ABAB5] hover:border-[#0ABAB5]/30 transition-all flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          <span>Refresh</span>
        </button>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-[#0ABAB5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading videos...</p>
        </div>
      )}

      {/* Videos Grid or Empty State */}
      {!isLoading && filteredVideos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1E293B] mb-3">
            No videos yet
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Your generated videos will appear here once they&apos;re ready for download.
          </p>
          <motion.a
            href="/dashboard/lip-sync"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-6 py-3 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium shadow-lg shadow-[#0ABAB5]/25 transition-colors"
          >
            Create Lip Sync Video
          </motion.a>
        </motion.div>
      ) : (
        !isLoading && (
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
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#0ABAB5]/30 hover:shadow-lg transition-all"
              >
                {/* Thumbnail / Video Preview */}
                <div
                  className="relative aspect-video bg-slate-100 cursor-pointer"
                  onClick={() => video.status === "completed" && video.downloadUrl && handlePlayVideo(video, 0)}
                >
                  {video.downloadUrl ? (
                    <video
                      src={getVideoUrls(video)[0]}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileVideo className="w-12 h-12 text-slate-300" />
                    </div>
                  )}

                  {/* Play overlay */}
                  {video.status === "completed" && video.downloadUrl && (
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </motion.div>
                    </div>
                  )}

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-slate-900/70 text-white text-xs font-medium">
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
                  <h3 className="text-[#1E293B] font-medium mb-2 truncate group-hover:text-[#0ABAB5] transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(video.createdAt)}
                    </span>
                    <span>{video.size}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {video.status === "completed" && video.downloadUrl && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePlayVideo(video, 0)}
                          className="flex-1 px-4 py-2 rounded-lg bg-slate-100 text-[#1E293B] text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Play {getVideoUrls(video).length > 1 && `(${getVideoUrls(video).length})`}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDownload(video, getVideoUrls(video)[0])}
                          className="flex-1 px-4 py-2 rounded-lg bg-[#0ABAB5] hover:bg-[#089691] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </motion.button>
                      </>
                    )}
                    {video.status === "processing" && (
                      <div className="flex-1 px-4 py-2 rounded-lg bg-amber-100 border border-amber-200 text-amber-600 text-sm font-medium flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    )}
                    {video.status === "failed" && (
                      <div className="flex-1 px-4 py-2 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm font-medium flex items-center justify-center">
                        Failed
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 rounded-2xl bg-[#D1F5F3] border border-[#0ABAB5]/20"
      >
        <h3 className="text-[#1E293B] font-semibold mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#0ABAB5]" />
          Video Processing Info
        </h3>
        <p className="text-slate-600 text-sm">
          Videos typically take 5-15 minutes to generate depending on length and complexity.
          Click on a video to play it, or use the download button to save it to your device.
        </p>
      </motion.div>
    </div>
  );
}
