"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FloatingOrb } from "@/components/ui/FloatingOrb";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-[#0B0B10] text-zinc-300 overflow-hidden font-sans selection:bg-[#7C5CFF] selection:text-white">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[#7C5CFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-[#7C5CFF]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 leading-tight">
            Where Operations <br className="hidden md:block" />
            <span className="relative inline-block pb-2">
              Meet Excellence.
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7C5CFF] to-transparent origin-left"
              />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium tracking-wide mb-12 uppercase letter-spacing-2">
            Hybrid Knowledge & Culture Platform • Since 2026
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/login">
              <button className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#7C5CFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Enter Command Center <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-2 text-zinc-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

        <FloatingOrb className="absolute right-1/4 top-1/3 w-64 h-64 opacity-30" />
      </section>

      {/* Scroll Narrative Sections */}
      <section className="relative py-32 px-4 border-t border-white/5 z-10" style={{ perspective: "1200px" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y1 }} className="order-2 md:order-1">
            <div className="glass-panel rounded-3xl p-8 md:p-12 hover:-translate-y-2 hover:rotate-x-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_0_40px_rgba(124,92,255,0.1)] hover:shadow-[0_0_60px_rgba(124,92,255,0.2)]">
              <div className="w-12 h-12 rounded-full bg-[#7C5CFF]/20 flex items-center justify-center mb-6">
                <div className="w-4 h-4 bg-[#7C5CFF] rounded-full shadow-[0_0_20px_#7C5CFF]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Unified Knowledge Base</h2>
              <p className="text-zinc-400 leading-relaxed">
                Centralize your operations with the Verbiage Hub. Instantly access, upvote, and deploy approved scripts with zero friction. Built for speed and accuracy.
              </p>
            </div>
          </motion.div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">What OpsBridge Does</h2>
            <p className="text-xl text-zinc-400 mb-8">
              We bridge the gap between static documentation and dynamic team culture. A single pane of glass for everything your team needs to excel.
            </p>
          </div>
        </div>
      </section>

      {/* Core Modules Showcase */}
      <section className="relative py-32 px-4 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Core Modules</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Purpose-built tools to elevate operational standards and team connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Shift Stories", desc: "Share wins, challenges, and insights from the frontlines." },
              { title: "Culture Threads", desc: "Engage in meaningful discussions and team building." },
              { title: "Recognition", desc: "Celebrate top performers and boost team morale." },
              { title: "Events", desc: "Stay updated on team gatherings and important dates." },
            ].map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass-panel rounded-2xl p-6 group hover:-translate-y-2 hover:border-[#7C5CFF]/50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_0_30px_rgba(124,92,255,0.15)]"
              >
                <div className="h-2 w-12 bg-white/10 rounded-full mb-6 group-hover:bg-[#7C5CFF]/50 transition-colors" />
                <h3 className="text-xl font-semibold text-white mb-3">{mod.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="relative py-24 px-4 border-y border-white/5 bg-[#111118]/50 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center">
          {[
            { label: "Active Agents", value: "2,400+" },
            { label: "Scripts Served", value: "1.2M" },
            { label: "Uptime", value: "99.99%" },
          ].map((stat, i) => (
            <div key={i} className="flex-1">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(124,92,255,0.3)]">{stat.value}</div>
              <div className="text-sm uppercase tracking-widest text-zinc-500 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="relative py-32 px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white mb-8">Ready to elevate your ops?</h2>
          <Link href="/login">
            <button className="px-10 py-5 bg-[#7C5CFF] rounded-full text-white font-bold text-lg hover:bg-[#6A4BE5] hover:shadow-[0_0_40px_rgba(124,92,255,0.4)] hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
              Access the Network
            </button>
          </Link>
        </motion.div>
      </footer>
    </div>
  );
}
