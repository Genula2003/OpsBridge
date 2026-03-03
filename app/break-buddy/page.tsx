"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { breakRequests, users } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { TagChip } from "@/components/ui/TagChip";
import { Coffee, Clock, UserPlus, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function BreakBuddy() {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <PageTemplate
      title="Break Buddy"
      description="Connect with colleagues during your downtime."
      action={
        <ThreeDButton>
          <Coffee className="w-4 h-4 mr-2" /> Request Break
        </ThreeDButton>
      }
    >
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "active" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Active Requests
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "history" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Match History
          </button>
        </div>

        <div className="space-y-4">
          {breakRequests.filter(req =>
            activeTab === "active" ? req.status !== "completed" : req.status === "completed"
          ).map((request) => {
            const requester = users.find((u) => u.id === request.userId);
            const matcher = users.find((u) => u.id === request.matchedWith);

            return (
              <GlassCard key={request.id} className="flex flex-col sm:flex-row gap-6 p-6 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center font-bold text-xl text-primary border border-primary/20 shadow-sm">
                      {requester?.name.charAt(0)}
                    </div>
                    {request.status === "matched" && matcher && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center font-bold text-sm text-green-500 border border-background shadow-sm">
                        {matcher.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{requester?.name}</h3>
                    <p className="text-sm text-muted-foreground">{request.activity}</p>
                    {request.status === "matched" && matcher && (
                      <p className="text-xs font-medium text-green-500 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Matched with {matcher.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary/70" />
                    <span>{request.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium bg-muted/50 px-2 py-1 rounded">
                    {request.duration} min
                  </div>
                  {request.status === "active" ? (
                    <ThreeDButton size="sm" variant="secondary" className="ml-auto sm:ml-0">
                      <UserPlus className="w-4 h-4 mr-1.5" /> Join
                    </ThreeDButton>
                  ) : (
                    <TagChip label={request.status.charAt(0).toUpperCase() + request.status.slice(1)} variant={request.status === 'completed' ? 'outline' : 'success'} className="ml-auto sm:ml-0" />
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
