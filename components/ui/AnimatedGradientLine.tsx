"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedGradientLine({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={cn("h-[1px] bg-gradient-to-r from-transparent via-[#7C5CFF]/80 to-transparent origin-left opacity-60 w-full", className)}
    />
  );
}
