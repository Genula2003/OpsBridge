"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ThreeDButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function ThreeDButton({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: ThreeDButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shadow-md";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const variants = {
    primary: "bg-[#7C5CFF] text-white hover:bg-[#6A4BE5] shadow-[0_4px_14px_0_rgba(124,92,255,0.39)] hover:shadow-[0_6px_20px_rgba(124,92,255,0.23)] hover:-translate-y-[2px]",
    secondary: "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10 hover:text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.05)] hover:-translate-y-[2px]",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:text-red-300 shadow-[0_4px_14px_0_rgba(239,68,68,0.1)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.15)] hover:-translate-y-[2px]",
    ghost: "bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white shadow-none hover:shadow-none border border-transparent hover:border-white/10"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed transform-none hover:shadow-none",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
