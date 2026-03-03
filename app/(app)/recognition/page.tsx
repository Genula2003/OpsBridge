"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { recognitions, users } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { TagChip } from "@/components/ui/TagChip";
import { Award, Heart, Gift, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Recognition() {
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <PageTemplate
      title="Recognition"
      description="Celebrate the amazing work happening across the team."
      action={
        <ThreeDButton>
          <Gift className="w-4 h-4 mr-2" /> Send Shoutout
        </ThreeDButton>
      }
    >
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <GlassCard className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 shadow-lg shrink-0">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-2xl">
                  {users[0].name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" /> MVP of the Month
                </h3>
                <p className="text-muted-foreground mt-1 text-lg">{users[0].name} • {users[0].title}</p>
                <div className="flex gap-2 mt-2">
                  <TagChip label="Excellence" variant="success" />
                  <TagChip label="Leadership" variant="outline" />
                </div>
              </div>
            </div>
            <div className="text-center bg-background/50 backdrop-blur rounded-xl p-4 border border-border shadow-sm">
              <span className="block text-3xl font-black text-primary">24</span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Shoutouts</span>
            </div>
          </div>
        </GlassCard>

        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("recent")}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === "recent" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            Recent Shoutouts
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === "leaderboard" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            Leaderboard
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recognitions.map((recognition) => {
            const sender = users.find((u) => u.id === recognition.fromId);
            const receiver = users.find((u) => u.id === recognition.toId);
            const date = new Date(recognition.createdAt);

            return (
              <GlassCard key={recognition.id} className="flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors -z-10" />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center font-bold text-lg text-primary border border-primary/20 shadow-sm z-10">
                        {receiver?.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold border border-background shadow-sm z-20">
                        {sender?.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{receiver?.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        from <span className="font-medium text-foreground">{sender?.name}</span> • {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <TagChip
                    label={recognition.category}
                    variant={recognition.category === 'Excellence' ? 'warning' : recognition.category === 'Teamwork' ? 'success' : 'default'}
                    className="shrink-0"
                  />
                </div>

                <div className="bg-muted/30 rounded-lg p-4 flex-1">
                  <p className="text-muted-foreground leading-relaxed italic relative">
                    <span className="text-3xl font-serif text-muted-foreground/30 absolute -top-2 -left-2">&quot;</span>
                    <span className="relative z-10 pl-4 block">{recognition.message}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors group/btn">
                    <Heart className="w-5 h-5 group-hover/btn:fill-current" />
                    <span className="font-medium">{recognition.likes}</span>
                  </button>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Echo
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PageTemplate>
  );
}
