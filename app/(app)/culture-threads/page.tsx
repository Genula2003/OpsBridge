"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { TagChip } from "@/components/ui/TagChip";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThumbsUp, Search, Plus, AlertCircle, Filter } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, doc, runTransaction, where } from "firebase/firestore";
import { Thread } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddThreadModal } from "./AddThreadModal";
import toast from "react-hot-toast";
import Link from "next/link";

type SortTab = "Newest" | "Most Upvoted";

export default function CultureThreads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SortTab>("Newest");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useAuth();
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedThreads = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Thread[];
        setThreads(fetchedThreads);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching threads:", err);
        setError("Could not load threads. Please check your connection.");
        setLoading(false);
      }
    );

    let unsubscribeVotes: () => void = () => {};

    if (profile) {
      const votesQuery = query(
        collection(db, "threadVotes"),
        where("uid", "==", profile.uid)
      );
      unsubscribeVotes = onSnapshot(votesQuery,
        (snapshot) => {
          const votes = new Set<string>();
          snapshot.forEach((doc) => {
            votes.add(doc.data().threadId);
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

  const handleUpvote = async (threadId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) {
      toast.error("You must be logged in to vote");
      return;
    }

    const voteId = `${threadId}_${profile.uid}`;
    const voteRef = doc(db, "threadVotes", voteId);
    const threadRef = doc(db, "threads", threadId);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(threadRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        const voteDoc = await transaction.get(voteRef);

        if (voteDoc.exists()) {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) - 1;
          transaction.update(threadRef, { upvoteCount: newUpvotes });
          transaction.delete(voteRef);
        } else {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) + 1;
          transaction.update(threadRef, { upvoteCount: newUpvotes });
          transaction.set(voteRef, {
            threadId,
            uid: profile.uid,
            createdAt: Date.now()
          });
        }
      });
      if (userVotes.has(threadId)) {
        toast.success("Vote removed");
      } else {
        toast.success("Thread upvoted");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to process vote");
    }
  };

  const sortedAndFilteredThreads = useMemo(() => {
    const filtered = threads.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.body.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (activeTab === "Newest") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (activeTab === "Most Upvoted") {
      filtered.sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0));
    }

    return filtered;
  }, [threads, searchTerm, activeTab, selectedCategory]);

  return (
    <PageTemplate
      title="Culture Threads"
      description="Engage in meaningful discussions and team building."
      action={
        <ThreeDButton onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Create Thread
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
                placeholder="Search threads..."
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
                <option value="discussion">Discussion</option>
                <option value="question">Question</option>
                <option value="announcement">Announcement</option>
                <option value="fun">Fun</option>
              </select>
            </div>
          </div>

          <div className="flex bg-muted/30 p-1 rounded-lg border border-border/50 w-full md:w-auto overflow-x-auto">
            {(["Newest", "Most Upvoted"] as SortTab[]).map((tab) => (
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
        ) : threads.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No threads yet"
            description="Start a new discussion with your team!"
          />
        ) : sortedAndFilteredThreads.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No threads match your search"
            description="Try adjusting your search terms or filters."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAndFilteredThreads.map((thread) => (
              <Link href={`/culture-threads/${thread.id}`} key={thread.id} className="block h-full">
              <GlassCard className="flex flex-col h-full gap-4 relative overflow-visible hoverEffect">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{thread.title}</h3>
                  <TagChip label={thread.category} variant="default" className="shrink-0" />
                </div>

                <p className="text-muted-foreground text-sm flex-1 leading-relaxed line-clamp-3">
                  {thread.body}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {thread.authorName?.charAt(0).toUpperCase() || "?"}
                    </span>
                    <span className="truncate max-w-[100px]">{thread.authorName || "Unknown"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => handleUpvote(thread.id, e)}
                      className={`p-1.5 rounded-md transition-colors flex items-center gap-1 ${
                        userVotes.has(thread.id)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${userVotes.has(thread.id) ? "fill-primary" : ""}`} />
                      <span className="text-xs font-medium">{thread.upvoteCount || 0}</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>

      <AddThreadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </PageTemplate>
  );
}
