"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { SparklesCore } from "@/components/ui/sparkles";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, Users, Globe, Mic } from "lucide-react";
import Link from "next/link";

// Avatar data with talking head videos
// Using free stock videos from Mixkit - thumbnails extracted directly from videos
const avatars = [
  {
    id: 1,
    name: "James",
    role: "Business",
    // Thumbnail directly from the video for perfect sync
    thumbnail: "https://assets.mixkit.co/videos/28287/28287-thumb-720-0.jpg",
    // Man in suit talking directly to camera with hand gestures
    video: "https://assets.mixkit.co/videos/28287/28287-720.mp4",
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: 2,
    name: "Dr. David",
    role: "Professional",
    // Thumbnail directly from the video for perfect sync
    thumbnail: "https://assets.mixkit.co/videos/4834/4834-thumb-720-0.jpg",
    // Doctor/therapist speaking directly to camera from office
    video: "https://assets.mixkit.co/videos/4834/4834-720.mp4",
    color: "from-violet-500 to-purple-500"
  },
  {
    id: 3,
    name: "Alex",
    role: "Presenter",
    // Thumbnail directly from the video for perfect sync
    thumbnail: "https://assets.mixkit.co/videos/2961/2961-thumb-720-0.jpg",
    // Person talking directly to camera with microphone
    video: "https://assets.mixkit.co/videos/2961/2961-720.mp4",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 4,
    name: "Sofia",
    role: "Creator",
    // Thumbnail directly from the video for perfect sync
    thumbnail: "https://assets.mixkit.co/videos/42323/42323-thumb-720-0.jpg",
    // Content creator style talking to camera
    video: "https://assets.mixkit.co/videos/42323/42323-720.mp4",
    color: "from-amber-500 to-orange-500"
  },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeAvatar, setActiveAvatar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Reset video when avatar changes
  useEffect(() => {
    setVideoError(false);
    setVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [activeAvatar]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Simplified background - single gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Single spotlight for accent */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="cyan"
      />

      {/* Reduced sparkles - lower density for better performance */}
      <div className="absolute inset-0">
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.2}
          particleDensity={15}
          className="w-full h-full"
          particleColor="#00C3FF"
        />
      </div>

      {/* Static gradient orbs - no animation, just CSS */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(0, 195, 255, 0.6) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)",
          top: "50%",
          right: "5%",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-32 md:pt-28">
        {/* Badge - simplified animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-200 font-medium">
              #1 AI Avatar Video Platform
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </div>
        </motion.div>

        {/* Main heading - simplified */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold text-center leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-400">
            Create AI Avatar Videos
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
            That Look Real
          </span>
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          {/* Static glow effect - no animation */}
          <div
            className="absolute -inset-6 rounded-3xl opacity-25"
            style={{
              background: "linear-gradient(45deg, rgba(0, 195, 255, 0.4), rgba(139, 92, 246, 0.4))",
              filter: "blur(30px)",
            }}
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
                    <div className="absolute inset-0">
                      {/* Show thumbnail while video loads */}
                      <img
                        src={avatars[activeAvatar].thumbnail}
                        alt={avatars[activeAvatar].name}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'}`}
                      />
                      {!videoError && (
                        <video
                          ref={videoRef}
                          src={avatars[activeAvatar].video}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          preload="metadata"
                          onCanPlay={() => setVideoLoaded(true)}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onError={() => setVideoError(true)}
                        />
                      )}
                      {/* Gradient overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    {/* Video Controls - simplified */}
                    {!videoError && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => {
                            if (videoRef.current) {
                              if (isPlaying) {
                                videoRef.current.pause();
                              } else {
                                videoRef.current.play();
                              }
                            }
                          }}
                          className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>

                        <button
                          onClick={() => {
                            setIsMuted(!isMuted);
                            if (videoRef.current) {
                              videoRef.current.muted = !isMuted;
                            }
                          }}
                          className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Speaking indicator - simplified */}
                    {isPlaying && !videoError && videoLoaded && (
                      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1 px-4 py-2 rounded-full bg-black/60">
                        <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
                        <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                        <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}

                    {/* Avatar name badge - simplified */}
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold">{avatars[activeAvatar].name}</div>
                          <div className="text-cyan-400 text-sm">{avatars[activeAvatar].role} Avatar</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400">
                            {videoError ? "Preview" : isPlaying && videoLoaded ? "Speaking" : "Loading..."}
                          </span>
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${videoError ? "bg-blue-500" : isPlaying && videoLoaded ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Avatar selector thumbnails - simplified */}
                  <div className="flex justify-center gap-3 mt-4">
                    {avatars.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveAvatar(index);
                          setIsPlaying(true);
                        }}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                          index === activeAvatar
                            ? "border-cyan-400 shadow-lg shadow-cyan-400/30"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        <img
                          src={avatar.thumbnail}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {index === activeAvatar && (
                          <div className="absolute inset-0 bg-cyan-400/20" />
                        )}
                      </button>
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

          {/* Floating elements - static for performance */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-2xl">🎭</span>
          </div>

          <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-xl">🎬</span>
          </div>
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
