"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { scripts, users } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { TagChip } from "@/components/ui/TagChip";
import { useRole } from "@/lib/RoleProvider";
import { ThumbsUp, Copy, CheckCircle2, Search, Plus } from "lucide-react";
import { useState } from "react";

export default function VerbiageHub() {
  const { role } = useRole();
  const isTL = role === "tl" || role === "admin";
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScripts = scripts.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTemplate
      title="Verbiage Hub"
      description="Find, share, and upvote the best responses for tricky situations."
      action={
        <ThreeDButton>
          <Plus className="w-4 h-4 mr-2" /> Add Script
        </ThreeDButton>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredScripts.map((script) => {
            const author = users.find((u) => u.id === script.authorId);
            return (
              <GlassCard key={script.id} className="flex flex-col h-full gap-4 relative overflow-visible">
                {script.isApproved && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-green-500/20 text-green-500 rounded-full p-1.5 backdrop-blur-sm border border-green-500/30 shadow-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{script.title}</h3>
                  <TagChip label={script.category} variant="outline" className="shrink-0" />
                </div>

                <p className="text-muted-foreground text-sm flex-1 leading-relaxed">
                  &quot;{script.content}&quot;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {author?.name.charAt(0)}
                    </span>
                    <span className="truncate max-w-[100px]">{author?.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isTL && !script.isApproved && (
                      <button className="text-xs text-green-500 hover:text-green-600 font-medium px-2 py-1 rounded hover:bg-green-500/10 transition-colors">
                        Approve
                      </button>
                    )}
                    <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs font-medium">{script.upvotes}</span>
                    </button>
                    <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PageTemplate>
  );
}
