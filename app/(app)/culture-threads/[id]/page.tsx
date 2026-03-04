"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, runTransaction, onSnapshot, collection, query, orderBy, addDoc } from "firebase/firestore";
import { Thread, Comment } from "@/types";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { TagChip } from "@/components/ui/TagChip";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { ThumbsUp, ArrowLeft, Calendar, MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

export default function ThreadDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { profile } = useAuth();

  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const threadRef = doc(db, "threads", id);
    const unsubscribeThread = onSnapshot(threadRef, (doc) => {
      if (doc.exists()) {
        setThread({ id: doc.id, ...doc.data() } as Thread);
      } else {
        toast.error("Thread not found");
        router.push("/culture-threads");
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching thread:", error);
      toast.error("Error loading thread");
      setLoading(false);
    });

    return () => unsubscribeThread();
  }, [id, router]);

  useEffect(() => {
    let unsubscribeVote: () => void = () => {};
    let unsubscribeComments: () => void = () => {};

    if (id) {
      const commentsRef = collection(db, "threads", id, "comments");
      const q = query(commentsRef, orderBy("createdAt", "asc"));
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
      const voteRef = doc(db, "threadVotes", voteId);
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
      const commentsRef = collection(db, "threads", thread!.id, "comments");
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
    if (!profile || !thread) {
      toast.error("You must be logged in to vote");
      return;
    }

    const voteId = `${thread.id}_${profile.uid}`;
    const voteRef = doc(db, "threadVotes", voteId);
    const threadRef = doc(db, "threads", thread.id);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(threadRef);
        if (!sfDoc.exists()) throw "Document does not exist!";

        const voteDoc = await transaction.get(voteRef);

        if (voteDoc.exists()) {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) - 1;
          transaction.update(threadRef, { upvoteCount: newUpvotes });
          transaction.delete(voteRef);
        } else {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) + 1;
          transaction.update(threadRef, { upvoteCount: newUpvotes });
          transaction.set(voteRef, {
            threadId: thread.id,
            uid: profile.uid,
            createdAt: Date.now()
          });
        }
      });
      if (hasVoted) {
        toast.success("Vote removed");
      } else {
        toast.success("Thread upvoted");
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

  if (!thread) return null;

  return (
    <PageTemplate
      title="Culture Thread"
      action={
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 bg-muted/30 rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Threads
        </button>
      }
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <GlassCard className="flex flex-col gap-6 relative p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <TagChip label={thread.category} variant="default" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(thread.createdAt).toLocaleDateString()} at {new Date(thread.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              {thread.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 py-4 border-y border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {thread.authorName?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-foreground">{thread.authorName || "Unknown"}</p>
              <p className="text-sm text-muted-foreground">Author</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-6 border border-white/5">
            <p className="text-lg leading-relaxed text-zinc-300 whitespace-pre-wrap font-medium">
              &quot;{thread.body}&quot;
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
              {thread.upvoteCount || 0} Upvotes
            </button>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-6 p-8">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3>Discussion ({comments.length})</h3>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No comments yet. Start the conversation!</p>
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
                        {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex flex-col gap-3 mt-4 border-t border-border/50 pt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the discussion..."
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
                    <Send className="w-4 h-4 mr-2" /> Post Reply
                  </>
                )}
              </ThreeDButton>
            </div>
          </form>

        </GlassCard>
      </div>
    </PageTemplate>
  );
}
