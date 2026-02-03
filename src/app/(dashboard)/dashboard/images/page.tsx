"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ImageIcon,
  Download,
  Calendar,
  Clock,
  Search,
  Filter,
  MoreVertical,
  FolderOpen,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface GeneratedImage {
  id: string;
  title: string;
  prompt: string;
  thumbnail: string;
  createdAt: string;
  status: "completed" | "processing" | "failed";
  downloadUrl?: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/images");
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const filteredImages = images.filter(
    (image) =>
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: GeneratedImage["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "processing":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-600 border-red-200";
    }
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const filename = `${title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "")}.png`;
    const downloadUrl = `/api/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-violet-500" />
              My Images
            </h1>
            <p className="text-slate-500">
              View and download your AI-generated images
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {filteredImages.length} image{filteredImages.length !== 1 ? "s" : ""}
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by title or prompt..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5]/50 transition-all"
          />
        </div>
        <button className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0ABAB5] hover:border-[#0ABAB5]/30 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading your images...</p>
        </div>
      )}

      {/* Images Grid or Empty State */}
      {!isLoading && filteredImages.length === 0 ? (
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
            No images yet
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Your AI-generated images will appear here once they&apos;re ready.
            Start by creating an image with the AI Image Generator.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/dashboard/image-generator"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium shadow-lg shadow-[#0ABAB5]/25 flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Generate Image
            </motion.a>
          </div>
        </motion.div>
      ) : (
        !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#0ABAB5]/30 hover:shadow-lg transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square bg-slate-100">
                  {image.thumbnail && image.status === "completed" ? (
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  {/* View overlay */}
                  {image.status === "completed" && image.downloadUrl && (
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <motion.a
                        href={image.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <ExternalLink className="w-5 h-5 text-white" />
                      </motion.a>
                      <motion.button
                        onClick={() => handleDownload(image.downloadUrl!, image.title)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <Download className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  )}
                  {/* Status badge */}
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                      image.status
                    )}`}
                  >
                    {image.status.charAt(0).toUpperCase() + image.status.slice(1)}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-[#1E293B] font-medium mb-2 truncate group-hover:text-[#0ABAB5] transition-colors">
                    {image.title}
                  </h3>
                  {image.prompt && (
                    <p className="text-slate-500 text-sm mb-2 line-clamp-2">
                      {image.prompt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(image.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {image.status === "completed" && image.downloadUrl && (
                      <motion.button
                        onClick={() => handleDownload(image.downloadUrl!, image.title)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-2 rounded-lg bg-[#0ABAB5] hover:bg-[#089691] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </motion.button>
                    )}
                    {image.status === "processing" && (
                      <div className="flex-1 px-4 py-2 rounded-lg bg-amber-100 border border-amber-200 text-amber-600 text-sm font-medium flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    )}
                    {image.status === "failed" && (
                      <div className="flex-1 px-4 py-2 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm font-medium flex items-center justify-center gap-2">
                        Failed
                      </div>
                    )}
                    <button className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-[#1E293B] hover:bg-slate-200 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
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
        className="mt-8 p-6 rounded-2xl bg-violet-50 border border-violet-200"
      >
        <h3 className="text-[#1E293B] font-semibold mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-500" />
          Image Generation Info
        </h3>
        <p className="text-slate-600 text-sm">
          Images typically take 30-60 seconds to generate. Your generated images
          are stored and available for download at any time.
        </p>
      </motion.div>
    </div>
  );
}
