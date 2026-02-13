"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, Calendar } from "lucide-react";

export function SEOResults() {
  // Mock data points for the chart
  const clicksData = [20, 25, 30, 28, 35, 45, 55, 70, 85, 95, 110, 130, 155, 180, 210, 245, 280, 320, 360, 400, 450, 500, 560, 620];
  const impressionsData = [200, 220, 250, 280, 320, 380, 450, 520, 600, 700, 820, 950, 1100, 1280, 1480, 1700, 1950, 2250, 2600, 3000, 3450, 3950, 4500, 5100];

  const maxClicks = Math.max(...clicksData);
  const maxImpressions = Math.max(...impressionsData);

  return (
    <section className="py-20 bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-[#0ABAB5]" />
            <span className="text-xs font-medium text-[#334155] uppercase tracking-wider">
              Real Results
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A2E] mb-4">
            SEO Performance That Speaks
          </h2>
          <p className="text-lg text-[#334155] max-w-2xl mx-auto">
            Our clients see dramatic improvements in search visibility and organic traffic within months of using AlphaFin.
          </p>
        </motion.div>

        {/* Analytics Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-premium-lg overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="p-4 md:p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A2E]">Search Performance</h3>
              <p className="text-sm text-[#334155]">Google Search Console Data</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#334155]">
              <Calendar className="w-4 h-4" />
              <span>Last 6 months</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#E2E8F0]">
            {/* Total Clicks */}
            <div className="p-4 md:p-6 border-r border-b md:border-b-0 border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#4285F4]" />
                <span className="text-xs md:text-sm text-[#334155]">Total clicks</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">25K</div>
              <div className="flex items-center gap-1 mt-1 text-sm text-[#0ABAB5]">
                <ArrowUpRight className="w-4 h-4" />
                <span>+342%</span>
              </div>
            </div>

            {/* Total Impressions */}
            <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#A855F7]" />
                <span className="text-xs md:text-sm text-[#334155]">Total impressions</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">1.45M</div>
              <div className="flex items-center gap-1 mt-1 text-sm text-[#0ABAB5]">
                <ArrowUpRight className="w-4 h-4" />
                <span>+528%</span>
              </div>
            </div>

            {/* Average CTR */}
            <div className="p-4 md:p-6 border-r border-b md:border-b-0 border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#0ABAB5]" />
                <span className="text-xs md:text-sm text-[#334155]">Average CTR</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">8.6%</div>
              <div className="flex items-center gap-1 mt-1 text-sm text-[#0ABAB5]">
                <ArrowUpRight className="w-4 h-4" />
                <span>+2.4%</span>
              </div>
            </div>

            {/* Average Position */}
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                <span className="text-xs md:text-sm text-[#334155]">Average position</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">4.2</div>
              <div className="flex items-center gap-1 mt-1 text-sm text-[#0ABAB5]">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12 spots</span>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="p-4 md:p-6">
            <div className="relative h-48 sm:h-64 md:h-80">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-8 md:w-12 flex flex-col justify-between text-[10px] md:text-xs text-[#334155]">
                <span>5K</span>
                <span>2.5K</span>
                <span>0</span>
              </div>

              {/* Chart container */}
              <div className="ml-9 md:ml-14 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="border-b border-dashed border-[#E2E8F0]" />
                  <div className="border-b border-dashed border-[#E2E8F0]" />
                  <div className="border-b border-[#E2E8F0]" />
                </div>

                {/* "Started using Alphafin" annotation */}
                <div className="absolute left-[20%] top-0 bottom-8 border-l-2 border-dashed border-[#0ABAB5] z-10">
                  <div className="absolute -top-1 left-2 bg-[#D1F5F3] text-[#0ABAB5] text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded whitespace-nowrap">
                    <span className="hidden sm:inline">Started using AlphaFin</span>
                    <span className="sm:hidden">AlphaFin</span>
                  </div>
                </div>

                {/* SVG Chart */}
                <svg className="w-full h-[calc(100%-2rem)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Impressions area (purple) */}
                  <defs>
                    <linearGradient id="impressionsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="clicksGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4285F4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#4285F4" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Impressions fill */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    d={`M 0 100 ${impressionsData.map((val, i) => `L ${(i / (impressionsData.length - 1)) * 100} ${100 - (val / maxImpressions) * 80}`).join(' ')} L 100 100 Z`}
                    fill="url(#impressionsGradient)"
                  />

                  {/* Impressions line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    d={impressionsData.map((val, i) => `${i === 0 ? 'M' : 'L'} ${(i / (impressionsData.length - 1)) * 100} ${100 - (val / maxImpressions) * 80}`).join(' ')}
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="0.5"
                  />

                  {/* Clicks fill */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    d={`M 0 100 ${clicksData.map((val, i) => `L ${(i / (clicksData.length - 1)) * 100} ${100 - (val / maxClicks) * 60}`).join(' ')} L 100 100 Z`}
                    fill="url(#clicksGradient)"
                  />

                  {/* Clicks line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    d={clicksData.map((val, i) => `${i === 0 ? 'M' : 'L'} ${(i / (clicksData.length - 1)) * 100} ${100 - (val / maxClicks) * 60}`).join(' ')}
                    fill="none"
                    stroke="#4285F4"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between text-[10px] md:text-xs text-[#334155] mt-2">
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute -bottom-1 md:bottom-0 right-0 flex items-center gap-3 md:gap-6 text-xs md:text-sm">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#4285F4]" />
                  <span className="text-[#334155]">Clicks</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#A855F7]" />
                  <span className="text-[#334155]">Impressions</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { value: "500+", label: "Keywords Ranked", icon: TrendingUp },
            { value: "156%", label: "Average Traffic Increase", icon: ArrowUpRight },
            { value: "Top 10", label: "Google Rankings", icon: TrendingUp },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 text-center hover:border-[#0ABAB5]/30 hover:shadow-premium transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#D1F5F3] flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-[#0ABAB5]" />
              </div>
              <div className="text-3xl font-bold text-[#1A1A2E] mb-1">{stat.value}</div>
              <div className="text-sm text-[#334155]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
