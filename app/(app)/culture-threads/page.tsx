"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { threads, users } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { useRole } from "@/lib/RoleProvider";
import { MessageCircle, Eye, Lock, CheckCircle2, ChevronRight, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CultureThreads() {
  const { role } = useRole();
  const isTL = role === "tl" || role === "admin";

  return (
    <PageTemplate
      title="Culture Threads"
      description="Discuss operations, share feedback, and ask questions."
      action={
        <ThreeDButton>
          New Thread
        </ThreeDButton>
      }
    >
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex gap-4 text-sm font-medium">
            <button className="text-foreground border-b-2 border-primary pb-4 -mb-[17px]">Latest</button>
            <button className="text-muted-foreground hover:text-foreground transition-colors pb-4">Unresolved</button>
            <button className="text-muted-foreground hover:text-foreground transition-colors pb-4">My Threads</button>
          </div>
        </div>

        <div className="space-y-4">
          {threads.map((thread) => {
            const author = users.find((u) => u.id === thread.authorId);
            return (
              <GlassCard
                key={thread.id}
                className={cn(
                  "flex items-center gap-6 p-4 hover:bg-white/5 transition-colors cursor-pointer group",
                  thread.isResolved && "border-green-500/20 bg-green-500/5",
                  thread.isLocked && "opacity-80"
                )}
              >
                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                    {author?.name.charAt(0)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                      {thread.title}
                    </h3>
                    {thread.isResolved && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    )}
                    {thread.isLocked && (
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium">{author?.name}</span>
                    <span>•</span>
                    <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <div className="flex gap-1.5 overflow-hidden">
                      {thread.tags.map(tag => (
                        <span key={tag} className="bg-muted px-2 py-0.5 rounded text-xs truncate">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
                  <div className="flex flex-col items-center gap-0.5 w-12">
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span className="font-medium">{thread.replies}</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 w-12">
                    <Eye className="w-5 h-5 mb-1" />
                    <span className="font-medium">{thread.views}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-border group-hover:text-primary transition-colors" />
                </div>

                {isTL && (
                  <div className="absolute right-4 top-4 hidden group-hover:flex gap-2 bg-background/80 backdrop-blur rounded-lg p-1 border border-border shadow-sm z-10">
                    <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" title={thread.isLocked ? "Unlock" : "Lock"}>
                      {thread.isLocked ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                    {!thread.isResolved && (
                      <button className="p-1.5 hover:bg-green-500/20 rounded text-muted-foreground hover:text-green-500 transition-colors" title="Mark Resolved">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PageTemplate>
  );
}
