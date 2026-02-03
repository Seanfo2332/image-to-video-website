"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, Users, Globe, Mic, TrendingUp, Check } from "lucide-react";
import Link from "next/link";

// Avatar data with talking head videos
const avatars = [
  {
    id: 1,
    name: "James",
    role: "Business",
    thumbnail: "https://assets.mixkit.co/videos/28287/28287-thumb-720-0.jpg",
    video: "https://assets.mixkit.co/videos/28287/28287-720.mp4",
    color: "from-[#0ABAB5] to-[#089691]"
  },
  {
    id: 2,
    name: "Dr. David",
    role: "Professional",
    thumbnail: "https://assets.mixkit.co/videos/4834/4834-thumb-720-0.jpg",
    video: "https://assets.mixkit.co/videos/4834/4834-720.mp4",
    color: "from-[#BDD3E1] to-slate-400"
  },
  {
    id: 3,
    name: "Alex",
    role: "Presenter",
    thumbnail: "https://assets.mixkit.co/videos/2961/2961-thumb-720-0.jpg",
    video: "https://assets.mixkit.co/videos/2961/2961-720.mp4",
    color: "from-pink-400 to-rose-400"
  },
  {
    id: 4,
    name: "Sofia",
    role: "Creator",
    thumbnail: "https://assets.mixkit.co/videos/42323/42323-thumb-720-0.jpg",
    video: "https://assets.mixkit.co/videos/42323/42323-720.mp4",
    color: "from-amber-400 to-orange-400"
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
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #ffffff 0%, #F8FAFC 50%, #ffffff 100%)`,
        backgroundImage: `
          radial-gradient(at 100% 0%, rgba(10, 186, 181, 0.08) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(189, 211, 225, 0.1) 0px, transparent 50%)
        `
      }}
    >
      {/* Subtle gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#D1F5F3] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#BDD3E1]/30 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-32 md:pt-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D1F5F3] border border-[#0ABAB5]/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#0ABAB5]" />
            <span className="text-sm text-[#089691] font-medium">
              #1 AI Avatar Video Platform
            </span>
            <ArrowRight className="w-4 h-4 text-[#0ABAB5]" />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold text-center leading-tight"
        >
          <span className="text-[#1E293B]">
            Create AI Avatar Videos
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ABAB5] to-slate-400">
            That Look Real
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center text-lg md:text-xl text-slate-500 max-w-2xl mx-auto"
        >
          Turn your text into professional videos with lifelike AI avatars. 175+ languages, natural lip-sync, and realistic gestures.
        </motion.p>

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
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm"
            >
              <item.icon className="w-4 h-4 text-[#0ABAB5]" />
              <span className="text-sm text-slate-600">{item.text}</span>
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
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(10, 186, 181, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-semibold text-lg shadow-lg shadow-[#0ABAB5]/25 flex items-center gap-2 transition-all"
            >
              <span>Create Free Video</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "#f8fafc" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl border border-slate-200 bg-white text-[#1E293B] font-semibold text-lg shadow-sm transition-all flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            See Examples
          </motion.button>
        </motion.div>

        {/* Avatar Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          {/* Card glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#0ABAB5]/10 to-[#BDD3E1]/10 rounded-3xl blur-2xl" />

          {/* Main card */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Video Player */}
                <div className="relative">
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden relative border border-slate-200 shadow-inner">
                    {/* Background gradient based on active avatar */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${avatars[activeAvatar].color} opacity-10`}
                      key={`bg-${activeAvatar}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
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
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    </div>

                    {/* Video Controls */}
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
                          className="w-10 h-10 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-sm"
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
                          className="w-10 h-10 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-sm"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Speaking indicator */}
                    {isPlaying && !videoError && videoLoaded && (
                      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1 px-4 py-2 rounded-full bg-white/90 shadow-sm">
                        <div className="w-1 h-3 bg-[#0ABAB5] rounded-full animate-pulse" />
                        <div className="w-1 h-4 bg-[#0ABAB5] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-2 bg-[#0ABAB5] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 h-4 bg-[#0ABAB5] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                        <div className="w-1 h-3 bg-[#0ABAB5] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}

                    {/* Avatar name badge */}
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[#1E293B] font-semibold">{avatars[activeAvatar].name}</div>
                          <div className="text-[#0ABAB5] text-sm">{avatars[activeAvatar].role} Avatar</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {videoError ? "Preview" : isPlaying && videoLoaded ? "Speaking" : "Loading..."}
                          </span>
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${videoError ? "bg-blue-500" : isPlaying && videoLoaded ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Avatar selector thumbnails */}
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
                            ? "border-[#0ABAB5] shadow-lg shadow-[#0ABAB5]/30"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={avatar.thumbnail}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {index === activeAvatar && (
                          <div className="absolute inset-0 bg-[#0ABAB5]/20" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right side - Script input demo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1E293B] mb-2">
                      Just type your script
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Our AI creates a professional video with your chosen avatar speaking your words naturally.
                    </p>
                  </div>

                  {/* Fake script input */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <div className="text-slate-400 text-sm mb-2">Your script</div>
                    <motion.div
                      className="text-[#1E293B]"
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
                        className="px-3 py-1 rounded-full bg-[#D1F5F3] border border-[#0ABAB5]/20 text-[#089691] text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Generate button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#0ABAB5]/20"
                  >
                    <Play className="w-5 h-5" />
                    Generate Video
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center">
            <span className="text-2xl">🎭</span>
          </div>

          <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center">
            <span className="text-xl">🎬</span>
          </div>

          {/* Growth indicator floating card */}
          <div className="absolute -top-6 -right-6 hidden lg:flex bg-white p-4 rounded-2xl shadow-xl border border-slate-100 items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D1F5F3] flex items-center justify-center">
              <Check className="text-[#0ABAB5] w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Growth</div>
              <div className="text-sm font-bold text-[#1E293B]">+24.5%</div>
            </div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 text-sm mb-4">Trusted by 10,000+ creators worldwide</p>
          <div className="flex items-center justify-center gap-8">
            {["Fortune 500", "Startups", "Creators", "Agencies"].map((text) => (
              <span key={text} className="text-slate-300 font-medium">{text}</span>
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
        className="text-[#0ABAB5]"
      >
        |
      </motion.span>
    </span>
  );
}
