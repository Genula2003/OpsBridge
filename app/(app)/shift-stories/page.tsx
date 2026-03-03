"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { stories, users } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { TagChip } from "@/components/ui/TagChip";
import { useRole } from "@/lib/RoleProvider";
import { Heart, MessageCircle, Pin, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ShiftStories() {
  const { role } = useRole();
  const isTL = role === "tl" || role === "admin";
  const [activeTab, setActiveTab] = useState("all");

  const sortedStories = [...stories].sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isPinned ? -1 : 1;
  });

  return (
    <PageTemplate
      title="Shift Stories"
      description="Share your wins, funny moments, and learnings from your shift."
      action={
        <ThreeDButton>
          Post Story
        </ThreeDButton>
      }
    >
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === "all" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            All Stories
          </button>
          <button
            onClick={() => setActiveTab("wins")}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === "wins" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            Wins
          </button>
          <button
            onClick={() => setActiveTab("learnings")}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === "learnings" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            Learnings
          </button>
        </div>

        <div className="space-y-6">
          {sortedStories.map((story) => {
            if (activeTab === "wins" && story.category !== "Win") return null;
            if (activeTab === "learnings" && story.category !== "Learning") return null;

            const author = users.find((u) => u.id === story.authorId);
            return (
              <GlassCard key={story.id} className={cn("relative", story.isPinned && "border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]")}>
                {story.isPinned && (
                  <div className="absolute -top-3 -right-3 rotate-12">
                    <div className="bg-primary text-white rounded-full p-2 shadow-lg ring-4 ring-background">
                      <Pin className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center font-bold text-lg text-primary">
                      {author?.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{author?.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(story.createdAt).toLocaleDateString()} • {author?.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TagChip label={story.category} variant={story.category === "Win" ? "success" : "default"} />
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{story.content}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors group">
                      <Heart className="w-4 h-4 group-hover:fill-current" />
                      <span className="font-medium">{story.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group">
                      <MessageCircle className="w-4 h-4 group-hover:fill-current" />
                      <span className="font-medium">{story.comments}</span>
                    </button>
                  </div>

                  {isTL && (
                    <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      {story.isPinned ? "Unpin" : "Pin to Top"}
                    </button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PageTemplate>
  );
}
