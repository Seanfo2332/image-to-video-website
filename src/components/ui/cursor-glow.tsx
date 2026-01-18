"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface CursorGlowProps {
  className?: string;
  color?: string;
  size?: number;
}

export function CursorGlow({
  className,
  color = "rgba(139, 92, 246, 0.5)",
  size = 400,
}: CursorGlowProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, size]);

  return (
    <motion.div
      className={cn("fixed pointer-events-none z-0", className)}
      style={{
        x,
        y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
    />
  );
}

// Multi-color cursor trail
export function CursorTrail({ className }: { className?: string }) {
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        x: e.clientX,
        y: e.clientY,
        id: idRef.current++,
      };
      setTrails((prev) => [...prev.slice(-20), newTrail]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-0", className)}>
      {trails.map((trail, i) => (
        <motion.div
          key={trail.id}
          className="absolute rounded-full"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            left: trail.x - 15,
            top: trail.y - 15,
            width: 30,
            height: 30,
            background: `hsl(${260 + i * 5}, 80%, 60%)`,
            filter: "blur(8px)",
          }}
        />
      ))}
    </div>
  );
}

// Spotlight that follows cursor
export function CursorSpotlight({ className }: { className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-0 transition-opacity duration-300",
        className
      )}
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
      }}
    />
  );
}

// Interactive gradient background
export function InteractiveGradient({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-black" />

      {/* Interactive gradient layer */}
      <div
        className="absolute inset-0 opacity-60 transition-all duration-300"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(139, 92, 246, 0.4) 0%,
              rgba(99, 102, 241, 0.2) 30%,
              transparent 70%
            ),
            radial-gradient(ellipse 60% 40% at ${100 - mousePosition.x}% ${100 - mousePosition.y}%,
              rgba(6, 182, 212, 0.3) 0%,
              rgba(59, 130, 246, 0.15) 40%,
              transparent 70%
            )
          `,
        }}
      />

      {/* Animated base layer */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse at 0% 100%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)",
              "radial-gradient(ellipse at 100% 0%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)",
              "radial-gradient(ellipse at 0% 100%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

// Morphing gradient that reacts to scroll
export function ScrollGradient({ className }: { className?: string }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hue = (scrollY / 10) % 360;

  return (
    <div
      className={cn("fixed inset-0 pointer-events-none z-0", className)}
      style={{
        background: `
          linear-gradient(
            ${scrollY / 5}deg,
            hsla(${hue}, 70%, 50%, 0.1) 0%,
            transparent 50%
          ),
          linear-gradient(
            ${180 + scrollY / 5}deg,
            hsla(${(hue + 60) % 360}, 70%, 50%, 0.1) 0%,
            transparent 50%
          )
        `,
        transition: "background 0.3s ease-out",
      }}
    />
  );
}
