"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MorphingBlobsProps {
  className?: string;
}

export function MorphingBlobs({ className }: MorphingBlobsProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Blob 1 - Purple */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0) 70%)",
          filter: "blur(60px)",
          top: "-10%",
          left: "-10%",
        }}
        animate={{
          scale: [1, 1.2, 1.1, 1],
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 60% 70% 40% / 50% 60% 30% 60%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 2 - Cyan */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0) 70%)",
          filter: "blur(60px)",
          top: "20%",
          right: "-5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -80, -40, 0],
          y: [0, 80, 40, 0],
          borderRadius: [
            "40% 60% 60% 40% / 60% 40% 60% 40%",
            "60% 40% 40% 60% / 40% 60% 40% 60%",
            "40% 60% 60% 40% / 60% 40% 60% 40%",
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Blob 3 - Indigo */}
      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(99, 102, 241, 0) 70%)",
          filter: "blur(60px)",
          bottom: "-15%",
          left: "20%",
        }}
        animate={{
          scale: [1, 1.15, 1.05, 1],
          x: [0, 60, -30, 0],
          y: [0, -60, -30, 0],
          borderRadius: [
            "50% 50% 40% 60% / 40% 50% 50% 60%",
            "40% 60% 50% 50% / 60% 40% 60% 40%",
            "50% 50% 40% 60% / 40% 50% 50% 60%",
          ],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Blob 4 - Pink accent */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(236, 72, 153, 0) 70%)",
          filter: "blur(50px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.4, 1.2, 1],
          borderRadius: [
            "70% 30% 50% 50% / 50% 50% 30% 70%",
            "30% 70% 50% 50% / 50% 50% 70% 30%",
            "70% 30% 50% 50% / 50% 50% 30% 70%",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}

// Lava lamp style blobs
export function LavaBlobs({ className }: { className?: string }) {
  const blobs = [
    { color: "rgba(139, 92, 246, 0.6)", size: 300, delay: 0 },
    { color: "rgba(99, 102, 241, 0.5)", size: 250, delay: 2 },
    { color: "rgba(168, 85, 247, 0.5)", size: 280, delay: 4 },
    { color: "rgba(236, 72, 153, 0.4)", size: 200, delay: 1 },
    { color: "rgba(6, 182, 212, 0.4)", size: 220, delay: 3 },
  ];

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0" style={{ filter: "url(#goo)" }}>
        {blobs.map((blob, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              background: blob.color,
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -100, 50, -50, 0],
              x: [0, 50, -30, 30, 0],
              scale: [1, 1.2, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: blob.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Floating orbs with glow
export function FloatingOrbs({ className }: { className?: string }) {
  const orbs = [
    { x: "10%", y: "20%", size: 120, color: "#a855f7", duration: 8 },
    { x: "80%", y: "30%", size: 80, color: "#06b6d4", duration: 10 },
    { x: "30%", y: "70%", size: 100, color: "#6366f1", duration: 12 },
    { x: "70%", y: "80%", size: 60, color: "#ec4899", duration: 9 },
    { x: "50%", y: "40%", size: 140, color: "#8b5cf6", duration: 11 },
  ];

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}40 0%, transparent 70%)`,
            boxShadow: `0 0 ${orb.size / 2}px ${orb.color}40, 0 0 ${orb.size}px ${orb.color}20`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
