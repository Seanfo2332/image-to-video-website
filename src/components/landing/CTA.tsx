"use client";
import { motion } from "framer-motion";
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
    <section className="py-24 px-4 relative overflow-hidden bg-[#F8FAFC]">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-[#F8FAFC] to-[#D1F5F3]/20" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#0ABAB5]/20 to-[#BDD3E1]/20 rounded-3xl blur-3xl" />

          {/* Card */}
          <div className="relative bg-white rounded-3xl border border-slate-200 p-12 text-center overflow-hidden shadow-xl">
            {/* Subtle pattern background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #0ABAB5 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }} />
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
                      className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white hover:ring-[#0ABAB5] transition-all hover:z-10 hover:scale-110 shadow-md"
                    >
                      <img src={src} alt={`User ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-[#D1F5F3] border-2 border-[#0ABAB5]/20 flex items-center justify-center text-xs text-[#089691] font-medium shadow-md"
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
                className="text-3xl md:text-5xl font-bold text-[#1E293B] mb-6"
              >
                Ready to Create
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ABAB5] to-slate-400">
                  AI Avatar Videos?
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-slate-500 mb-8 max-w-lg mx-auto"
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
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(10, 186, 181, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium shadow-lg shadow-[#0ABAB5]/25 flex items-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Create Your First Video
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>

                <Link href="/pricing">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] font-medium hover:bg-slate-50 transition-colors shadow-sm"
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
                className="text-sm text-slate-400 mt-6"
              >
                Join 10,000+ creators already using AlphaFin
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
