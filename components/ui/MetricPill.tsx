"use client";

import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface MetricPillProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricPill({ title, value, icon: Icon, trend, className }: MetricPillProps) {
  const isNumber = typeof value === 'number';
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isNumber && !hasAnimated) {
      const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
      setHasAnimated(true);
      return controls.stop;
    }
  }, [value, isNumber, count, hasAnimated]);

  return (
    <GlassCard hoverEffect className={cn("group flex flex-col gap-3 p-5", className)}>
      <div className="flex items-center justify-between text-muted-foreground transition-colors group-hover:text-foreground">
        <span className="text-sm font-medium">{title}</span>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] dark:group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]"
        >
          {isNumber ? <motion.span>{rounded}</motion.span> : <span>{value}</span>}
        </motion.div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend.isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
    </GlassCard>
  );
}
