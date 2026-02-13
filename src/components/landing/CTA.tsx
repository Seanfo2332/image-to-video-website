"use client";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden" style={{ background: "var(--ivory)" }}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-[#D1F5F3]/10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Card */}
          <div className="relative bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-10 md:p-14 text-center overflow-hidden shadow-premium-lg">
            {/* Subtle pattern background */}
            <div className="absolute inset-0 pattern-dots opacity-30" />

            {/* Gold accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />

            {/* Content */}
            <div className="relative z-10">
              {/* Stats badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8"
              >
                {[
                  { value: "+342%", label: "Avg Rankings" },
                  { value: "500+", label: "Keywords" },
                  { value: "10K+", label: "Users" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="px-3 sm:px-4 py-2 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]"
                  >
                    <div className="text-base sm:text-lg font-bold text-[#0ABAB5]">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-[#334155]">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-1 mb-6"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
                <span className="text-sm text-[#334155] ml-2">4.9/5 from 2,000+ reviews</span>
              </motion.div>

              {/* Title with serif font */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A2E] mb-6"
              >
                Ready to Dominate
                <br />
                <span className="gradient-text-tiffany">Search Rankings?</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-[#334155] mb-10 max-w-lg mx-auto"
              >
                Start your free trial today. No credit card required.
                Create unlimited SEO content for 7 days.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/seo-writer">
                  <button className="px-8 py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium text-lg shadow-lg shadow-[#0ABAB5]/20 flex items-center gap-2 transition-all duration-200">
                    <TrendingUp className="w-5 h-5" />
                    Start Ranking Higher
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>

                <Link href="/pricing">
                  <button className="px-8 py-4 rounded-xl border border-[#E2E8F0] bg-white text-[#1A1A2E] font-medium text-lg hover:border-[#0ABAB5] hover:bg-[#D1F5F3]/30 transition-all duration-200">
                    View Pricing
                  </button>
                </Link>
              </motion.div>

              {/* Trust text */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="text-sm text-[#334155] mt-8"
              >
                Join <span className="font-semibold text-[#1A1A2E]">10,000+</span> businesses growing with AlphaFin
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
