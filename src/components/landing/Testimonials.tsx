"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const testimonials = [
  {
    headline: "Perfect for global audience",
    content:
      "AvatarAI's multi-language support is perfect for reaching a global audience. The translations and voice overs sound very natural.",
    author: "Xiao L.",
    platform: "Product Hunt",
    color: "bg-gradient-to-br from-cyan-900/40 to-cyan-800/20",
  },
  {
    headline: "Remarkable video creations",
    content:
      "Coming from image generation, I found the video creation experience with AvatarAI to be outstanding. It unlocks so much creativity with ease.",
    author: "Bella M.",
    platform: "Capterra",
    color: "bg-gradient-to-br from-purple-900/40 to-purple-800/20",
  },
  {
    headline: "Great for entrepreneurs",
    content:
      "As a solo entrepreneur, AvatarAI helps me create professional content without any production team. It's very straightforward and effective.",
    author: "Alexis N.",
    platform: "Product Hunt",
    color: "bg-gradient-to-br from-blue-900/40 to-blue-800/20",
  },
  {
    headline: "Great support and quality",
    content:
      "I had an issue and their support responded within minutes. The avatar quality is amazing, and overall it's a valuable tool.",
    author: "Danielle U.",
    platform: "Capterra",
    color: "bg-gradient-to-br from-violet-900/40 to-violet-800/20",
  },
  {
    headline: "Revolutionary technology",
    content:
      "This is revolutionary for our content creation. It saves time, money, and the results are highly professional. Truly impressive.",
    author: "Manuel R.",
    platform: "Capterra",
    color: "bg-gradient-to-br from-indigo-900/40 to-indigo-800/20",
  },
  {
    headline: "Lifelike and simple",
    content:
      "I love the lifelike avatars and the simple interface. As a designer, I appreciate tools that don't overcomplicate things.",
    author: "Thomas V.",
    platform: "G2",
    color: "bg-gradient-to-br from-cyan-900/40 to-purple-900/20",
  },
  {
    headline: "Best AI video tool",
    content:
      "After trying many AI video tools, AvatarAI stands out. The lip-sync is incredible and the avatars look genuinely real.",
    author: "Sophie K.",
    platform: "Product Hunt",
    color: "bg-gradient-to-br from-purple-900/40 to-pink-900/20",
  },
  {
    headline: "Transformed our marketing",
    content:
      "Our marketing team now produces 10x more video content. The ROI has been incredible since we started using AvatarAI.",
    author: "Marcus J.",
    platform: "Trustpilot",
    color: "bg-gradient-to-br from-blue-900/40 to-cyan-900/20",
  },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12 px-4 relative z-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          Loved by Creators Worldwide
        </h2>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
          Join thousands of satisfied users creating amazing AI avatar videos
        </p>
      </motion.div>

      {/* Full-width horizontal scrolling testimonials */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`flex gap-5 overflow-x-auto pb-8 pl-4 md:pl-8 lg:pl-16 scrollbar-hide relative z-10 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {testimonials.map((testimonial, index) => {
          // Alternate between normal trapezoid and inverted trapezoid
          const isInverted = index % 2 === 1;

          // Normal: narrow top, wide bottom
          const normalTrapezoid = `polygon(
            8% 4%, 10% 1%, 14% 0%,
            86% 0%,
            90% 1%, 92% 4%,
            100% 96%,
            100% 98%, 98% 100%,
            2% 100%,
            0% 98%, 0% 96%
          )`;

          // Inverted: wide top, narrow bottom
          const invertedTrapezoid = `polygon(
            0% 4%, 0% 2%, 2% 0%,
            98% 0%,
            100% 2%, 100% 4%,
            92% 96%,
            90% 99%, 86% 100%,
            14% 100%,
            10% 99%, 8% 96%
          )`;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex-shrink-0 select-none"
            >
              {/* Trapezoid card - alternating direction */}
              <div
                className={`w-[260px] md:w-[300px] min-h-[360px] p-7 md:p-8 ${testimonial.color} border border-white/10 flex flex-col backdrop-blur-sm`}
                style={{
                  clipPath: isInverted ? invertedTrapezoid : normalTrapezoid,
                }}
              >
                {/* Rating */}
                <p className="text-sm text-cyan-400 mb-3 font-medium">5 out of 5 Stars</p>

                {/* Headline */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                  &ldquo;{testimonial.headline}&rdquo;
                </h3>

                {/* Content */}
                <p className="text-neutral-300 text-sm leading-relaxed flex-grow">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <p className="text-neutral-400 text-sm mt-4">
                  — <span className="font-semibold text-white">{testimonial.author}</span> on{" "}
                  <span className="text-cyan-400">{testimonial.platform}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
        {/* Right padding element */}
        <div className="flex-shrink-0 w-4 md:w-8 lg:w-16" />
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-4 relative z-10"
      >
        <p className="text-sm text-neutral-500 flex items-center justify-center gap-2">
          <span>←</span>
          Drag to scroll
          <span>→</span>
        </p>
      </motion.div>
    </section>
  );
}
