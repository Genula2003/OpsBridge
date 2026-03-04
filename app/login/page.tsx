"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { createUserProfile } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { FloatingOrb } from "@/components/ui/FloatingOrb";
import { AnimatedGradientLine } from "@/components/ui/AnimatedGradientLine";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(cred.user, "user"); // Default mock role
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to authenticate.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B10] flex items-center justify-center relative overflow-hidden font-sans">
      <FloatingOrb className="absolute -top-32 -left-32 w-96 h-96 opacity-30" />
      <FloatingOrb className="absolute -bottom-32 -right-32 w-96 h-96 opacity-20" />

      <GlassCard className="w-full max-w-md z-10 p-8 shadow-[0_0_50px_rgba(124,92,255,0.15)] border border-[#7C5CFF]/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">OpsBridge</h1>
          <AnimatedGradientLine className="mx-auto w-1/2 mb-4" />
          <p className="text-sm text-zinc-400 font-medium uppercase tracking-widest">Command Center Access</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">Protocol Identifier (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C5CFF]/50 focus:shadow-[0_0_15px_rgba(124,92,255,0.2)] transition-all duration-300"
              placeholder="agent@opsbridge.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">Access Key (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C5CFF]/50 focus:shadow-[0_0_15px_rgba(124,92,255,0.2)] transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

          <ThreeDButton className="w-full py-4 text-base tracking-wide" variant="primary">
            {isRegistering ? "Initialize Credentials" : "Authorize Access"}
          </ThreeDButton>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
          >
            {isRegistering ? "Return to Authorization" : "Request New Credentials"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
