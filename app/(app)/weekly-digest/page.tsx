"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { weeklyDigest } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { Mail, Star, Users, Calendar, MessageSquare, ExternalLink, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function WeeklyDigest() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000); // Simulate API call
  };

  return (
    <PageTemplate
      title="Weekly Digest"
      description="Your weekly summary of top scripts, new joiners, and upcoming events."
      action={
        <ThreeDButton onClick={handleGenerate} disabled={isGenerating}>
          <RefreshCcw className={cn("w-4 h-4 mr-2", isGenerating && "animate-spin")} />
          {isGenerating ? "Generating..." : "Generate Next Week's"}
        </ThreeDButton>
      }
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
        <div className="bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply z-0 pointer-events-none" />
          <div className="absolute -inset-1/2 bg-gradient-to-br from-white/10 to-transparent blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-background/80 backdrop-blur-md rounded-2xl flex items-center justify-center border border-border/50 shadow-inner shrink-0 rotate-3 hover:rotate-0 transition-transform duration-300">
                <Mail className="w-10 h-10 text-primary drop-shadow-md" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2 tracking-tight">
                  Digest: Week 42
                </h2>
                <p className="text-muted-foreground text-lg font-medium">October 16th - October 22nd, 2023</p>
              </div>
            </div>
            <div className="text-center bg-background/40 backdrop-blur-sm rounded-xl px-6 py-4 border border-border/30 w-full md:w-auto hover:bg-background/60 transition-colors cursor-default shadow-sm">
              <span className="block text-4xl font-black text-foreground drop-shadow-sm tracking-tighter">98%</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Read Rate</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard className="flex flex-col gap-5 hover:border-primary/40 transition-colors duration-300 group">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <div className="p-2.5 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold flex-1 text-foreground/90 group-hover:text-foreground transition-colors">Top Script</h3>
            </div>
            <div className="flex-1 bg-muted/20 p-5 rounded-xl border border-border/50 hover:bg-muted/40 transition-colors">
              <h4 className="font-bold text-lg mb-3 line-clamp-1">{weeklyDigest.topScript.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed italic border-l-2 border-primary/50 pl-3 line-clamp-3">
                &quot;{weeklyDigest.topScript.content}&quot;
              </p>
            </div>
            <Link href="/verbiage-hub" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 w-fit mt-auto group/link">
              View in Hub <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </GlassCard>

          <GlassCard className="flex flex-col gap-5 hover:border-purple-500/40 transition-colors duration-300 group">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <div className="p-2.5 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold flex-1 text-foreground/90 group-hover:text-foreground transition-colors">Upcoming Events</h3>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              {weeklyDigest.upcomingEvents.map((event) => (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-4 rounded-xl border border-border/50 hover:bg-muted/40 transition-colors group/event relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 to-transparent opacity-0 group-hover/event:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-start gap-4 z-10">
                    <div className="flex flex-col items-center justify-center bg-background rounded-lg p-2 min-w-[3.5rem] shadow-sm border border-border/50">
                      <span className="text-[10px] font-bold text-purple-500 uppercase leading-none mb-1">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-xl font-black leading-none">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 group-hover/event:text-purple-400 transition-colors">{event.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
             <Link href="/events" className="text-sm font-medium text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-1.5 w-fit mt-auto group/link">
              View Calendar <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </GlassCard>

          <GlassCard className="flex flex-col gap-5 hover:border-green-500/40 transition-colors duration-300 group">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <div className="p-2.5 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold flex-1 text-foreground/90 group-hover:text-foreground transition-colors">New Joiners</h3>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              {weeklyDigest.newJoiners.map((user) => (
                <div key={user.id} className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border/50 hover:bg-muted/40 transition-colors group/user">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold text-xl text-white shadow-md ring-2 ring-background group-hover/user:ring-green-500/30 transition-all duration-300">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg truncate group-hover/user:text-green-500 transition-colors">{user.name}</h4>
                    <p className="text-sm text-muted-foreground font-medium truncate">{user.department} • {user.title}</p>
                  </div>
                </div>
              ))}
            </div>
             <Link href="/new-joiners" className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors flex items-center gap-1.5 w-fit mt-auto group/link">
              Say Hello <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </GlassCard>

          <GlassCard className="flex flex-col gap-5 hover:border-blue-500/40 transition-colors duration-300 group">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <div className="p-2.5 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold flex-1 text-foreground/90 group-hover:text-foreground transition-colors">Top Thread</h3>
            </div>
             <div className="flex-1 bg-muted/20 p-5 rounded-xl border border-border/50 hover:bg-muted/40 transition-colors flex flex-col">
              <h4 className="font-bold text-lg mb-3 line-clamp-2 leading-tight">{weeklyDigest.topThread.title}</h4>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                {weeklyDigest.topThread.content}
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground mt-auto bg-background/50 p-2.5 rounded-lg border border-border/30 w-fit">
                <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-blue-500/70" /> {weeklyDigest.topThread.replies} Replies</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500/70" /> {weeklyDigest.topThread.views} Views</span>
              </div>
            </div>
             <Link href="/culture-threads" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1.5 w-fit mt-auto group/link">
              Join Discussion <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </GlassCard>
        </div>
      </div>
    </PageTemplate>
  );
}
