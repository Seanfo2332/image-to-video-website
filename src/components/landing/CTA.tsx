"use client";
import { motion } from "framer-motion";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { SparklesCore } from "@/components/ui/sparkles";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

// Avatar images for the CTA
const ctaAvatars = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face",
];

export function CTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-black to-black" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-3xl opacity-20" />

          {/* Card */}
          <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl border border-white/10 p-12 text-center overflow-hidden">
            {/* Sparkles background */}
            <div className="absolute inset-0">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={50}
                className="w-full h-full"
                particleColor="#00C3FF"
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Avatar stack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex justify-center mb-6"
              >
                <div className="flex -space-x-3">
                  {ctaAvatars.map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                      viewport={{ once: true }}
                      className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-neutral-800 hover:ring-cyan-400/50 transition-all hover:z-10 hover:scale-110"
                    >
                      <img src={src} alt={`User ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-medium"
                  >
                    +10k
                  </motion.div>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-white mb-6"
              >
                Ready to Create
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                  AI Avatar Videos?
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-neutral-400 mb-8 max-w-lg mx-auto"
              >
                Start your free trial today. No credit card required.
                Create unlimited avatar videos for 7 days.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/generate">
                  <ShimmerButton
                    className="shadow-2xl"
                    shimmerColor="#00C3FF"
                    background="linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)"
                  >
                    <span className="flex items-center gap-2 text-white font-medium">
                      <Play className="w-4 h-4" />
                      Create Your First Video
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </ShimmerButton>
                </Link>

                <Link href="/pricing">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                  >
                    View Pricing
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust text */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="text-sm text-neutral-500 mt-6"
              >
                Join 10,000+ creators already using AvatarAI
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
