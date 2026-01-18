"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { SparklesCore } from "@/components/ui/sparkles";
import { NorthernLights } from "@/components/ui/aurora-background";
import { MorphingBlobs } from "@/components/ui/morphing-blobs";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, Users, Globe, Mic } from "lucide-react";
import Link from "next/link";

// Avatar data with videos and thumbnail images
// Replace video URLs with your actual AI avatar videos
const avatars = [
  {
    id: 1,
    name: "Sarah",
    role: "Business",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
    // Sample video - replace with your AI avatar video URL
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: 2,
    name: "James",
    role: "Casual",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    color: "from-violet-500 to-purple-500"
  },
  {
    id: 3,
    name: "Emily",
    role: "Professional",
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 4,
    name: "Michael",
    role: "Creative",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    color: "from-amber-500 to-orange-500"
  },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeAvatar, setActiveAvatar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Mouse tracking for interactive gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Reset video when avatar changes
  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked
        setIsPlaying(false);
      });
    }
  }, [activeAvatar]);

  // Parallax transforms
  const bgX = useTransform(smoothMouseX, [0, 1], [-20, 20]);
  const bgY = useTransform(smoothMouseY, [0, 1], [-20, 20]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Layer 1: Northern Lights Background */}
      <NorthernLights className="opacity-50" />

      {/* Layer 2: Morphing Blobs */}
      <MorphingBlobs className="opacity-30" />

      {/* Layer 3: Interactive mouse gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 195, 255, 0.12), transparent 40%)`,
        }}
      />

      {/* Layer 4: Spotlights */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <Spotlight
        className="top-10 left-full h-[80vh] w-[50vw]"
        fill="cyan"
      />
      <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />

      {/* Layer 5: Sparkles */}
      <div className="absolute inset-0">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.5}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#00C3FF"
        />
      </div>

      {/* Layer 6: Animated gradient orbs - cyan theme */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 195, 255, 0.8) 0%, transparent 70%)",
          x: bgX,
          y: bgY,
          top: "10%",
          left: "10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%)",
          top: "50%",
          right: "5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-32 md:pt-28">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 195, 255, 0.3)",
                "0 0 40px rgba(0, 195, 255, 0.5)",
                "0 0 20px rgba(0, 195, 255, 0.3)",
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </motion.div>
            <span className="text-sm text-cyan-200 font-medium">
              #1 AI Avatar Video Platform
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </motion.div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-7xl font-bold text-center leading-tight"
        >
          <motion.span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-400">
            Create AI Avatar Videos
          </motion.span>
          <br />
          <motion.span
            className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            That Look Real
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 flex justify-center"
        >
          <TextGenerateEffect
            words="Turn your text into professional videos with lifelike AI avatars. 175+ languages, natural lip-sync, and realistic gestures."
            className="text-center text-lg md:text-xl text-neutral-300 max-w-2xl"
          />
        </motion.div>

        {/* Quick feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-6"
        >
          {[
            { icon: Users, text: "100+ AI Avatars" },
            { icon: Globe, text: "175+ Languages" },
            { icon: Mic, text: "Natural Voice" },
          ].map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
            >
              <item.icon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-neutral-300">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link href="/generate">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <ShimmerButton
                className="shadow-2xl px-8 py-4"
                shimmerColor="#00C3FF"
                background="linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)"
              >
                <span className="flex items-center gap-2 text-white font-semibold text-lg">
                  Create Free Video
                  <ArrowRight className="w-5 h-5" />
                </span>
              </ShimmerButton>
            </motion.div>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            See Examples
          </motion.button>
        </motion.div>

        {/* Avatar Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-8 rounded-3xl opacity-30"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(0, 195, 255, 0.4), rgba(139, 92, 246, 0.4))",
                "linear-gradient(180deg, rgba(6, 182, 212, 0.4), rgba(99, 102, 241, 0.4))",
                "linear-gradient(315deg, rgba(34, 211, 238, 0.4), rgba(0, 195, 255, 0.4))",
                "linear-gradient(45deg, rgba(0, 195, 255, 0.4), rgba(139, 92, 246, 0.4))",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "blur(40px)" }}
          />

          <LiquidGlassCard className="relative">
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Video Player */}
                <div className="relative">
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-neutral-900 to-black overflow-hidden relative border border-white/10">
                    {/* Background gradient based on active avatar */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${avatars[activeAvatar].color} opacity-20`}
                      key={`bg-${activeAvatar}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Video Player or Image Fallback */}
                    <motion.div
                      className="absolute inset-0"
                      key={activeAvatar}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {!videoError ? (
                        <video
                          ref={videoRef}
                          src={avatars[activeAvatar].video}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onError={() => setVideoError(true)}
                        />
                      ) : (
                        <img
                          src={avatars[activeAvatar].thumbnail}
                          alt={avatars[activeAvatar].name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Gradient overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </motion.div>

                    {/* Video Controls - only show when video is working */}
                    {!videoError && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        {/* Play/Pause Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (videoRef.current) {
                              if (isPlaying) {
                                videoRef.current.pause();
                              } else {
                                videoRef.current.play();
                              }
                            }
                          }}
                          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </motion.button>

                        {/* Mute/Unmute Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setIsMuted(!isMuted);
                            if (videoRef.current) {
                              videoRef.current.muted = !isMuted;
                            }
                          }}
                          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    )}

                    {/* Speaking animation overlay */}
                    {isPlaying && !videoError && (
                      <motion.div
                        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-cyan-400 rounded-full"
                            animate={{
                              height: [4, 16, 4],
                            }}
                            transition={{
                              duration: 0.4,
                              repeat: Infinity,
                              delay: i * 0.08,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}

                    {/* Avatar name badge */}
                    <motion.div
                      className="absolute bottom-4 left-4 right-4 p-3 rounded-xl liquid-glass"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold">{avatars[activeAvatar].name}</div>
                          <div className="text-cyan-400 text-sm">{avatars[activeAvatar].role} Avatar</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400">
                            {videoError ? "Preview" : isPlaying ? "Speaking" : "Paused"}
                          </span>
                          <motion.div
                            className={`w-2.5 h-2.5 rounded-full ${videoError ? "bg-blue-500" : isPlaying ? "bg-green-500" : "bg-yellow-500"}`}
                            animate={isPlaying && !videoError ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Avatar selector thumbnails */}
                  <div className="flex justify-center gap-3 mt-4">
                    {avatars.map((avatar, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setActiveAvatar(index);
                          setIsPlaying(true);
                        }}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                          index === activeAvatar
                            ? "border-cyan-400 shadow-lg shadow-cyan-400/30"
                            : "border-white/20 hover:border-white/40"
                        }`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={avatar.thumbnail}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                        {index === activeAvatar && (
                          <motion.div
                            className="absolute inset-0 bg-cyan-400/20"
                            layoutId="avatarSelector"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Right side - Script input demo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Just type your script
                    </h3>
                    <p className="text-neutral-400 text-sm">
                      Our AI creates a professional video with your chosen avatar speaking your words naturally.
                    </p>
                  </div>

                  {/* Fake script input */}
                  <div className="rounded-xl bg-black/50 border border-white/10 p-4">
                    <div className="text-neutral-500 text-sm mb-2">Your script</div>
                    <motion.div
                      className="text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <TypewriterText text="Hello! Welcome to our platform. Today I'll show you how easy it is to create professional videos with AI avatars..." />
                    </motion.div>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-2">
                    {["Auto lip-sync", "Natural gestures", "4K quality", "Fast render"].map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Generate button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Generate Video
                  </motion.button>
                </div>
              </div>
            </div>
          </LiquidGlassCard>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-2xl">🎭</span>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center"
            animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <span className="text-xl">🎬</span>
          </motion.div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-500 text-sm mb-4">Trusted by 10,000+ creators worldwide</p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            {["Fortune 500", "Startups", "Creators", "Agencies"].map((text) => (
              <span key={text} className="text-neutral-400 font-medium">{text}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Typewriter effect component
function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-cyan-400"
      >
        |
      </motion.span>
    </span>
  );
}
