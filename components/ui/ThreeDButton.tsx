"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ThreeDButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function ThreeDButton({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ThreeDButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg overflow-hidden";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] dark:shadow-[0_4px_14px_0_rgba(129,140,248,0.39)] dark:hover:shadow-[0_6px_20px_rgba(129,140,248,0.23)] border border-white/10",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-slate-200 dark:border-white/5",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)]",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 rounded-md",
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 1 }}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children as React.ReactNode}</span>
      {variant !== "ghost" && (
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/10 to-transparent opacity-50" />
      )}
    </motion.button>
  );
}
