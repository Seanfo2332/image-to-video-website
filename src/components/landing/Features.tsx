"use client";
import { motion } from "framer-motion";
import {
  Search,
  Bot,
  TrendingUp,
  FileText,
  Link2,
  BarChart3,
  Sparkles,
  Globe,
  Target,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Content Generation",
    description:
      "Create SEO-optimized articles that rank on Google and get cited by AI platforms like ChatGPT and Perplexity.",
    icon: Sparkles,
    size: "large",
    demo: <ContentDemo />,
  },
  {
    title: "GEO Optimization",
    description:
      "Optimize your content for Generative Engine Optimization. Get cited by AI search engines.",
    icon: Bot,
    size: "small",
    demo: <GEODemo />,
  },
  {
    title: "Keyword Research",
    description:
      "Discover high-value keywords with search volume, difficulty, and traffic potential data.",
    icon: Search,
    size: "small",
    demo: <KeywordDemo />,
  },
  {
    title: "Internal Linking",
    description:
      "Automatically find and suggest internal linking opportunities to boost your site's SEO structure.",
    icon: Link2,
    size: "medium",
    demo: <LinkingDemo />,
  },
  {
    title: "Rank Tracking",
    description:
      "Monitor your keyword rankings and track progress over time with detailed analytics.",
    icon: TrendingUp,
    size: "small",
  },
  {
    title: "Content Briefs",
    description:
      "Generate comprehensive content briefs with outlines, FAQs, and competitor analysis.",
    icon: FileText,
    size: "small",
  },
  {
    title: "Performance Analytics",
    description:
      "Track clicks, impressions, CTR, and rankings with Google Search Console integration.",
    icon: BarChart3,
    size: "small",
  },
];

// Content generation demo component
function ContentDemo() {
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-400/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
        <div className="w-3 h-3 rounded-full bg-green-400/60" />
        <span className="text-xs text-[#334155] ml-2">SEO Writer</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#0ABAB5]" />
          <span className="text-xs text-[#334155]">Target Keyword:</span>
          <span className="text-xs text-[#1A1A2E] font-medium px-2 py-0.5 bg-[#D1F5F3] rounded">best SEO tools 2026</span>
        </div>
        <div className="mt-3 space-y-2">
          <motion.div
            className="h-3 bg-[#E2E8F0] rounded"
            initial={{ width: 0 }}
            whileInView={{ width: "95%" }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          />
          <motion.div
            className="h-3 bg-[#F1F5F9] rounded"
            initial={{ width: 0 }}
            whileInView={{ width: "80%" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          />
          <motion.div
            className="h-3 bg-[#F1F5F9] rounded"
            initial={{ width: 0 }}
            whileInView={{ width: "70%" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </div>
      </div>
      <div className="relative h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden mt-4">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0ABAB5] to-[#089691] rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#0ABAB5]">Generating article...</span>
        <span className="text-[#334155]">2,500 words</span>
      </div>
    </div>
  );
}

// GEO demo component
function GEODemo() {
  const aiPlatforms = [
    { name: "ChatGPT", status: "Cited" },
    { name: "Perplexity", status: "Cited" },
    { name: "Claude", status: "Cited" },
  ];
  return (
    <div className="p-4 space-y-2">
      {aiPlatforms.map((platform, i) => (
        <motion.div
          key={platform.name}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F1F5F9]"
        >
          <span className="text-xs text-[#1A1A2E] font-medium">{platform.name}</span>
          <span className="text-xs text-[#0ABAB5] font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0ABAB5]" />
            {platform.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Keyword demo component
function KeywordDemo() {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-full">
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#334155]">Search Volume</span>
          <span className="text-[#1A1A2E] font-bold">12,400</span>
        </div>
        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#0ABAB5] rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "78%" }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          />
        </div>
        <div className="flex items-center justify-between text-xs mt-3">
          <span className="text-[#334155]">Difficulty</span>
          <span className="text-[#D4AF37] font-bold">Medium</span>
        </div>
        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#D4AF37] rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "45%" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </div>
  );
}

// Internal linking demo component
function LinkingDemo() {
  return (
    <div className="p-5 space-y-3">
      <div className="text-xs font-medium text-[#1A1A2E] mb-2">Internal Link Opportunities</div>
      {[
        { anchor: "SEO best practices", target: "/blog/seo-guide" },
        { anchor: "keyword research", target: "/blog/keyword-research" },
        { anchor: "content optimization", target: "/blog/content-tips" },
      ].map((link, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 p-2 rounded-lg bg-[#F1F5F9]"
        >
          <Link2 className="w-3 h-3 text-[#0ABAB5]" />
          <span className="text-xs text-[#0ABAB5] font-medium">{link.anchor}</span>
          <span className="text-xs text-[#334155]">→</span>
          <span className="text-xs text-[#334155] truncate">{link.target}</span>
        </motion.div>
      ))}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const isLarge = feature.size === "large";
  const isMedium = feature.size === "medium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={`
        group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden
        transition-all duration-300 hover:shadow-premium-lg hover:border-[#0ABAB5]/20
        ${isLarge ? "md:col-span-2 md:row-span-2" : ""}
        ${isMedium ? "md:col-span-2" : ""}
      `}
    >
      {/* Subtle gold accent line for featured cards */}
      {isLarge && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
      )}

      {/* Content */}
      <div className={`p-6 ${isLarge ? "md:p-8" : ""}`}>
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-xl bg-[#D1F5F3] border border-[#0ABAB5]/10
          flex items-center justify-center mb-4
          group-hover:bg-[#0ABAB5] transition-colors duration-300
        `}>
          <feature.icon className="w-6 h-6 text-[#0ABAB5] group-hover:text-white transition-colors duration-300" />
        </div>

        {/* Title */}
        <h3 className={`
          font-semibold text-[#1A1A2E] mb-2
          ${isLarge ? "text-xl md:text-2xl" : "text-lg"}
        `}>
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-[#334155] text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Demo area */}
      {feature.demo && (
        <div className={`
          border-t border-[#E2E8F0] bg-[#FAFBFC]
          ${isLarge ? "min-h-[180px]" : "min-h-[100px]"}
        `}>
          {feature.demo}
        </div>
      )}
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden" style={{ background: "var(--pearl)" }}>
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
            <div className="w-2 h-2 rounded-full bg-[#0ABAB5]" />
            <span className="text-xs font-medium text-[#334155] uppercase tracking-wider">
              Powerful Features
            </span>
          </motion.div>

          {/* Title with serif font */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A2E] mb-4">
            Everything You Need for
            <br />
            <span className="gradient-text-tiffany">SEO & GEO Success</span>
          </h2>

          <p className="text-lg text-[#334155] max-w-2xl mx-auto">
            From keyword research to AI-optimized content. Rank higher and get cited by AI.
          </p>
        </motion.div>

        {/* Magazine-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
