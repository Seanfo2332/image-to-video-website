"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, Sparkles, Trash2 } from "lucide-react";

interface Keyword {
  id: string;
  keyword: string;
  trafficBoost: number | null;
  status: string;
}

interface ScheduledKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: Keyword | null;
  date: Date | null;
  onGenerate: () => void;
  onRemove: () => void;
  isGenerating?: boolean;
}

export function ScheduledKeywordModal({
  isOpen,
  onClose,
  keyword,
  date,
  onGenerate,
  onRemove,
  isGenerating = false,
}: ScheduledKeywordModalProps) {
  if (!keyword || !date) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Scheduled Article
                      </h2>
                      <p className="text-sm text-gray-500">{formatDate(date)}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <div className="mb-2">
                  <label className="text-sm font-medium text-gray-500">
                    Keyword
                  </label>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {keyword.keyword}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      medium
                    </span>
                    {keyword.trafficBoost && (
                      <span className="text-sm text-gray-500">
                        ~{keyword.trafficBoost.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? "Generating..." : "Generate Now"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRemove}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </motion.button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
