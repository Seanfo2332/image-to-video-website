"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play, Pause, Volume2, Globe, Briefcase, GraduationCap, ShoppingBag, Heart, Megaphone } from "lucide-react";

// Avatar categories
const categories = [
  { id: "all", label: "All Avatars", icon: null },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "marketing", label: "Marketing", icon: Megaphone },
];

// Avatar data with diverse representations
const avatarsData = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Business Professional",
    category: "business",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "Mandarin"],
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Corporate Executive",
    category: "business",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "Spanish"],
  },
  {
    id: 3,
    name: "Emily Roberts",
    role: "Marketing Specialist",
    category: "marketing",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "French"],
  },
  {
    id: 4,
    name: "Michael Brooks",
    role: "Tech Presenter",
    category: "education",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "German"],
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Healthcare Expert",
    category: "healthcare",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "Hindi"],
  },
  {
    id: 6,
    name: "David Kim",
    role: "E-commerce Host",
    category: "ecommerce",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "Korean"],
  },
  {
    id: 7,
    name: "Sofia Martinez",
    role: "Brand Ambassador",
    category: "marketing",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "Spanish", "Portuguese"],
  },
  {
    id: 8,
    name: "Dr. Robert Taylor",
    role: "Medical Educator",
    category: "healthcare",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=400&fit=crop&crop=face",
    languages: ["English"],
  },
  {
    id: 9,
    name: "Lisa Wang",
    role: "Course Instructor",
    category: "education",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "Mandarin", "Japanese"],
  },
  {
    id: 10,
    name: "Marcus Johnson",
    role: "Sales Presenter",
    category: "ecommerce",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "French"],
  },
  {
    id: 11,
    name: "Priya Sharma",
    role: "Training Specialist",
    category: "education",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "Hindi", "Tamil"],
  },
  {
    id: 12,
    name: "Chris Anderson",
    role: "Product Demo Expert",
    category: "business",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop&crop=face",
    languages: ["English", "Swedish"],
  },
];

function AvatarCard({ avatar, index }: { avatar: typeof avatarsData[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPlaying(false);
      }}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
        {/* Avatar image */}
        <motion.img
          src={avatar.image}
          alt={avatar.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />

        {/* Speaking animation (shown on hover) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-cyan-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-cyan-500/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </motion.button>
        </motion.div>

        {/* Voice wave animation when playing */}
        {isPlaying && (
          <motion.div
            className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Volume2 className="w-3 h-3 text-cyan-400" />
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-cyan-400 rounded-full"
                animate={{ height: [3, 10, 3] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}

        {/* Info section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
          >
            <h4 className="text-white font-semibold text-lg">{avatar.name}</h4>
            <p className="text-neutral-400 text-sm">{avatar.role}</p>
          </motion.div>

          {/* Languages */}
          <motion.div
            className="flex items-center gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span className="text-xs text-neutral-300">
              {avatar.languages.join(", ")}
            </span>
          </motion.div>
        </div>

        {/* Hover border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 2px rgba(6, 182, 212, 0.5), 0 0 30px rgba(6, 182, 212, 0.2)"
              : "inset 0 0 0 0px transparent",
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

export function Avatars() {
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const filteredAvatars = activeCategory === "all"
    ? avatarsData
    : avatarsData.filter((avatar) => avatar.category === activeCategory);

  return (
    <section id="avatars" ref={sectionRef} className="py-24 px-4 relative overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-4"
          >
            100+ AI Avatars
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Choose Your Perfect
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
              {" "}AI Presenter
            </span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
            Diverse, lifelike avatars for every industry and use case. Each avatar speaks 175+ languages with natural lip-sync.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === category.id
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon && <category.icon className="w-4 h-4" />}
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Avatar grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredAvatars.map((avatar, index) => (
            <AvatarCard key={avatar.id} avatar={avatar} index={index} />
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: "100+", label: "AI Avatars" },
            { number: "175+", label: "Languages" },
            { number: "50+", label: "Ethnicities" },
            { number: "∞", label: "Customization" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/5"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
                {stat.number}
              </div>
              <div className="text-neutral-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg shadow-lg shadow-cyan-500/25"
          >
            Browse All Avatars
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
