"use client";
import { motion } from "framer-motion";
import { FileText, Users, Mic, Video, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Write Your Script",
    description:
      "Type or paste your script. Our AI can also help generate engaging content based on your topic.",
    icon: FileText,
    color: "from-[#0ABAB5] to-[#089691]",
    preview: <ScriptPreview />,
  },
  {
    number: "02",
    title: "Choose Your Avatar",
    description:
      "Select from 100+ lifelike AI avatars or create your own digital twin from a short video.",
    icon: Users,
    color: "from-violet-500 to-purple-500",
    preview: <AvatarPreview />,
  },
  {
    number: "03",
    title: "Select Voice & Language",
    description:
      "Pick from 300+ natural voices in 175+ languages. Clone your own voice for a personal touch.",
    icon: Mic,
    color: "from-pink-500 to-rose-500",
    preview: <VoicePreview />,
  },
  {
    number: "04",
    title: "Generate & Download",
    description:
      "Hit generate and get your professional video in minutes. Export in 4K for any platform.",
    icon: Video,
    color: "from-emerald-500 to-green-500",
    preview: <VideoPreview />,
  },
];

// Preview components
function ScriptPreview() {
  return (
    <div className="p-4 space-y-2">
      <motion.div
        className="h-2 bg-slate-300 rounded"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="h-2 bg-slate-200 rounded"
        initial={{ width: 0 }}
        whileInView={{ width: "80%" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      <motion.div
        className="h-2 bg-slate-100 rounded"
        initial={{ width: 0 }}
        whileInView={{ width: "60%" }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.div
        className="mt-3 h-1 bg-gradient-to-r from-[#0ABAB5] to-transparent rounded"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}

// Avatar images for preview
const avatarPreviews = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
];

function AvatarPreview() {
  return (
    <div className="p-4 flex justify-center gap-2">
      {avatarPreviews.map((src, i) => (
        <motion.div
          key={i}
          className={`w-10 h-10 rounded-full overflow-hidden ${
            i === 1
              ? "ring-2 ring-violet-400 scale-110"
              : "opacity-60"
          }`}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: i === 1 ? 1.1 : 1, opacity: i === 1 ? 1 : 0.6 }}
          transition={{ delay: i * 0.1, type: "spring" }}
          whileHover={{ scale: 1.2, opacity: 1 }}
        >
          <img src={src} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );
}

function VoicePreview() {
  return (
    <div className="p-4 flex items-center justify-center gap-1">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-pink-400 rounded-full"
          animate={{ height: [4, 16, 4] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

function VideoPreview() {
  return (
    <div className="p-3 flex items-center justify-center">
      <div className="relative">
        {/* Video thumbnail */}
        <div className="w-20 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-green-50 border border-emerald-200">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=112&fit=crop&crop=face"
            alt="Video preview"
            className="w-full h-full object-cover opacity-80"
          />
          {/* Play overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Video className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        </div>
        {/* Download indicator */}
        <motion.div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <span className="text-[10px] text-white">✓</span>
        </motion.div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[#F8FAFC]">
      {/* Subtle background lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#0ABAB5]/10 to-transparent" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-[#BDD3E1]/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-block px-4 py-1 rounded-full bg-[#D1F5F3] border border-[#0ABAB5]/20 text-[#089691] text-sm mb-4 font-medium"
          >
            Simple Process
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1E293B]">
            Create Videos in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ABAB5] to-slate-400">
              {" "}4 Easy Steps
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            No video editing skills needed. Our AI does all the heavy lifting.
          </p>
        </motion.div>

        {/* Steps - horizontal on desktop */}
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0ABAB5] via-violet-400 to-emerald-400"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#0ABAB5]/30 hover:shadow-lg transition-all duration-300 group h-full">
                  {/* Step number badge */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-lg`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Step number */}
                  <div className="text-5xl font-bold text-slate-100 absolute top-4 right-4">
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    {step.description}
                  </p>

                  {/* Preview */}
                  <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                    {step.preview}
                  </div>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-[#0ABAB5]/50 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(10, 186, 181, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-semibold text-lg shadow-lg shadow-[#0ABAB5]/25 transition-all"
          >
            Start Creating Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
