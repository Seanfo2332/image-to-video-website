"use client";
import React, { useId } from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparkleType {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
}

const generateSparkle = (color: string): SparkleType => {
  return {
    id: Math.random().toString(36).substring(2),
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    color,
    delay: Math.random() * 2,
    scale: Math.random() * 1 + 0.3,
  };
};

export const SparklesCore = ({
  background,
  minSize,
  maxSize,
  particleDensity,
  className,
  particleColor,
}: {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}) => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([]);
  const generatedId = useId();

  useEffect(() => {
    const sparkleCount = particleDensity || 50;
    const newSparkles = Array.from({ length: sparkleCount }, () =>
      generateSparkle(particleColor || "#FFF")
    );
    setSparkles(newSparkles);

    const interval = setInterval(() => {
      setSparkles((currentSparkles) =>
        currentSparkles.map((sparkle) =>
          Math.random() > 0.7
            ? generateSparkle(particleColor || "#FFF")
            : sparkle
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [particleColor, particleDensity]);

  return (
    <div
      className={cn("h-full w-full", className)}
      style={{
        background: background || "transparent",
      }}
    >
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            className="absolute inline-block"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              zIndex: 20,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, sparkle.scale, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width={maxSize || 20}
              height={maxSize || 20}
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                fill={sparkle.color}
              />
            </svg>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};
