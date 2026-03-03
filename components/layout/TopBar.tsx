"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { auth } from "@/lib/firebase/config";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const { profile } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-20 bg-[#0B0B10]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      {/* Search Bar (Kokonut Style) */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#111118] border border-white/10 hover:border-[#7C5CFF]/30 text-zinc-500 hover:text-white transition-all duration-300 w-64 md:w-96 shadow-[0_0_15px_rgba(0,0,0,0.2)] group"
      >
        <Search className="w-4 h-4 group-hover:text-[#7C5CFF] transition-colors" />
        <span className="text-sm font-medium tracking-wide">Search operations...</span>
        <kbd className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-500 shadow-inner group-hover:border-[#7C5CFF]/20 group-hover:text-[#7C5CFF]">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-zinc-500 hover:text-white transition-colors group">
          <Bell className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#7C5CFF] rounded-full shadow-[0_0_10px_#7C5CFF] ring-2 ring-[#0B0B10]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full border border-white/10 hover:border-[#7C5CFF]/30 hover:bg-white/5 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#4B30B0] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(124,92,255,0.4)] ring-2 ring-[#0B0B10]">
              {profile?.name?.charAt(0) || "A"}
            </div>
            <span className="text-sm font-semibold tracking-wide hidden md:block">{profile?.name || "Agent"}</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 hidden md:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 mt-3 w-56 bg-[#111118] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 py-2"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                  <p className="text-sm font-bold text-white">{profile?.name || "Agent"}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Role: <span className="text-[#7C5CFF] font-semibold">{profile?.role || "user"}</span></p>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <Settings className="w-4 h-4" /> Preferences
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Secure Disconnect
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Command Palette Modal (Simplified for UI Shell) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B0B10]/80 backdrop-blur-md z-50 flex items-start justify-center pt-[15vh]"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#111118] w-full max-w-2xl rounded-2xl shadow-[0_0_50px_rgba(124,92,255,0.15)] border border-[#7C5CFF]/20 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center px-6 py-4 border-b border-white/5">
                <Search className="w-5 h-5 text-[#7C5CFF]" />
                <input
                  type="text"
                  placeholder="Execute command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-zinc-500 px-4 py-2 font-medium tracking-wide"
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-500">
                  ESC
                </kbd>
              </div>
              <div className="max-h-96 overflow-y-auto p-4 py-6 space-y-4">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-4 mb-2">Suggested Actions</div>
                {['Navigate to Verbiage Hub', 'Create New Shift Story', 'Recognize Teammate', 'View Upcoming Events'].map((action, i) => (
                  <div key={i} className="px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 cursor-pointer group transition-all duration-300">
                    <div className="w-8 h-8 rounded-lg bg-[#7C5CFF]/10 flex items-center justify-center group-hover:bg-[#7C5CFF]/20 transition-colors">
                      <Search className="w-4 h-4 text-[#7C5CFF]" />
                    </div>
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white tracking-wide">{action}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
