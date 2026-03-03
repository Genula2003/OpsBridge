"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRole } from "@/lib/RoleProvider";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Calendar,
  Coffee,
  Award,
  Users,
  FolderOpen,
  Mail,
  Shield,
  Menu,
} from "lucide-react";

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const routes = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/verbiage-hub", label: "Verbiage Hub", icon: BookOpen },
  { path: "/shift-stories", label: "Shift Stories", icon: MessageSquare },
  { path: "/culture-threads", label: "Culture Threads", icon: Users },
  { path: "/events", label: "Events", icon: Calendar },
  { path: "/break-buddy", label: "Break Buddy", icon: Coffee },
  { path: "/recognition", label: "Recognition", icon: Award },
  { path: "/new-joiners", label: "New Joiners", icon: Users },
  { path: "/resources", label: "Resources", icon: FolderOpen },
  { path: "/weekly-digest", label: "Weekly Digest", icon: Mail },
];

export function Sidebar({ isMobileOpen, setMobileOpen, isCollapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useRole();

  const allRoutes = [...routes];
  if (role === "admin") {
    allRoutes.push({ path: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "5rem" : "16rem",
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card/50 backdrop-blur-xl transition-[transform,width] duration-300 ease-in-out lg:static lg:h-screen",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center px-4 gap-3 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary transition-all">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <span className="text-sm font-black">OB</span>
            </div>
            {!isCollapsed && <span className="truncate">OpsBridge</span>}
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => setCollapsed(!isCollapsed)}
              className="ml-auto hidden lg:flex p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => setCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 mx-auto text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto overflow-x-hidden">
          {allRoutes.map((route) => {
            const isActive = pathname === route.path;
            const Icon = route.icon;

            return (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-primary/5",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
                title={isCollapsed ? route.label : undefined}
              >
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                {!isCollapsed && <span className="truncate">{route.label}</span>}

                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 z-[-1] rounded-xl bg-primary/10 dark:bg-primary/15 border border-primary/20"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
