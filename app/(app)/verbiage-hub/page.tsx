"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { TagChip } from "@/components/ui/TagChip";
import { useRole } from "@/lib/RoleProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThumbsUp, Copy, CheckCircle2, Search, Plus, AlertCircle, Filter } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, doc, runTransaction, where } from "firebase/firestore";
import { Script } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddScriptModal } from "./AddScriptModal";
import toast from "react-hot-toast";
import Link from "next/link";

type SortTab = "Trending" | "Newest" | "Most Upvoted";

export default function VerbiageHub() {
  const { role } = useRole();
  const isTL = role === "tl" || role === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SortTab>("Trending");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useAuth();
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const q = query(collection(db, "scripts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedScripts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Script[];
        setScripts(fetchedScripts);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching scripts:", err);
        setError("Could not load scripts. Please check your connection.");
        setLoading(false);
      }
    );

    let unsubscribeVotes: () => void = () => {};

    if (profile) {
      const votesQuery = query(
        collection(db, "scriptVotes"),
        where("uid", "==", profile.uid)
      );
      unsubscribeVotes = onSnapshot(votesQuery,
        (snapshot) => {
          const votes = new Set<string>();
          snapshot.forEach((doc) => {
            votes.add(doc.data().scriptId);
          });
          setUserVotes(votes);
        },
        (err) => {
          console.error("Error fetching user votes:", err);
          toast.error("Could not sync your votes", { id: "votes-error" });
        }
      );
    }

    return () => {
      unsubscribe();
      unsubscribeVotes();
    };
  }, [profile]);

  const handleApprove = async (scriptId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isTL || !profile) return;

    try {
      await runTransaction(db, async (transaction) => {
        const sfDocRef = doc(db, "scripts", scriptId);
        transaction.update(sfDocRef, {
          approved: true,
          approvedBy: profile.uid
        });
      });
      toast.success("Script approved");
    } catch (error) {
      console.error("Error approving script:", error);
      toast.error("Failed to approve script");
    }
  };

  const handleUpvote = async (scriptId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) {
      toast.error("You must be logged in to vote");
      return;
    }

    const voteId = `${scriptId}_${profile.uid}`;
    const voteRef = doc(db, "scriptVotes", voteId);
    const scriptRef = doc(db, "scripts", scriptId);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(scriptRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        const voteDoc = await transaction.get(voteRef);

        if (voteDoc.exists()) {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) - 1;
          transaction.update(scriptRef, { upvoteCount: newUpvotes });
          transaction.delete(voteRef);
        } else {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) + 1;
          transaction.update(scriptRef, { upvoteCount: newUpvotes });
          transaction.set(voteRef, {
            scriptId,
            uid: profile.uid,
            createdAt: Date.now()
          });
        }
      });
      // Toggle toast based on existing client state (will be eventually consistent)
      if (userVotes.has(scriptId)) {
        toast.success("Vote removed");
      } else {
        toast.success("Script upvoted");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to process vote");
    }
  };

  const sortedAndFilteredScripts = useMemo(() => {
    const filtered = scripts.filter((s) => {
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (activeTab === "Newest") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (activeTab === "Most Upvoted") {
      filtered.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (activeTab === "Trending") {
      filtered.sort((a, b) => {
        if (b.upvoteCount !== a.upvoteCount) {
          return b.upvoteCount - a.upvoteCount;
        }
        return b.createdAt - a.createdAt;
      });
    }

    return filtered;
  }, [scripts, searchTerm, activeTab, selectedCategory]);

  return (
    <PageTemplate
      title="Verbiage Hub"
      description="Find, share, and upvote the best responses for tricky situations."
      action={
        <ThreeDButton onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Script
        </ThreeDButton>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search scripts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm appearance-none"
              >
                <option value="All Categories">All Categories</option>
                <option value="Greeting">Greeting</option>
                <option value="De-escalation">De-escalation</option>
                <option value="Closing">Closing</option>
                <option value="Policy">Policy</option>
                <option value="Apology">Apology</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex bg-muted/30 p-1 rounded-lg border border-border/50 w-full md:w-auto overflow-x-auto">
            {(["Trending", "Newest", "Most Upvoted"] as SortTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#7C5CFF]/20 text-white border border-[#7C5CFF]/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <EmptyState
            icon={AlertCircle}
            title="Connection Error"
            description={error}
          />
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : scripts.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No scripts found"
            description="Be the first to add a script!"
          />
        ) : sortedAndFilteredScripts.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No scripts match your search"
            description="Try adjusting your search terms."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAndFilteredScripts.map((script) => (
              <Link href={`/verbiage-hub/${script.id}`} key={script.id} className="block h-full">
              <GlassCard className="flex flex-col h-full gap-4 relative overflow-visible hoverEffect">
                {script.approved && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-green-500/20 text-green-500 rounded-full p-1.5 backdrop-blur-sm border border-green-500/30 shadow-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{script.title}</h3>
                  <TagChip label={script.category} variant="outline" className="shrink-0" />
                </div>

                <p className="text-muted-foreground text-sm flex-1 leading-relaxed">
                  &quot;{script.content}&quot;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {script.authorName?.charAt(0).toUpperCase() || "?"}
                    </span>
                    <span className="truncate max-w-[100px]">{script.authorName || "Unknown"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isTL && !script.approved && (
                      <button
                        onClick={(e) => handleApprove(script.id, e)}
                        className="text-xs text-green-500 hover:text-green-600 font-medium px-2 py-1 rounded hover:bg-green-500/10 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={(e) => handleUpvote(script.id, e)}
                      className={`p-1.5 rounded-md transition-colors flex items-center gap-1 ${
                        userVotes.has(script.id)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${userVotes.has(script.id) ? "fill-primary" : ""}`} />
                      <span className="text-xs font-medium">{script.upvoteCount || 0}</span>
                    </button>
                    <button
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(script.content);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>

      <AddScriptModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </PageTemplate>
  );
}
