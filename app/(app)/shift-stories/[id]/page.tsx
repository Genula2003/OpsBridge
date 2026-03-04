"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, runTransaction, onSnapshot, collection, query, orderBy, addDoc } from "firebase/firestore";
import { Story, Comment } from "@/types";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { TagChip } from "@/components/ui/TagChip";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { ThumbsUp, ArrowLeft, Calendar, MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

export default function StoryDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { profile } = useAuth();

  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const storyRef = doc(db, "shiftStories", id);
    const unsubscribeStory = onSnapshot(storyRef, (doc) => {
      if (doc.exists()) {
        setStory({ id: doc.id, ...doc.data() } as Story);
      } else {
        toast.error("Story not found");
        router.push("/shift-stories");
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching story:", error);
      toast.error("Error loading story");
      setLoading(false);
    });

    return () => unsubscribeStory();
  }, [id, router]);

  useEffect(() => {
    let unsubscribeVote: () => void = () => {};
    let unsubscribeComments: () => void = () => {};

    if (id) {
      const commentsRef = collection(db, "shiftStories", id, "comments");
      const q = query(commentsRef, orderBy("createdAt", "desc"));
      unsubscribeComments = onSnapshot(q, (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[];
        setComments(fetchedComments);
      }, (err) => {
        console.error("Error fetching comments:", err);
      });
    }

    if (profile && id) {
      const voteId = `${id}_${profile.uid}`;
      const voteRef = doc(db, "shiftStoryVotes", voteId);
      unsubscribeVote = onSnapshot(voteRef, (doc) => {
        setHasVoted(doc.exists());
      }, (err) => {
        console.error("Error fetching vote status:", err);
      });
    }

    return () => {
      unsubscribeVote();
      unsubscribeComments();
    };
  }, [profile, id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error("You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const commentsRef = collection(db, "shiftStories", story!.id, "comments");
      await addDoc(commentsRef, {
        uid: profile.uid,
        authorName: profile.name || "Unknown",
        text: newComment.trim(),
        createdAt: Date.now()
      });
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleUpvote = async () => {
    if (!profile || !story) {
      toast.error("You must be logged in to vote");
      return;
    }

    const voteId = `${story.id}_${profile.uid}`;
    const voteRef = doc(db, "shiftStoryVotes", voteId);
    const storyRef = doc(db, "shiftStories", story.id);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(storyRef);
        if (!sfDoc.exists()) throw "Document does not exist!";

        const voteDoc = await transaction.get(voteRef);

        if (voteDoc.exists()) {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) - 1;
          transaction.update(storyRef, { upvoteCount: newUpvotes });
          transaction.delete(voteRef);
        } else {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) + 1;
          transaction.update(storyRef, { upvoteCount: newUpvotes });
          transaction.set(voteRef, {
            storyId: story.id,
            uid: profile.uid,
            createdAt: Date.now()
          });
        }
      });
      if (hasVoted) {
        toast.success("Vote removed");
      } else {
        toast.success("Story upvoted");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to process vote");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!story) return null;

  return (
    <PageTemplate
      title="Shift Story"
      action={
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 bg-muted/30 rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Stories
        </button>
      }
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <GlassCard className="flex flex-col gap-6 relative p-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              {story.title}
            </h1>

            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {story.tags.map(tag => (
                  <TagChip key={tag} label={tag} variant="outline" className="text-xs" />
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
              <Calendar className="w-4 h-4" />
              {new Date(story.createdAt).toLocaleDateString()} at {new Date(story.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>

          <div className="flex items-center gap-3 py-4 border-y border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {story.authorName?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-foreground">{story.authorName || "Unknown"}</p>
              <p className="text-sm text-muted-foreground">Author</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-6 border border-white/5">
            <p className="text-lg leading-relaxed text-zinc-300 whitespace-pre-wrap font-medium">
              &quot;{story.story}&quot;
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                hasVoted
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(124,92,255,0.3)]"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${hasVoted ? "fill-white" : ""}`} />
              {story.upvoteCount || 0} Upvotes
            </button>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-6 p-8">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3>Comments ({comments.length})</h3>
          </div>

          <form onSubmit={handleAddComment} className="flex flex-col gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your thoughts..."
              className="w-full px-4 py-3 bg-muted/30 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-sm min-h-[100px] resize-y"
              disabled={isSubmittingComment}
            />
            <div className="flex justify-end">
              <ThreeDButton
                type="submit"
                size="sm"
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? "Posting..." : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Post Comment
                  </>
                )}
              </ThreeDButton>
            </div>
          </form>

          <div className="flex flex-col gap-4 mt-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-muted/20 border border-white/5">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {comment.authorName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{comment.authorName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </PageTemplate>
  );
}
