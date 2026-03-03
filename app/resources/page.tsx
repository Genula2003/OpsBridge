"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { resources } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { Book, Users, Monitor, ExternalLink, Filter, Plus } from "lucide-react";
import { useState } from "react";

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState("all");

  const icons: Record<string, React.ReactNode> = {
    book: <Book className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform duration-300" />,
    users: <Users className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform duration-300" />,
    monitor: <Monitor className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform duration-300" />,
  };

  const categories = ["all", ...new Set(resources.map((r) => r.category.toLowerCase()))];

  return (
    <PageTemplate
      title="Resources"
      description="Quick access to important tools, documents, and portals."
      action={
        <ThreeDButton>
          <Plus className="w-4 h-4 mr-2" /> Add Resource
        </ThreeDButton>
      }
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-2 mb-2 p-1 bg-muted/30 rounded-lg w-fit">
          <Filter className="w-4 h-4 ml-2 mr-1 text-muted-foreground" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                activeCategory === category
                  ? "bg-background shadow text-foreground ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resources.map((resource) => {
            if (activeCategory !== "all" && resource.category.toLowerCase() !== activeCategory) return null;

            return (
              <GlassCard key={resource.id} hoverEffect className="flex flex-col h-full cursor-pointer group hover:bg-white/5 transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute top-0 left-0 w-1 bg-primary h-0 group-hover:h-full transition-all duration-300 ease-out" />

                <div className="p-4 bg-muted/20 rounded-xl mb-6 w-fit border border-border/50 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors shadow-sm">
                  {icons[resource.icon]}
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
                    {resource.title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {resource.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full text-muted-foreground uppercase tracking-wider">
                    {resource.category}
                  </span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group/link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PageTemplate>
  );
}
