import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TagChip({
  children,
  label,
  className,
  active = false,
  variant = "default",
  onClick,
}: {
  children?: ReactNode;
  label?: string;
  className?: string;
  active?: boolean;
  variant?: "default" | "success" | "warning" | "outline" | "destructive";
  onClick?: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide luxury-transition",
        onClick && "cursor-pointer",
        active && "bg-[#7C5CFF]/20 text-[#7C5CFF] shadow-[0_0_15px_rgba(124,92,255,0.3)] border border-[#7C5CFF]/40",
        !active && variant === "default" && "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10",
        !active && variant === "success" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        !active && variant === "outline" && "bg-transparent text-zinc-400 border border-white/10",
        !active && variant === "warning" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        !active && variant === "destructive" && "bg-red-500/10 text-red-400 border border-red-500/20",
        className
      )}
    >
      {label || children}
    </span>
  );
}
