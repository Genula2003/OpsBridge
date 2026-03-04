"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, runTransaction, onSnapshot, collection, query, orderBy, addDoc } from "firebase/firestore";
import { Script, Comment } from "@/types";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { TagChip } from "@/components/ui/TagChip";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { ThumbsUp, Copy, CheckCircle2, ArrowLeft, Calendar, MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRole } from "@/lib/RoleProvider";
import toast from "react-hot-toast";

export default function ScriptDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { profile } = useAuth();
  const { role } = useRole();
  const isTL = role === "tl" || role === "admin";

  const [script, setScript] = useState<Script | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const scriptRef = doc(db, "scripts", id);
    const unsubscribeScript = onSnapshot(scriptRef, (doc) => {
      if (doc.exists()) {
        setScript({ id: doc.id, ...doc.data() } as Script);
      } else {
        toast.error("Script not found");
        router.push("/verbiage-hub");
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching script:", error);
      toast.error("Error loading script");
      setLoading(false);
    });

    return () => unsubscribeScript();
  }, [id, router]);

  useEffect(() => {
    let unsubscribeVote: () => void = () => {};
    let unsubscribeComments: () => void = () => {};

    if (id) {
      const commentsRef = collection(db, "scripts", id, "comments");
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
      const voteRef = doc(db, "scriptVotes", voteId);
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
      const commentsRef = collection(db, "scripts", script!.id, "comments");
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

  const handleApprove = async () => {
    if (!isTL || !profile || !script) return;
    try {
      await runTransaction(db, async (transaction) => {
        const sfDocRef = doc(db, "scripts", script.id);
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

  const handleUpvote = async () => {
    if (!profile || !script) {
      toast.error("You must be logged in to vote");
      return;
    }

    const voteId = `${script.id}_${profile.uid}`;
    const voteRef = doc(db, "scriptVotes", voteId);
    const scriptRef = doc(db, "scripts", script.id);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(scriptRef);
        if (!sfDoc.exists()) throw "Document does not exist!";

        const voteDoc = await transaction.get(voteRef);

        if (voteDoc.exists()) {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) - 1;
          transaction.update(scriptRef, { upvoteCount: newUpvotes });
          transaction.delete(voteRef);
        } else {
          const newUpvotes = (sfDoc.data().upvoteCount || 0) + 1;
          transaction.update(scriptRef, { upvoteCount: newUpvotes });
          transaction.set(voteRef, {
            scriptId: script.id,
            uid: profile.uid,
            createdAt: Date.now()
          });
        }
      });
      if (hasVoted) {
        toast.success("Vote removed");
      } else {
        toast.success("Script upvoted");
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

  if (!script) return null;

  return (
    <PageTemplate
      title="Script Details"
      action={
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 bg-muted/30 rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
      }
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <GlassCard className="flex flex-col gap-6 relative p-8">
          {script.approved && (
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full border border-green-500/20">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Approved</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <TagChip label={script.category} variant="default" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(script.createdAt).toLocaleDateString()}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground leading-tight pr-24">
              {script.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 py-4 border-y border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {script.authorName?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-foreground">{script.authorName || "Unknown"}</p>
              <p className="text-sm text-muted-foreground">Author</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-6 border border-white/5 relative group">
            <p className="text-lg leading-relaxed text-zinc-300 whitespace-pre-wrap font-medium">
              &quot;{script.content}&quot;
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(script.content);
                toast.success("Copied to clipboard");
              }}
              className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur border border-border rounded-lg text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-muted"
            >
              <Copy className="w-4 h-4" />
            </button>
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
              {script.upvoteCount || 0} Upvotes
            </button>

            {isTL && !script.approved && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-green-500 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                Approve Script
              </button>
            )}
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
              placeholder="Add your thoughts or suggest an improvement..."
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
