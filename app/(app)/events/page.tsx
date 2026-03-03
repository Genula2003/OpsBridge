"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { events, users } from "@/lib/mock/data";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { TagChip } from "@/components/ui/TagChip";
import { Calendar as CalendarIcon, MapPin, Users, Plus } from "lucide-react";

export default function Events() {
  return (
    <PageTemplate
      title="Events"
      description="Join upcoming team building, training, and social events."
      action={
        <ThreeDButton>
          <Plus className="w-4 h-4 mr-2" /> Create Event
        </ThreeDButton>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const organizer = users.find((u) => u.id === event.organizerId);
          const date = new Date(event.date);

          return (
            <GlassCard key={event.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <TagChip
                  label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  variant={event.type === 'social' ? 'success' : event.type === 'training' ? 'warning' : 'default'}
                />
                <div className="flex flex-col items-center bg-muted/50 rounded-lg p-2 min-w-[3.5rem]">
                  <span className="text-xs font-semibold text-primary uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-xl font-bold">{date.getDate()}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-6">
                {event.description}
              </p>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {organizer?.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[120px]">by {organizer?.name}</span>
                </div>
                <ThreeDButton variant="secondary" size="sm">
                  RSVP
                </ThreeDButton>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </PageTemplate>
  );
}
