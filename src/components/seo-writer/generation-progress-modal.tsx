"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Brain, Link2, PenTool, Search, Save } from "lucide-react";

interface GenerationProgressModalProps {
  isOpen: boolean;
  currentStep: number;
  keyword: string;
}

const steps = [
  {
    id: 1,
    title: "Understanding your brand voice",
    description: "Analyzing your brand profile and content style",
    icon: Brain,
  },
  {
    id: 2,
    title: "Finding internal linking opportunities",
    description: "Scanning existing content for relevant links",
    icon: Link2,
  },
  {
    id: 3,
    title: "Writing SEO-optimized content",
    description: "Generating engaging, keyword-rich article",
    icon: PenTool,
  },
  {
    id: 4,
    title: "Optimizing for search engines",
    description: "Refining meta tags and structure",
    icon: Search,
  },
  {
    id: 5,
    title: "Saving your article",
    description: "Storing article and generating featured image",
    icon: Save,
  },
];

export function GenerationProgressModal({
  isOpen,
  currentStep,
  keyword,
}: GenerationProgressModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1a1a1f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Generating Article
              </h2>
              <p className="text-sm text-neutral-400">
                Creating content for: <span className="text-green-400">{keyword}</span>
              </p>
            </div>

            {/* Progress Steps */}
            <div className="p-6 space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;
                const isPending = currentStep < step.id;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-4 p-3 rounded-xl transition-all ${
                      isActive ? "bg-green-500/10" : ""
                    }`}
                  >
                    {/* Step Indicator */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                          ? "bg-green-500/20 border border-green-500/50"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                      ) : (
                        <Icon
                          className={`w-5 h-5 ${
                            isPending ? "text-neutral-500" : "text-green-400"
                          }`}
                        />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium transition-colors ${
                          isCompleted
                            ? "text-green-400"
                            : isActive
                            ? "text-white"
                            : "text-neutral-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p
                        className={`text-sm transition-colors ${
                          isActive ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 text-center">
              <p className="text-xs text-neutral-500">
                This may take a minute. Please don&apos;t close this window.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
