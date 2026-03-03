"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { users } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { UserPlus, Calendar, Briefcase, Mail, MessageSquare } from "lucide-react";
import { useRole } from "@/lib/RoleProvider";

export default function NewJoiners() {
  const { role } = useRole();
  const isTL = role === "tl" || role === "admin";

  // Simulate new joiners by taking the last two users
  const newJoiners = users.slice(-2);

  return (
    <PageTemplate
      title="New Joiners"
      description="Welcome our newest team members and help them get settled."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newJoiners.map((user) => (
          <GlassCard key={user.id} className="flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 z-0 group-hover:h-32 transition-all duration-300 ease-in-out" />

            <div className="relative z-10 flex flex-col items-center pt-8 pb-4">
              <div className="w-24 h-24 rounded-full bg-background p-1 shadow-xl mb-4 relative ring-4 ring-background">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center font-bold text-4xl text-primary border border-primary/20">
                  {user.name.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-background" />
              </div>

              <h3 className="text-2xl font-bold text-center">{user.name}</h3>
              <p className="text-primary font-medium mt-1">{user.title}</p>
            </div>

            <div className="space-y-3 px-6 pb-6 flex-1 mt-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
                <Briefcase className="w-4 h-4 shrink-0 text-foreground/70" />
                <span className="truncate">{user.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
                <Calendar className="w-4 h-4 shrink-0 text-foreground/70" />
                <span>Started this week</span>
              </div>
            </div>

            <div className="px-6 pt-4 pb-6 border-t border-border mt-auto flex flex-col gap-3">
              <div className="flex gap-2">
                <ThreeDButton className="flex-1" variant="secondary" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" /> Say Hi
                </ThreeDButton>
                <ThreeDButton variant="ghost" size="sm" className="px-3 border border-border bg-background hover:bg-muted">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </ThreeDButton>
              </div>
              {isTL && (
                <button className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20 border-dashed">
                  <UserPlus className="w-4 h-4" /> Assign Buddy
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </PageTemplate>
  );
}
