"use client";

import { motion } from "framer-motion";

const logos = [
  { src: "/logos/Asia top beauty_logo-11.png", alt: "Asia Top Beauty" },
  { src: "/logos/Asia top beauty_logo-12.png", alt: "Asia Top Beauty" },
  { src: "/logos/B30_web logo_2nd batch_FA-05.png", alt: "Brand 30" },
  { src: "/logos/B30_web logo_2nd batch_FA-08.png", alt: "Brand 30" },
  { src: "/logos/B30_web logo_2nd batch_FA-09.png", alt: "Brand 30" },
  { src: "/logos/B30_web logo_2nd batch_FA-11.png", alt: "Brand 30" },
  { src: "/logos/B30_web logo_2nd batch_FA-12.png", alt: "Brand 30" },
  { src: "/logos/B30_web logo_2nd batch_FA-13.png", alt: "Brand 30" },
  { src: "/logos/Best Malaysia Property_logo.png", alt: "Best Malaysia Property" },
  { src: "/logos/Best properties JB_logo.png", alt: "Best Properties JB" },
  { src: "/logos/Hiii Crypto_logo-16.png", alt: "Hiii Crypto" },
  { src: "/logos/JB Property Guru_logo-08.png", alt: "JB Property Guru" },
  { src: "/logos/JB Property Hub_logo-03.png", alt: "JB Property Hub" },
  { src: "/logos/JB Property Hub_logo-04.png", alt: "JB Property Hub" },
  { src: "/logos/JB Property Hub_logo-05.png", alt: "JB Property Hub" },
  { src: "/logos/Latest living home_logo-18.png", alt: "Latest Living Home" },
  { src: "/logos/Property Kaki_logo-09.png", alt: "Property Kaki" },
  { src: "/logos/Property of msia_logo-13.png", alt: "Property of Malaysia" },
  { src: "/logos/Property pulses_logo-19.png", alt: "Property Pulses" },
  { src: "/logos/Top msia property_logo-21.png", alt: "Top Malaysia Property" },
  { src: "/logos/WatchCryptoLive_logo-01.png", alt: "Watch Crypto Live" },
  { src: "/logos/Wow web3_logo-17.png", alt: "Wow Web3" },
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
            className="flex items-center gap-12"
            animate={{
              x: [0, -160 * logos.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
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
