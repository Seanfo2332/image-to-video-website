"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  featured,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  featured?: boolean;
}) => {
  return (
    <motion.div
      className={cn(
        "row-span-1 rounded-2xl group/bento transition-all duration-200 p-5 bg-white border border-[#E2E8F0] justify-between flex flex-col space-y-4",
        "hover:shadow-premium-lg hover:border-[#0ABAB5]/20",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {/* Gold accent line for featured cards */}
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 rounded-t-2xl" />
      )}
      {header}
      <div className="transition-all duration-200">
        {icon}
        <div className="font-semibold text-[#1A1A2E] mb-2 mt-2">
          {title}
        </div>
        <div className="text-[#334155] text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
