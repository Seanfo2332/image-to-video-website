"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen bg-zinc-950 text-slate-950 transition-bg",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)]
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
          style={
            {
              "--white": "#fff",
              "--black": "#000",
              "--transparent": "transparent",
              "--blue-300": "#93c5fd",
              "--blue-400": "#60a5fa",
              "--blue-500": "#3b82f6",
              "--indigo-300": "#a5b4fc",
              "--violet-200": "#ddd6fe",
            } as React.CSSProperties
          }
        />
      </div>
      {children}
    </div>
  );
}

// Simplified high-performance aurora
export function AuroraSimple({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Aurora waves */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-1/4 w-[150%] h-[50%] bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-violet-500/30 blur-[100px] animate-aurora-wave" />
        <div className="absolute top-1/4 -right-1/4 w-[150%] h-[50%] bg-gradient-to-l from-indigo-500/20 via-purple-500/20 to-indigo-500/20 blur-[100px] animate-aurora-wave-reverse" />
        <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
    </div>
  );
}

// Vivid northern lights
export function NorthernLights({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Multiple aurora layers */}
      <div className="absolute inset-0 opacity-60">
        {/* Layer 1 - Green/Cyan */}
        <div
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-aurora-spin"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(34,211,238,0.4) 60deg, transparent 120deg, rgba(74,222,128,0.3) 180deg, transparent 240deg, rgba(34,211,238,0.4) 300deg, transparent 360deg)",
            filter: "blur(60px)",
          }}
        />

        {/* Layer 2 - Purple/Pink */}
        <div
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-aurora-spin-reverse"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(168,85,247,0.4) 60deg, transparent 120deg, rgba(236,72,153,0.3) 180deg, transparent 240deg, rgba(168,85,247,0.4) 300deg, transparent 360deg)",
            filter: "blur(80px)",
          }}
        />

        {/* Layer 3 - Blue accent */}
        <div
          className="absolute w-full h-full animate-pulse"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.3) 0%, transparent 50%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Stars overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InN0YXIiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9InVybCgjc3RhcikiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjMwIiByPSIwLjUiIGZpbGw9InVybCgjc3RhcikiLz48Y2lyY2xlIGN4PSI5MCIgY3k9IjcwIiByPSIxIiBmaWxsPSJ1cmwoI3N0YXIpIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMjAiIHI9IjAuNzUiIGZpbGw9InVybCgjc3RhcikiLz48Y2lyY2xlIGN4PSIxODAiIGN5PSI5MCIgcj0iMSIgZmlsbD0idXJsKCNzdGFyKSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMTUwIiByPSIwLjUiIGZpbGw9InVybCgjc3RhcikiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxNjAiIHI9IjEiIGZpbGw9InVybCgjc3RhcikiLz48Y2lyY2xlIGN4PSIxNzAiIGN5PSIxODAiIHI9IjAuNzUiIGZpbGw9InVybCgjc3RhcikiLz48L3N2Zz4=')] opacity-40" />

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </div>
  );
}
