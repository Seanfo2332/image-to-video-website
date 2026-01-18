"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MeshGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

export function MeshGradient({
  className,
  colors = ["#a855f7", "#6366f1", "#06b6d4", "#ec4899", "#8b5cf6"],
  speed = 20,
}: MeshGradientProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Animated gradient orbs */}
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full mix-blend-screen filter blur-[80px]"
          style={{
            background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
            width: `${40 + index * 10}%`,
            height: `${40 + index * 10}%`,
          }}
          animate={{
            x: [
              `${-20 + index * 30}%`,
              `${50 - index * 20}%`,
              `${20 + index * 10}%`,
              `${-20 + index * 30}%`,
            ],
            y: [
              `${-10 + index * 20}%`,
              `${40 - index * 15}%`,
              `${-20 + index * 25}%`,
              `${-10 + index * 20}%`,
            ],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: speed + index * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// Interactive mesh gradient that follows mouse
export function InteractiveMeshGradient({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-mesh animate-gradient-xy" />
    </div>
  );
}

// Stripe-style animated gradient
export function StripeGradient({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-black to-indigo-900/50" />

      {/* Animated stripe */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse 60% 30% at 80% 50%, rgba(79, 70, 229, 0.2), transparent),
            radial-gradient(ellipse 50% 80% at 20% 90%, rgba(168, 85, 247, 0.2), transparent)
          `,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Moving light beam */}
      <motion.div
        className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(139, 92, 246, 0.1) 10deg, transparent 20deg)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

// Flowing gradient waves
export function FlowingGradient({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Wave layers */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${120 * i}deg,
              transparent 0%,
              rgba(139, 92, 246, ${0.1 - i * 0.02}) 25%,
              rgba(99, 102, 241, ${0.15 - i * 0.03}) 50%,
              rgba(6, 182, 212, ${0.1 - i * 0.02}) 75%,
              transparent 100%)`,
            filter: `blur(${40 + i * 20}px)`,
          }}
          animate={{
            x: [`${-50 + i * 20}%`, `${50 - i * 20}%`, `${-50 + i * 20}%`],
            y: [`${-20 + i * 10}%`, `${20 - i * 10}%`, `${-20 + i * 10}%`],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
