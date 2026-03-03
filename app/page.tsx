"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { MetricPill } from "@/components/ui/MetricPill";
import { ActionCard } from "@/components/ui/ActionCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, BookOpen, MessageSquare, Award, Plus, Calendar } from "lucide-react";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { weeklyDigest } from "@/lib/mock/data";

export default function Dashboard() {
  return (
    <PageTemplate
      title="Welcome back!"
      description="Here's what's happening in OpsBridge today."
      action={
        <ThreeDButton>
          <Plus className="w-4 h-4 mr-2" /> New Request
        </ThreeDButton>
      }
    >
      <div className="flex flex-col gap-8">
        {/* Metrics Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricPill
            title="Active Agents"
            value={42}
            icon={Users}
            trend={{ value: "12%", isPositive: true }}
          />
          <MetricPill
            title="New Scripts"
            value={15}
            icon={BookOpen}
            trend={{ value: "5%", isPositive: true }}
          />
          <MetricPill
            title="Shift Stories"
            value={89}
            icon={MessageSquare}
            trend={{ value: "24%", isPositive: true }}
          />
          <MetricPill
            title="Recognitions"
            value={124}
            icon={Award}
            trend={{ value: "8%", isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Add Verbiage Script"
            description="Contribute a new response script for the team."
            icon={BookOpen}
          />
          <ActionCard
            title="Post a Shift Story"
            description="Share an interesting interaction or win from your shift."
            icon={MessageSquare}
          />
          <ActionCard
            title="Send Recognition"
            description="Shoutout a teammate for their hard work."
            icon={Award}
          />
        </div>

        {/* Weekly Digest Highlight */}
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard hoverEffect className="flex flex-col gap-4 border-primary/20 bg-primary/5 dark:bg-primary/10">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Award className="w-5 h-5" />
              Top Script of the Week
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">{weeklyDigest.topScript.title}</h3>
              <p className="text-muted-foreground mt-2 line-clamp-2">
                {weeklyDigest.topScript.content}
              </p>
            </div>
          </GlassCard>

          <GlassCard hoverEffect className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-purple-500 font-semibold">
              <Calendar className="w-5 h-5" />
              Upcoming Event
            </div>
            <div>
              <h3 className="text-lg font-medium">{weeklyDigest.upcomingEvents[0].title}</h3>
              <p className="text-muted-foreground mt-2">
                {new Date(weeklyDigest.upcomingEvents[0].date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {weeklyDigest.upcomingEvents[0].location}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTemplate>
  );
}
