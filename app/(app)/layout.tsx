"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // In a real app we'd redirect if !user and !loading
    // For this milestone, we'll allow viewing the app without auth initially
    // so we can test the UI easily.
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0B0B10]">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-[#0B0B10] text-zinc-300 overflow-hidden font-sans selection:bg-[#7C5CFF] selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
           {/* Background Subtle Gradient for App Area */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#7C5CFF]/5 to-transparent pointer-events-none z-0" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
