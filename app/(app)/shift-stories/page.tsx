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
import { Story } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddStoryModal } from "./AddStoryModal";
import toast from "react-hot-toast";
import Link from "next/link";

type SortTab = "Newest" | "Most Upvoted";

export default function ShiftStories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SortTab>("Newest");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useAuth();
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  // Derive unique tags from stories
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    stories.forEach(s => s.tags?.forEach(t => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, [stories]);

  useEffect(() => {
    const q = query(collection(db, "shiftStories"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedStories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Story[];
        setStories(fetchedStories);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching stories:", err);
        setError("Could not load stories. Please check your connection.");
        setLoading(false);
      }
    );

    let unsubscribeVotes: () => void = () => {};

    if (profile) {
      const votesQuery = query(
        collection(db, "shiftStoryVotes"),
        where("uid", "==", profile.uid)
      );
      unsubscribeVotes = onSnapshot(votesQuery,
        (snapshot) => {
          const votes = new Set<string>();
          snapshot.forEach((doc) => {
            votes.add(doc.data().storyId);
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

  const handleUpvote = async (storyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) {
      toast.error("You must be logged in to vote");
      return;
    }

    const voteId = `${storyId}_${profile.uid}`;
    const voteRef = doc(db, "shiftStoryVotes", voteId);
    const storyRef = doc(db, "shiftStories", storyId);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(storyRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        const voteDoc = await transaction.get(voteRef);

        if (voteDoc.exists()) {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) - 1;
          transaction.update(storyRef, { upvoteCount: newUpvotes });
          transaction.delete(voteRef);
        } else {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) + 1;
          transaction.update(storyRef, { upvoteCount: newUpvotes });
          transaction.set(voteRef, {
            storyId,
            uid: profile.uid,
            createdAt: Date.now()
          });
        }
      });
      if (userVotes.has(storyId)) {
        toast.success("Vote removed");
      } else {
        toast.success("Story upvoted");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to process vote");
    }
  };

  const sortedAndFilteredStories = useMemo(() => {
    const filtered = stories.filter((s) => {
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.story.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === "All" || (s.tags && s.tags.includes(selectedTag));
      return matchesSearch && matchesTag;
    });

    if (activeTab === "Newest") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (activeTab === "Most Upvoted") {
      filtered.sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0));
    }

    return filtered;
  }, [stories, searchTerm, activeTab, selectedTag]);

  return (
    <PageTemplate
      title="Shift Stories"
      description="Share wins, challenges, and insights from the frontlines."
      action={
        <ThreeDButton onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Story
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
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm appearance-none"
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
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
        ) : stories.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No stories yet"
            description="Be the first to share a shift story!"
          />
        ) : sortedAndFilteredStories.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No stories match your search"
            description="Try adjusting your search terms or filters."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAndFilteredStories.map((story) => (
              <Link href={`/shift-stories/${story.id}`} key={story.id} className="block h-full">
              <GlassCard className="flex flex-col h-full gap-4 relative overflow-visible hoverEffect">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{story.title}</h3>
                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {story.tags.slice(0, 3).map(tag => (
                        <TagChip key={tag} label={tag} variant="outline" className="shrink-0 text-[10px] py-0.5 px-2" />
                      ))}
                      {story.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{story.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-sm flex-1 leading-relaxed line-clamp-3">
                  {story.story}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {story.authorName?.charAt(0).toUpperCase() || "?"}
                    </span>
                    <span className="truncate max-w-[100px]">{story.authorName || "Unknown"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => handleUpvote(story.id, e)}
                      className={`p-1.5 rounded-md transition-colors flex items-center gap-1 ${
                        userVotes.has(story.id)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${userVotes.has(story.id) ? "fill-primary" : ""}`} />
                      <span className="text-xs font-medium">{story.upvoteCount || 0}</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>

      <AddStoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </PageTemplate>
  );
}
