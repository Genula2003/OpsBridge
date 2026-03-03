"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/95 p-6 shadow-sm dark:border-white/5 dark:bg-slate-900/40 dark:shadow-xl backdrop-blur-xl dark:backdrop-blur-2xl transition-all duration-300",
        hoverEffect && "hover:shadow-md dark:hover:shadow-2xl dark:hover:shadow-primary/10 dark:hover:border-white/10 dark:hover:bg-slate-900/60",
        className
      )}
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.3, ease: "easeOut" } } : undefined}
      {...props}
    >
      {/* Subtle top inner shadow for depth */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" />
      {/* Soft hover gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-primary/10" />
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
}
