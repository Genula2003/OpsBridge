"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform, animate, useMotionTemplate } from "framer-motion";
import { useEffect } from "react";

interface MetricPillProps {
  label: string;
  value: number;
  suffix?: string;
  className?: string;
}

export function MetricPill({ label, value, suffix = "", className }: MetricPillProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useMotionTemplate`${rounded}${suffix}`;

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
    return animation.stop;
  }, [value, count]);

  return (
    <div className={cn("flex flex-col items-center justify-center group luxury-transition", className)}>
      <motion.div className="text-3xl font-bold text-white mb-1 drop-shadow-[0_0_10px_rgba(124,92,255,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(124,92,255,0.5)]">
        {display}
      </motion.div>
      <div className="text-xs uppercase tracking-widest text-zinc-500 font-semibold group-hover:text-zinc-400 luxury-transition">
        {label}
      </div>
    </div>
  );
}
