"use client";
import { motion } from "framer-motion";
import { Search, PenTool, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Enter Your Keyword",
    description:
      "Start with a target keyword. Our AI analyzes search intent, competition, and finds the best angle.",
    icon: Search,
    iconBg: "bg-[#D1F5F3]",
    iconColor: "text-[#0ABAB5]",
    preview: <KeywordPreview />,
  },
  {
    number: "02",
    title: "AI Writes Your Content",
    description:
      "Our AI generates SEO-optimized content with proper structure, headings, and internal links.",
    icon: PenTool,
    iconBg: "bg-[#D4AF37]/10",
    iconColor: "text-[#D4AF37]",
    preview: <WritingPreview />,
  },
  {
    number: "03",
    title: "GEO Optimization",
    description:
      "Content is optimized for AI citations. Get featured in ChatGPT, Perplexity, and other AI platforms.",
    icon: TrendingUp,
    iconBg: "bg-[#1E3A5F]/10",
    iconColor: "text-[#1E3A5F]",
    preview: <GEOPreview />,
  },
  {
    number: "04",
    title: "Publish & Rank",
    description:
      "Publish to your site and watch your rankings climb. Track performance with built-in analytics.",
    icon: CheckCircle,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    preview: <RankingPreview />,
  },
];

// Preview components
function KeywordPreview() {
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F1F5F9]">
        <Search className="w-4 h-4 text-[#0ABAB5]" />
        <motion.span
          className="text-sm text-[#1A1A2E]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          best SEO tools 2026
        </motion.span>
      </div>
      <div className="flex items-center justify-between text-xs text-[#334155] px-1">
        <span>Volume: 12,400</span>
        <span className="text-[#0ABAB5]">Low competition</span>
      </div>
    </div>
  );
}

function WritingPreview() {
  return (
    <div className="p-4 space-y-2">
      <motion.div
        className="h-2 bg-[#E2E8F0] rounded"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="h-2 bg-[#F1F5F9] rounded"
        initial={{ width: 0 }}
        whileInView={{ width: "80%" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="h-2 bg-[#F1F5F9] rounded"
        initial={{ width: 0 }}
        whileInView={{ width: "60%" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="mt-3 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent rounded"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}

function GEOPreview() {
  return (
    <div className="p-4 flex items-center justify-center gap-2">
      {["ChatGPT", "Claude", "Perplexity"].map((name, i) => (
        <motion.div
          key={name}
          className="px-2 py-1 text-xs rounded-full bg-[#D1F5F3] text-[#0ABAB5] font-medium"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          {name}
        </motion.div>
      ))}
    </div>
  );
}

function RankingPreview() {
  return (
    <div className="p-3 flex items-center justify-center">
      <div className="flex items-end gap-1">
        {[40, 55, 70, 85, 100].map((height, i) => (
          <motion.div
            key={i}
            className="w-4 rounded-t bg-gradient-to-t from-emerald-300 to-emerald-500"
            initial={{ height: 0 }}
            whileInView={{ height: `${height * 0.4}px` }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            viewport={{ once: true }}
          />
        ))}
      </div>
      <motion.div
        className="ml-3 text-xs text-emerald-600 font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
      >
        #1 Ranking
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden" style={{ background: "var(--ivory)" }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-xs font-medium text-[#334155] uppercase tracking-wider">
              Simple Process
            </span>
          </motion.div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A2E] mb-4">
            Rank Higher in
            <span className="gradient-text-tiffany"> 4 Easy Steps</span>
          </h2>
          <p className="text-lg text-[#334155] max-w-2xl mx-auto">
            No SEO expertise needed. Our AI handles keyword research, content creation, and optimization.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-[1px]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0ABAB5] via-[#D4AF37] to-emerald-400"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-premium-lg hover:border-[#0ABAB5]/20 transition-all duration-200 group h-full">
                  {/* Step number badge */}
                  <div
                    className={`w-14 h-14 rounded-xl ${step.iconBg} flex items-center justify-center mb-4 relative z-10 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                  </div>

                  {/* Step number */}
                  <div className="text-5xl font-bold text-[#F1F5F9] absolute top-4 right-4">
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#334155] text-sm mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Preview */}
                  <div className="rounded-xl bg-[#FAFBFC] border border-[#E2E8F0] overflow-hidden">
                    {step.preview}
                  </div>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-[#0ABAB5]/50 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link href="/seo-writer">
            <button className="px-8 py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium text-lg shadow-lg shadow-[#0ABAB5]/20 transition-all duration-200">
              Start Writing Content
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
