"use client";

import { motion } from "framer-motion";

const logos = [
  {
    src: "https://alphafinmedia.com/wp-content/uploads/2025/06/Untitled-design-1.png",
    alt: "Partner 1",
  },
  {
    src: "https://alphafinmedia.com/wp-content/uploads/2025/06/Untitled-design-2.png",
    alt: "Partner 2",
  },
  {
    src: "https://alphafinmedia.com/wp-content/uploads/2025/06/Untitled-design.png",
    alt: "Partner 3",
  },
  {
    src: "https://alphafinmedia.com/wp-content/uploads/2025/06/Untitled-design-7.png",
    alt: "Partner 4",
  },
  {
    src: "https://alphafinmedia.com/wp-content/uploads/2025/06/Untitled-design-6.png",
    alt: "Partner 5",
  },
  {
    src: "https://alphafinmedia.com/wp-content/uploads/2025/06/Untitled-design-5.png",
    alt: "Partner 6",
  },
  {
    src: "https://alphafinmedia.com/wp-content/uploads/2025/06/Untitled-design-4.png",
    alt: "Partner 7",
  },
  {
    src: "https://alphafinmedia.com/wp-content/uploads/2025/06/Untitled-design-3.png",
    alt: "Partner 8",
  },
];

export function LogoCarousel() {
  // Double the logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-16 bg-white border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-[#334155] uppercase tracking-wider mb-2">
            Trusted By Industry Leaders
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A2E]">
            Powering Growth for Top Brands
          </h2>
        </motion.div>

        {/* Logo carousel with infinite scroll */}
        <div className="relative overflow-hidden">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling logos */}
          <motion.div
            className="flex items-center gap-16"
            animate={{
              x: [0, -50 * logos.length * 2],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 h-16 w-40 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
