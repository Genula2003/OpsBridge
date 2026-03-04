"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  History,
  MessageSquare,
  Calendar,
  Coffee,
  Award,
  Users,
  FolderOpen,
  FileText,
  ShieldAlert,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

const routes = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Verbiage Hub", path: "/verbiage-hub", icon: BookOpen },
  { name: "Shift Stories", path: "/shift-stories", icon: History },
  { name: "Culture Threads", path: "/culture-threads", icon: MessageSquare },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Break Buddy", path: "/break-buddy", icon: Coffee },
  { name: "Recognition", path: "/recognition", icon: Award },
  { name: "New Joiners", path: "/new-joiners", icon: Users },
  { name: "Resources", path: "/resources", icon: FolderOpen },
  { name: "Weekly Digest", path: "/weekly-digest", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const allRoutes = isAdmin
    ? [...routes, { name: "Admin", path: "/admin", icon: ShieldAlert }]
    : routes;

  const navContent = (
    <div className="flex flex-col h-full bg-[#0B0B10] border-r border-white/5 py-6">
      <div className="flex items-center justify-between px-6 mb-10">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7C5CFF] shadow-[0_0_20px_rgba(124,92,255,0.4)] flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none mt-[-2px]">O</span>
            </div>
            <span className="font-bold text-white tracking-widest uppercase text-sm">OpsBridge</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors hidden md:block"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
        {allRoutes.map((route) => {
          const active = pathname === route.path;
          return (
            <Link key={route.path} href={route.path}>
              <div
                className={cn(
                  "relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer",
                  active
                    ? "bg-[#7C5CFF]/10 text-white shadow-[inset_0_0_20px_rgba(124,92,255,0.05)]"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#7C5CFF] rounded-r-full shadow-[0_0_10px_#7C5CFF]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <route.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    active ? "text-[#7C5CFF] drop-shadow-[0_0_8px_rgba(124,92,255,0.8)]" : "group-hover:text-[#7C5CFF]/70"
                  )}
                />
                {!collapsed && (
                  <span className={cn("text-sm font-medium tracking-wide", active ? "font-bold" : "")}>
                    {route.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-[#7C5CFF] text-white rounded-full shadow-[0_0_30px_rgba(124,92,255,0.4)]"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:block h-screen z-40 relative shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)]"
      >
        {navContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 bg-[#0B0B10]/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      >
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: mobileOpen ? 0 : "-100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-64 h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {navContent}
        </motion.aside>
      </div>
    </>
  );
}
