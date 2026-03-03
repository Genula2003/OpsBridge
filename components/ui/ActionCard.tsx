"use client";

import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function ActionCard({ title, description, icon: Icon, onClick, className }: ActionCardProps) {
  return (
    <GlassCard
      hoverEffect
      onClick={onClick}
      className={cn("cursor-pointer group flex flex-col gap-4 p-6 sm:p-8 transition-colors", className)}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
    </GlassCard>
  );
}
