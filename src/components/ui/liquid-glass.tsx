"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function LiquidGlass({
  children,
  className,
  intensity = 1,
}: LiquidGlassProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-0.5, 0.5], [10 * intensity, -10 * intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10 * intensity, 10 * intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-3xl overflow-hidden",
        className
      )}
    >
      {/* Liquid glass layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent backdrop-blur-xl" />

      {/* Refraction highlight */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(circle at ${50 + x.get() * 50}% ${50 + y.get() * 50}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
        }}
      />

      {/* Chromatic aberration effect */}
      <div className="absolute inset-0 mix-blend-overlay">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-rose-500/10 animate-pulse" />
      </div>

      {/* Border glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/20" />
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          boxShadow: isHovered
            ? "inset 0 0 30px rgba(255,255,255,0.1), 0 0 40px rgba(139,92,246,0.3)"
            : "inset 0 0 20px rgba(255,255,255,0.05)",
        }}
        animate={{
          boxShadow: isHovered
            ? "inset 0 0 30px rgba(255,255,255,0.1), 0 0 40px rgba(139,92,246,0.3)"
            : "inset 0 0 20px rgba(255,255,255,0.05)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

// Liquid Glass Card with enhanced effects
export function LiquidGlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative rounded-3xl p-[1px] overflow-hidden group",
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from 180deg at ${mousePosition.x}% ${mousePosition.y}%,
            #a855f7 0deg,
            #6366f1 60deg,
            #06b6d4 120deg,
            #a855f7 180deg,
            #6366f1 240deg,
            #06b6d4 300deg,
            #a855f7 360deg)`,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Glass background */}
      <div className="relative rounded-3xl bg-black/40 backdrop-blur-2xl overflow-hidden">
        {/* Specular highlight */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(255,255,255,0.3) 0%,
              transparent 50%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
}
