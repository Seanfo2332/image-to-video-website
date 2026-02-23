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
  ArrowUp,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Content Generation",
    description:
      "Create SEO-optimized articles that rank on Google and get cited by AI platforms like ChatGPT and Perplexity.",
    icon: Sparkles,
    size: "featured",
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
    size: "small",
    demo: <LinkingDemo />,
  },
  {
    title: "Rank Tracking",
    description:
      "Monitor your keyword rankings and track progress over time with detailed analytics.",
    icon: TrendingUp,
    size: "small",
    demo: <RankTrackingDemo />,
  },
  {
    title: "Content Briefs",
    description:
      "Generate comprehensive content briefs with outlines, FAQs, and competitor analysis.",
    icon: FileText,
    size: "small",
    demo: <ContentBriefDemo />,
  },
  {
    title: "Performance Analytics",
    description:
      "Track clicks, impressions, CTR, and rankings with Google Search Console integration.",
    icon: BarChart3,
    size: "small",
    demo: <PerformanceAnalyticsDemo />,
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

// Rank tracking demo component
function RankTrackingDemo() {
  const keywords = [
    { keyword: "best seo tools", position: 2, change: 3 },
    { keyword: "ai content writer", position: 5, change: 8 },
    { keyword: "geo optimization", position: 1, change: 12 },
  ];
  return (
    <div className="p-4 space-y-2">
      {keywords.map((kw, i) => (
        <motion.div
          key={kw.keyword}
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}
          viewport={{ once: true }}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F1F5F9]"
        >
          <span className="text-xs text-[#1A1A2E] font-medium truncate">{kw.keyword}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1A2E] bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0]">
              #{kw.position}
            </span>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-0.5">
              <ArrowUp className="w-3 h-3" />
              +{kw.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Content brief demo component
function ContentBriefDemo() {
  const outlineItems = ["Introduction", "Top 10 Tools", "Pricing Guide"];
  return (
    <div className="p-4 space-y-2.5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0ABAB5]/10 border border-[#0ABAB5]/20"
      >
        <FileText className="w-3.5 h-3.5 text-[#0ABAB5]" />
        <span className="text-xs font-semibold text-[#1A1A2E]">Content Brief: Best SEO Tools</span>
      </motion.div>
      {outlineItems.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F1F5F9]"
        >
          <ChevronRight className="w-3 h-3 text-[#0ABAB5]" />
          <span className="text-xs text-[#334155]">H2:</span>
          <span className="text-xs text-[#1A1A2E] font-medium">{item}</span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 pt-1"
      >
        <span className="text-xs font-medium text-[#0ABAB5] px-2 py-0.5 bg-[#D1F5F3] rounded">5 FAQs</span>
        <span className="text-xs font-medium text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/10 rounded">8 Competitors</span>
      </motion.div>
    </div>
  );
}

// Performance analytics demo component
function PerformanceAnalyticsDemo() {
  const bars = [35, 45, 40, 60, 55, 75, 90];
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="flex-1 px-3 py-2 rounded-lg bg-[#F1F5F9]"
        >
          <div className="text-[10px] text-[#334155]">Clicks</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-[#1A1A2E]">25K</span>
            <span className="text-[10px] font-medium text-emerald-500">+342%</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex-1 px-3 py-2 rounded-lg bg-[#F1F5F9]"
        >
          <div className="text-[10px] text-[#334155]">CTR</div>
          <span className="text-sm font-bold text-[#1A1A2E]">8.6%</span>
        </motion.div>
      </div>
      <div className="flex items-end justify-between gap-1.5 h-16">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-[#0ABAB5] to-[#089691]"
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            viewport={{ once: true }}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const isFeatured = feature.size === "featured";

  if (isFeatured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden
          transition-all duration-300 hover:shadow-premium-lg hover:border-[#0ABAB5]/20
          md:col-span-3"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
        <div className="md:flex">
          {/* Text side */}
          <div className="p-6 md:p-8 md:flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#D1F5F3] border border-[#0ABAB5]/10
              flex items-center justify-center mb-4
              group-hover:bg-[#0ABAB5] transition-colors duration-300">
              <feature.icon className="w-6 h-6 text-[#0ABAB5] group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-[#1A1A2E] text-xl md:text-2xl mb-2">
              {feature.title}
            </h3>
            <p className="text-[#334155] text-sm leading-relaxed max-w-md">
              {feature.description}
            </p>
          </div>
          {/* Demo side */}
          {feature.demo && (
            <div className="border-t md:border-t-0 md:border-l border-[#E2E8F0] bg-[#FAFBFC] md:w-[380px]">
              {feature.demo}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden
        transition-all duration-300 hover:shadow-premium-lg hover:border-[#0ABAB5]/20
        flex flex-col"
    >
      {/* Content */}
      <div className="p-5">
        <div className="w-10 h-10 rounded-xl bg-[#D1F5F3] border border-[#0ABAB5]/10
          flex items-center justify-center mb-3
          group-hover:bg-[#0ABAB5] transition-colors duration-300">
          <feature.icon className="w-5 h-5 text-[#0ABAB5] group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="font-semibold text-[#1A1A2E] text-base mb-1.5">
          {feature.title}
        </h3>
        <p className="text-[#334155] text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Demo area */}
      {feature.demo && (
        <div className="border-t border-[#E2E8F0] bg-[#FAFBFC] mt-auto">
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

        {/* Feature grid: 1 featured + 3+3 uniform */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
