"use client";
import { motion } from "framer-motion";
import { ArrowRight, Search, Bot, TrendingUp, Sparkles, Check, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <div
      className="min-h-0 lg:min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--pearl)" }}
    >
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 pattern-dots opacity-50" />

      {/* Minimal accent gradients */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D1F5F3] rounded-full blur-[150px] translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E8D48A]/20 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Content */}
      <div className="px-4 max-w-7xl mx-auto relative z-10 w-full pt-24 pb-12 md:pt-28 lg:pb-0">
        {/* Split layout container */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-[#0ABAB5] animate-pulse" />
              <span className="text-xs font-medium text-[#334155] uppercase tracking-wider">
                AI-Powered SEO Platform
              </span>
            </motion.div>

            {/* Main heading with serif font - Frase.io style */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6"
              style={{ color: "var(--charcoal)" }}
            >
              Rank on Google.
              <br />
              <span className="gradient-text-tiffany">Get Cited by AI.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-[#334155] max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Create SEO-optimized content that ranks on Google and gets cited by AI platforms like ChatGPT, Perplexity, and Claude. The future of search is here.
            </motion.p>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10"
            >
              {[
                { icon: Search, text: "SEO Optimization" },
                { icon: Bot, text: "GEO Ready" },
                { icon: TrendingUp, text: "Traffic Growth" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-sm text-[#334155]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#D1F5F3] flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-[#0ABAB5]" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/seo-writer">
                <button className="px-8 py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium text-lg shadow-lg shadow-[#0ABAB5]/20 flex items-center gap-2 transition-all duration-200">
                  <span>Start Writing</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <Link href="#features">
                <button className="px-8 py-4 rounded-xl border border-[#E2E8F0] bg-white text-[#1A1A2E] font-medium text-lg shadow-sm hover:border-[#0ABAB5] hover:bg-[#D1F5F3]/30 transition-all duration-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  See How It Works
                </button>
              </Link>
            </motion.div>

            {/* Trust indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-10 pt-8 border-t border-[#E2E8F0]"
            >
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ABAB5] to-[#089691] border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-[#1A1A2E]">10,000+</span>
                  <span className="text-[#334155]"> businesses trust AlphaFin</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - SEO Dashboard Preview (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Card glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#0ABAB5]/10 to-[#D4AF37]/10 rounded-3xl blur-2xl" />

            {/* Main card - SEO Dashboard */}
            <div className="relative bg-white rounded-2xl border border-[#E2E8F0] shadow-premium-lg overflow-hidden">
              {/* Dashboard header */}
              <div className="p-3 md:p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#0ABAB5] to-[#089691] flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-semibold text-[#1A1A2E]">SEO Performance</div>
                    <div className="text-[10px] md:text-xs text-[#334155]">Real-time analytics</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0ABAB5] animate-pulse" />
                  <span className="text-[10px] md:text-xs text-[#334155]">Live</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 border-b border-[#E2E8F0]">
                <div className="p-3 md:p-4 border-r border-[#E2E8F0]">
                  <div className="text-[10px] md:text-xs text-[#334155] mb-1">Rankings</div>
                  <div className="text-base md:text-xl font-bold text-[#0ABAB5]">+342%</div>
                </div>
                <div className="p-3 md:p-4 border-r border-[#E2E8F0]">
                  <div className="text-[10px] md:text-xs text-[#334155] mb-1">Traffic</div>
                  <div className="text-base md:text-xl font-bold text-[#1A1A2E]">45.2K</div>
                </div>
                <div className="p-3 md:p-4">
                  <div className="text-[10px] md:text-xs text-[#334155] mb-1">CTR</div>
                  <div className="text-base md:text-xl font-bold text-[#D4AF37]">8.6%</div>
                </div>
              </div>

              {/* Mini chart area */}
              <div className="p-3 md:p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] md:text-xs font-medium text-[#1A1A2E]">Organic Traffic Growth</span>
                  <span className="text-[10px] md:text-xs text-[#0ABAB5]">Last 30 days</span>
                </div>
                <div className="h-16 md:h-24 flex items-end gap-0.5 md:gap-1">
                  {[35, 42, 38, 55, 48, 62, 58, 75, 68, 82, 78, 95, 88, 100].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-[#0ABAB5]/40 to-[#0ABAB5]"
                    />
                  ))}
                </div>
              </div>

              {/* Keyword rankings */}
              <div className="p-3 md:p-4 border-t border-[#E2E8F0] space-y-2 md:space-y-3">
                <div className="text-xs font-medium text-[#1A1A2E] mb-2">Top Performing Keywords</div>
                {[
                  { keyword: "AI content generation", position: 2, change: "+5" },
                  { keyword: "SEO optimization tool", position: 4, change: "+12" },
                  { keyword: "GEO content strategy", position: 1, change: "+8" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex items-center justify-between p-1.5 md:p-2 rounded-lg bg-[#F1F5F9]"
                  >
                    <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold flex-shrink-0 ${
                        item.position <= 3 ? "bg-[#D4AF37] text-white" : "bg-[#D1F5F3] text-[#0ABAB5]"
                      }`}>
                        {item.position}
                      </div>
                      <span className="text-xs md:text-sm text-[#1A1A2E] truncate">{item.keyword}</span>
                    </div>
                    <span className="text-[10px] md:text-xs text-[#0ABAB5] font-medium flex-shrink-0 ml-2">{item.change}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute -top-4 -left-4 hidden lg:flex bg-white p-4 rounded-xl shadow-premium border border-[#E2E8F0] items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#D1F5F3] flex items-center justify-center">
                <Check className="text-[#0ABAB5] w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider">GEO Ready</div>
                <div className="text-sm font-semibold text-[#1A1A2E]">AI Citations</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="absolute -bottom-2 -right-2 hidden lg:block bg-white px-4 py-2 rounded-lg shadow-premium border border-[#E2E8F0]"
            >
              <span className="text-xs font-medium text-[#334155]">AI-Optimized Content</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
