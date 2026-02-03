"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    headline: "Perfect for global audience",
    content:
      "AvatarAI's multi-language support is perfect for reaching a global audience. The translations and voice overs sound very natural.",
    author: "Xiao L.",
    platform: "Product Hunt",
    color: "bg-[#D1F5F3]/30",
  },
  {
    headline: "Remarkable video creations",
    content:
      "Coming from image generation, I found the video creation experience with AvatarAI to be outstanding. It unlocks so much creativity with ease.",
    author: "Bella M.",
    platform: "Capterra",
    color: "bg-[#D4AF37]/5",
  },
  {
    headline: "Great for entrepreneurs",
    content:
      "As a solo entrepreneur, AvatarAI helps me create professional content without any production team. It's very straightforward and effective.",
    author: "Alexis N.",
    platform: "Product Hunt",
    color: "bg-[#1E3A5F]/5",
  },
  {
    headline: "Great support and quality",
    content:
      "I had an issue and their support responded within minutes. The avatar quality is amazing, and overall it's a valuable tool.",
    author: "Danielle U.",
    platform: "Capterra",
    color: "bg-[#D1F5F3]/30",
  },
  {
    headline: "Revolutionary technology",
    content:
      "This is revolutionary for our content creation. It saves time, money, and the results are highly professional. Truly impressive.",
    author: "Manuel R.",
    platform: "Capterra",
    color: "bg-[#D4AF37]/5",
  },
  {
    headline: "Lifelike and simple",
    content:
      "I love the lifelike avatars and the simple interface. As a designer, I appreciate tools that don't overcomplicate things.",
    author: "Thomas V.",
    platform: "G2",
    color: "bg-[#1E3A5F]/5",
  },
  {
    headline: "Best AI video tool",
    content:
      "After trying many AI video tools, AvatarAI stands out. The lip-sync is incredible and the avatars look genuinely real.",
    author: "Sophie K.",
    platform: "Product Hunt",
    color: "bg-[#D1F5F3]/30",
  },
  {
    headline: "Transformed our marketing",
    content:
      "Our marketing team now produces 10x more video content. The ROI has been incredible since we started using AvatarAI.",
    author: "Marcus J.",
    platform: "Trustpilot",
    color: "bg-[#D4AF37]/5",
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
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Subtle background */}
      <div className="absolute inset-0 pattern-dots opacity-20" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12 px-4 relative z-10"
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
            Testimonials
          </span>
        </motion.div>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A2E] mb-4">
          Loved by Creators Worldwide
        </h2>
        <p className="text-lg text-[#334155] max-w-2xl mx-auto">
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
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="flex-shrink-0 select-none"
          >
            {/* Card */}
            <div
              className={`w-[280px] md:w-[320px] p-6 ${testimonial.color} border border-[#E2E8F0] rounded-2xl flex flex-col h-full`}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Headline */}
              <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3 leading-tight">
                &ldquo;{testimonial.headline}&rdquo;
              </h3>

              {/* Content */}
              <p className="text-[#334155] text-sm leading-relaxed flex-grow">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <p className="text-sm">
                  <span className="font-semibold text-[#1A1A2E]">{testimonial.author}</span>
                  <span className="text-[#334155]"> on </span>
                  <span className="text-[#0ABAB5]">{testimonial.platform}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
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
        <p className="text-sm text-[#334155] flex items-center justify-center gap-2">
          <span className="text-[#0ABAB5]">←</span>
          Drag to scroll
          <span className="text-[#0ABAB5]">→</span>
        </p>
      </motion.div>
    </section>
  );
}
