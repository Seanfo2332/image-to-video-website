"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { SparklesCore } from "@/components/ui/sparkles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Wand2,
  Video,
  Clock,
  Palette,
  Loader2,
  CheckCircle,
  Download,
} from "lucide-react";
import { generateVideo } from "@/lib/n8n";

const styles = [
  { id: "cinematic", name: "Cinematic", color: "from-violet-500 to-purple-500" },
  { id: "anime", name: "Anime", color: "from-pink-500 to-rose-500" },
  { id: "realistic", name: "Realistic", color: "from-blue-500 to-cyan-500" },
  { id: "cartoon", name: "Cartoon", color: "from-yellow-500 to-orange-500" },
  { id: "minimal", name: "Minimal", color: "from-gray-500 to-gray-600" },
];

const durations = [
  { value: 15, label: "15 sec" },
  { value: 30, label: "30 sec" },
  { value: 60, label: "1 min" },
  { value: 120, label: "2 min" },
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setIsComplete(false);

    try {
      const response = await generateVideo({
        prompt,
        style: style as "cinematic" | "anime" | "realistic" | "cartoon" | "minimal",
        duration,
      });

      setJobId(response.jobId);

      // Simulate progress for demo
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            setIsGenerating(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
    } catch (error) {
      console.error("Generation error:", error);
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={20}
            className="w-full h-full"
            particleColor="#8b5cf6"
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white mb-4">
              Create Your Video
            </h1>
            <p className="text-neutral-400">
              Describe your vision and let AI bring it to life
            </p>
          </motion.div>

          {/* Generation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-neutral-900/50 border border-white/10 rounded-2xl p-8"
          >
            {/* Prompt Input */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-white font-medium mb-3">
                <Wand2 className="w-5 h-5 text-violet-500" />
                Describe Your Video
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A serene mountain landscape at sunset with birds flying across the golden sky..."
                className="w-full h-32 px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-violet-500/50 resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Style Selection */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-white font-medium mb-3">
                <Palette className="w-5 h-5 text-violet-500" />
                Visual Style
              </label>
              <div className="flex flex-wrap gap-3">
                {styles.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStyle(s.id)}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      style === s.id
                        ? `bg-gradient-to-r ${s.color} border-transparent text-white`
                        : "border-white/10 text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    {s.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-white font-medium mb-3">
                <Clock className="w-5 h-5 text-violet-500" />
                Duration
              </label>
              <div className="flex flex-wrap gap-3">
                {durations.map((d) => (
                  <motion.button
                    key={d.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDuration(d.value)}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      duration === d.value
                        ? "bg-violet-500 border-transparent text-white"
                        : "border-white/10 text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    {d.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between text-sm text-neutral-400 mb-2">
                    <span>Generating your video...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Complete State */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-green-400 font-medium">
                      Video Generated Successfully!
                    </span>
                  </div>
                  <div className="aspect-video bg-neutral-800 rounded-xl flex items-center justify-center mb-4">
                    <Video className="w-16 h-16 text-neutral-600" />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium"
                    >
                      <Download className="w-5 h-5" />
                      Download MP4
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsComplete(false);
                        setProgress(0);
                        setPrompt("");
                      }}
                      className="px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5"
                    >
                      Create Another
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Button */}
            {!isComplete && (
              <ShimmerButton
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                shimmerColor="#a855f7"
                background={
                  isGenerating || !prompt.trim()
                    ? "rgba(100, 100, 100, 0.5)"
                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)"
                }
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Video
                    </>
                  )}
                </span>
              </ShimmerButton>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-neutral-500">
              Tip: Be specific in your descriptions for better results.
              Include details about mood, lighting, and camera movements.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
