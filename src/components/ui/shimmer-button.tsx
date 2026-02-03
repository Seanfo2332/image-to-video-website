"use client";
import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "tiffany" | "gold";
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "12px",
      background = "rgba(0, 0, 0, 1)",
      variant = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Apply variant-specific styles
    const variantStyles = {
      default: {
        background: "rgba(0, 0, 0, 1)",
        shimmerColor: "#ffffff",
      },
      tiffany: {
        background: "#0ABAB5",
        shimmerColor: "#D1F5F3",
      },
      gold: {
        background: "#D4AF37",
        shimmerColor: "#E8D48A",
      },
    };

    const styles = variantStyles[variant];

    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": styles.shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": styles.background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white font-medium [background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-all duration-200 active:translate-y-px",
          "shadow-lg",
          variant === "tiffany" && "shadow-[#0ABAB5]/20 hover:shadow-[#0ABAB5]/30",
          variant === "gold" && "shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 text-[#1A1A2E]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "insert-0 absolute size-full",
            "rounded-xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-200",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

// Premium Button variants for easy use
export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl bg-[#0ABAB5] hover:bg-[#089691] text-white font-medium",
        "shadow-lg shadow-[#0ABAB5]/20 hover:shadow-[#0ABAB5]/30",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl border border-[#E2E8F0] bg-white text-[#1A1A2E] font-medium",
        "hover:border-[#0ABAB5] hover:bg-[#D1F5F3]/30",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GoldButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8D48A] text-[#1A1A2E] font-semibold",
        "shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
