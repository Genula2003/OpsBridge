"use client";

import { useTheme } from "next-themes";
import { useRole, Role } from "@/lib/RoleProvider";
import { Moon, Sun, Menu, Search, Command, LayoutDashboard, BookOpen, MessageSquare, Users, Calendar, Coffee, Award, UserPlus, Folder, FileText, Settings, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const { role, setRole } = useRole();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    // defer to next tick
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-4 lg:gap-8">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Action Search Bar Placeholder */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="group flex max-w-sm flex-1 items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search anything...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 border-r border-border pr-4">
            <span className="text-xs font-medium text-muted-foreground">Dev Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="rounded-md border-border bg-background px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="user">User</option>
              <option value="mentor">Mentor</option>
              <option value="tl">Team Lead</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            OB
          </div>
        </div>
      </header>

      {/* Mock Command Palette Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-xl overflow-hidden rounded-xl bg-card border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-border p-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setIsSearchOpen(false)} className="rounded p-1 text-xs border border-border bg-muted hover:bg-background transition-colors">
                  ESC
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {(!searchQuery || "add script".includes(searchQuery.toLowerCase()) || "post shift story".includes(searchQuery.toLowerCase()) || "create event".includes(searchQuery.toLowerCase()) || "send shoutout".includes(searchQuery.toLowerCase()) || "start break match".includes(searchQuery.toLowerCase())) && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Actions</div>
                    <button onClick={() => { setIsSearchOpen(false); setActiveModal('add_script'); }} className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-sm hover:bg-muted hover:text-foreground text-left transition-colors">
                      <Command className="h-4 w-4" /> Add Script
                    </button>
                    <button onClick={() => { setIsSearchOpen(false); setActiveModal('post_story'); }} className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-sm hover:bg-muted hover:text-foreground text-left transition-colors">
                      <Command className="h-4 w-4" /> Post Shift Story
                    </button>
                    <button onClick={() => { setIsSearchOpen(false); setActiveModal('create_event'); }} className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-sm hover:bg-muted hover:text-foreground text-left transition-colors">
                      <Calendar className="h-4 w-4" /> Create Event
                    </button>
                    <button onClick={() => { setIsSearchOpen(false); setActiveModal('send_shoutout'); }} className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-sm hover:bg-muted hover:text-foreground text-left transition-colors">
                      <Award className="h-4 w-4" /> Send Shoutout
                    </button>
                    <button onClick={() => { setIsSearchOpen(false); setActiveModal('start_break_match'); }} className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-sm hover:bg-muted hover:text-foreground text-left transition-colors">
                      <Coffee className="h-4 w-4" /> Start Break Match
                    </button>
                  </>
                )}

                {(!searchQuery || "dashboard verbiage hub shift stories culture threads events break buddy recognition new joiners resources weekly digest admin".includes(searchQuery.toLowerCase())) && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-4">Navigation</div>
                    {[
                      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
                      { name: 'Verbiage Hub', path: '/verbiage-hub', icon: BookOpen },
                      { name: 'Shift Stories', path: '/shift-stories', icon: MessageSquare },
                      { name: 'Culture Threads', path: '/culture-threads', icon: Users },
                      { name: 'Events', path: '/events', icon: Calendar },
                      { name: 'Break Buddy', path: '/break-buddy', icon: Coffee },
                      { name: 'Recognition', path: '/recognition', icon: Award },
                      { name: 'New Joiners', path: '/new-joiners', icon: UserPlus },
                      { name: 'Resources', path: '/resources', icon: Folder },
                      { name: 'Weekly Digest', path: '/weekly-digest', icon: FileText },
                      { name: 'Admin', path: '/admin', icon: Settings },
                    ].filter(route => !searchQuery || route.name.toLowerCase().includes(searchQuery.toLowerCase())).map(route => {
                      // Hide Admin from non-admin roles in search results
                      if (route.name === 'Admin' && role !== 'admin') return null;
                      return (
                        <button key={route.path} onClick={() => { setIsSearchOpen(false); router.push(route.path); }} className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-sm hover:bg-muted hover:text-foreground text-left transition-colors">
                          <route.icon className="h-4 w-4" /> {route.name}
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mock Action Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md overflow-hidden rounded-xl bg-card border border-border shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {activeModal === 'add_script' && 'Add Verbiage Script'}
                  {activeModal === 'post_story' && 'Post a Shift Story'}
                  {activeModal === 'create_event' && 'Create Event'}
                  {activeModal === 'send_shoutout' && 'Send Shoutout'}
                  {activeModal === 'start_break_match' && 'Start Break Match'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded-md text-muted-foreground hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This is a placeholder modal for the action. In a real application, a form would be presented here.
                </p>
                <div className="h-32 rounded-md bg-muted/50 border border-dashed border-border flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Form goes here</span>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => {
                    // Simulate action success
                    alert(`Action completed: ${activeModal}`);
                    setActiveModal(null);
                  }} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
