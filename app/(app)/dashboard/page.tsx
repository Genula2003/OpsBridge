"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { MetricPill } from "@/components/ui/MetricPill";
import { AnimatedGradientLine } from "@/components/ui/AnimatedGradientLine";
import { FloatingOrb } from "@/components/ui/FloatingOrb";
import { Plus, FileText, Star, Award, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { profile, loading } = useAuth();
  const userName = profile?.name || "Agent";

  const actions = [
    { title: "Add Script", icon: Plus, color: "text-[#7C5CFF]" },
    { title: "Post Shift Story", icon: FileText, color: "text-[#7C5CFF]" },
    { title: "Send Recognition", icon: Star, color: "text-[#7C5CFF]" },
  ];

  return (
    <div className="max-w-7xl mx-auto font-sans relative">
      <FloatingOrb className="absolute top-0 right-0 w-96 h-96 opacity-10" />

      {/* Hero Area */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16 relative"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 flex items-center gap-4">
          Welcome back, {userName}.
        </h1>
        <AnimatedGradientLine className="w-1/3 mt-6 mb-2 h-[2px]" />
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-semibold">Command Center • Global Operations</p>
      </motion.section>

      {/* Primary Action Panels */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
        {actions.map((action, idx) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard hoverEffect className="flex flex-col items-center justify-center p-10 h-full group border border-white/5 hover:border-[#7C5CFF]/40">
              <div className="w-16 h-16 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(124,92,255,0.3)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <action.icon className={`w-8 h-8 ${action.color} drop-shadow-[0_0_10px_rgba(124,92,255,0.5)]`} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">{action.title}</h3>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      {/* Insight Strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16 relative z-10"
      >
        <div className="glass-panel rounded-3xl p-8 flex flex-wrap gap-8 justify-around items-center border border-[#7C5CFF]/20 shadow-[0_0_40px_rgba(124,92,255,0.05)] bg-gradient-to-r from-transparent via-[#7C5CFF]/5 to-transparent">
          <MetricPill label="Active Agents" value={142} />
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />
          <MetricPill label="New Scripts" value={28} />
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />
          <MetricPill label="Shift Stories" value={56} />
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />
          <MetricPill label="Recognitions" value={12} suffix="+" />
        </div>
      </motion.section>

      {/* Spotlight Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCard className="h-full border-t border-[#7C5CFF]/40 shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-[#0B0B10]">
            <div className="flex items-center gap-4 mb-8">
              <Award className="w-6 h-6 text-[#7C5CFF]" />
              <h2 className="text-sm uppercase tracking-widest text-zinc-400 font-bold">Top Script of the Week</h2>
            </div>
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
              <h3 className="text-xl text-white font-semibold mb-3">De-escalation Protocol Alpha</h3>
              <p className="text-zinc-500 mb-6 line-clamp-2">When a client expresses frustration regarding SLA timings, deploy this exact verbiage to reset expectations immediately while maintaining empathy...</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-600 uppercase tracking-widest">Author: JDoe_Ops</span>
                <ThreeDButton variant="secondary" className="px-4 py-2 text-xs">Deploy Script</ThreeDButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-panel h-full rounded-2xl p-8 bg-gradient-to-br from-[#1A102E] to-[#0B0B10] border border-white/10 shadow-[0_0_40px_rgba(124,92,255,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFF]/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-[#7C5CFF]/30 transition-colors duration-700" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                <Calendar className="w-6 h-6 text-[#7C5CFF]" />
                <h2 className="text-sm uppercase tracking-widest text-zinc-400 font-bold">Upcoming Deployment</h2>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-3xl text-white font-bold mb-4">Q3 Ops All-Hands</h3>
                <p className="text-zinc-400 mb-8">Global sync on new SOPs, platform updates, and team recognition.</p>
                <div className="flex items-center gap-6 mt-auto">
                  <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-[#111118] border-2 border-[#1A102E] flex items-center justify-center text-xs font-bold text-[#7C5CFF]">
                        A{i}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-[#7C5CFF]/20 border-2 border-[#1A102E] flex items-center justify-center text-xs font-bold text-white backdrop-blur-sm">
                      +42
                    </div>
                  </div>
                  <ThreeDButton className="ml-auto text-xs px-6 py-2">RSVP Confirmed</ThreeDButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
