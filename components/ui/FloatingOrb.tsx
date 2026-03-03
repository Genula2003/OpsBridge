"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FloatingOrb({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("bg-[#7C5CFF]/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen", className)}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 10, 0],
      }}
      transition={{
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
  );
}
