import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, onClick, hoverEffect = false }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-panel rounded-2xl p-6 relative overflow-hidden group",
        onClick && "cursor-pointer",
        hoverEffect && "hover-lift",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/10 to-transparent opacity-0 group-hover:opacity-100 luxury-transition pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
