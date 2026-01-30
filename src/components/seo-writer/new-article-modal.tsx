"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, FileText, BookOpen, BookMarked, Library } from "lucide-react";

interface NewArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    keyword: string;
    customTitle?: string;
    articleLength: string;
    scheduledFor?: string;
  }) => void;
  isGenerating?: boolean;
}

const articleLengths = [
  {
    value: "short",
    label: "Short",
    words: "~1,000 words",
    description: "Quick read, focused topic",
    icon: FileText,
  },
  {
    value: "medium",
    label: "Medium",
    words: "~2,000 words",
    description: "Standard blog post",
    icon: BookOpen,
  },
  {
    value: "long",
    label: "Long",
    words: "~3,000 words",
    description: "In-depth coverage",
    icon: BookMarked,
  },
  {
    value: "guide",
    label: "Guide",
    words: "~4,000 words",
    description: "Comprehensive guide",
    icon: Library,
  },
];

export function NewArticleModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false,
}: NewArticleModalProps) {
  const [keyword, setKeyword] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [articleLength, setArticleLength] = useState("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    onGenerate({
      keyword: keyword.trim(),
      customTitle: customTitle.trim() || undefined,
      articleLength,
    });
  };

  const handleClose = () => {
    if (!isGenerating) {
      setKeyword("");
      setCustomTitle("");
      setArticleLength("medium");
      onClose();
    }
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#1a1a1f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">New Article</h2>
                  <p className="text-sm text-neutral-400">Generate with AI</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isGenerating}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Target Keyword */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Target Keyword <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., best coffee makers 2024"
                  disabled={isGenerating}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 disabled:opacity-50"
                />
                <p className="mt-1.5 text-xs text-neutral-500">
                  The main keyword your article will target for SEO
                </p>
              </div>

              {/* Custom Title (Optional) */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Custom Title <span className="text-neutral-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Leave blank for AI-generated title"
                  disabled={isGenerating}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 disabled:opacity-50"
                />
                <p className="mt-1.5 text-xs text-neutral-500">
                  AI will generate an SEO-optimized title if left blank
                </p>
              </div>

              {/* Article Length */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Article Length
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {articleLengths.map((length) => {
                    const Icon = length.icon;
                    const isSelected = articleLength === length.value;

                    return (
                      <button
                        key={length.value}
                        type="button"
                        onClick={() => setArticleLength(length.value)}
                        disabled={isGenerating}
                        className={`p-4 rounded-xl border text-left transition-all disabled:opacity-50 ${
                          isSelected
                            ? "bg-green-500/20 border-green-500/50"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            className={`w-5 h-5 ${
                              isSelected ? "text-green-400" : "text-neutral-400"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              isSelected ? "text-green-400" : "text-white"
                            }`}
                          >
                            {length.label}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">{length.words}</p>
                        <p className="text-xs text-neutral-500 mt-1">{length.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!keyword.trim() || isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Article
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
