"use client";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  Users,
  Globe,
  Mic,
  Sparkles,
  Video,
  Zap,
  Palette,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    title: "100+ Lifelike AI Avatars",
    description:
      "Choose from our diverse library of photorealistic AI avatars. Each avatar features natural expressions, gestures, and movements that are indistinguishable from real humans.",
    icon: <Users className="w-6 h-6 text-cyan-400" />,
    className: "md:col-span-2",
    gradient: "from-cyan-500/20 to-blue-500/20",
    demo: <AvatarGridDemo />,
  },
  {
    title: "175+ Languages",
    description:
      "Create videos in any language with perfect lip-sync. Our AI understands tone and emotion across all languages.",
    icon: <Globe className="w-6 h-6 text-green-400" />,
    className: "md:col-span-1",
    gradient: "from-green-500/20 to-emerald-500/20",
    demo: <LanguageDemo />,
  },
  {
    title: "Natural Voice Cloning",
    description:
      "Clone any voice or choose from 300+ AI voices. Perfect pronunciation, natural pauses, and emotional delivery.",
    icon: <Mic className="w-6 h-6 text-violet-400" />,
    className: "md:col-span-1",
    gradient: "from-violet-500/20 to-purple-500/20",
    demo: <VoiceWaveDemo />,
  },
  {
    title: "Script to Video in Minutes",
    description:
      "Simply paste your script and our AI handles everything - avatar selection, voice synthesis, lip-sync, gestures, and rendering.",
    icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
    className: "md:col-span-2",
    gradient: "from-yellow-500/20 to-orange-500/20",
    demo: <ScriptDemo />,
  },
  {
    title: "4K Video Quality",
    description:
      "Export in stunning 4K resolution. Perfect for professional presentations, marketing, and social media.",
    icon: <Video className="w-6 h-6 text-pink-400" />,
    className: "md:col-span-1",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    title: "Custom Avatar Creation",
    description:
      "Create your own digital twin from just a short video. Your personal AI avatar that speaks any language.",
    icon: <Palette className="w-6 h-6 text-indigo-400" />,
    className: "md:col-span-1",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
  {
    title: "AI Script Writer",
    description:
      "Not sure what to say? Our AI helps write engaging scripts tailored to your audience and goals.",
    icon: <MessageSquare className="w-6 h-6 text-teal-400" />,
    className: "md:col-span-1",
    gradient: "from-teal-500/20 to-cyan-500/20",
  },
];

// Avatar images for the demo
const avatarImages = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
];

// Avatar grid demo component
function AvatarGridDemo() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {avatarImages.map((src, i) => (
        <motion.div
          key={i}
          className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-cyan-400/50 transition-all"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.15, y: -5, zIndex: 10 }}
        >
          <img src={src} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );
}

// Language demo component with flags
function LanguageDemo() {
  const languages = [
    { code: "EN", flag: "🇺🇸" },
    { code: "ES", flag: "🇪🇸" },
    { code: "FR", flag: "🇫🇷" },
    { code: "DE", flag: "🇩🇪" },
    { code: "中文", flag: "🇨🇳" },
    { code: "日本語", flag: "🇯🇵" },
    { code: "한국어", flag: "🇰🇷" },
    { code: "PT", flag: "🇧🇷" },
  ];
  return (
    <div className="flex flex-wrap gap-1.5 p-3">
      {languages.map((lang, i) => (
        <motion.span
          key={lang.code}
          className="px-2.5 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-300 border border-green-500/20 flex items-center gap-1.5 hover:bg-green-500/20 transition-colors cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ scale: 1.05 }}
        >
          <span>{lang.flag}</span>
          <span>{lang.code}</span>
        </motion.span>
      ))}
    </div>
  );
}

// Voice wave demo with mic visualization
function VoiceWaveDemo() {
  return (
    <div className="p-4 h-20 flex flex-col items-center justify-center">
      {/* Voice selector */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <Mic className="w-4 h-4 text-violet-400" />
        </div>
        <div className="text-xs">
          <div className="text-white font-medium">Sarah Voice</div>
          <div className="text-violet-400">English • Female</div>
        </div>
      </div>

      {/* Waveform */}
      <div className="flex items-center justify-center gap-0.5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-violet-600 to-violet-400 rounded-full"
            animate={{
              height: [4, Math.random() * 20 + 8, 4],
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.3,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Script demo with realistic UI
function ScriptDemo() {
  return (
    <div className="p-4 space-y-3">
      {/* Script header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="text-xs text-neutral-500 ml-2">script.txt</span>
      </div>

      {/* Script content with avatar */}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-400/30 flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <motion.div
            className="h-2 bg-white/20 rounded"
            initial={{ width: 0 }}
            whileInView={{ width: "90%" }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="h-2 bg-white/15 rounded"
            initial={{ width: 0 }}
            whileInView={{ width: "75%" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.div
            className="h-2 bg-white/10 rounded"
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-cyan-400">Generating video...</span>
        <span className="text-neutral-500">00:45</span>
      </div>
    </div>
  );
}

const FeatureHeader = ({ gradient, demo }: { gradient: string; demo?: React.ReactNode }) => (
  <div
    className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br ${gradient} border border-white/5 overflow-hidden`}
  >
    {demo}
  </div>
);

export function Features() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/5 to-black" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Powerful Features
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Everything You Need to Create
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
              Professional AI Videos
            </span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
            From script to screen in minutes. Our AI handles all the complex work.
          </p>
        </motion.div>

        {/* Bento grid */}
        <BentoGrid className="max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <BentoGridItem
              key={i}
              title={feature.title}
              description={feature.description}
              header={<FeatureHeader gradient={feature.gradient} demo={feature.demo} />}
              icon={feature.icon}
              className={`${feature.className} bg-neutral-900/50 border-white/5 hover:border-cyan-500/30`}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
