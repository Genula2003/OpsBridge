"use client";

import { Modal } from "@/components/ui/Modal";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

interface AddThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddThreadModal({ isOpen, onClose }: AddThreadModalProps) {
  const { profile } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("discussion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error("You must be logged in to create a thread.");
      return;
    }

    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "threads"), {
        title: title.trim(),
        body: body.trim(),
        category,
        authorUid: profile.uid,
        authorName: profile.name || "Unknown",
        createdAt: Date.now(),
        upvoteCount: 0,
      });

      toast.success("Thread created successfully!");
      setTitle("");
      setBody("");
      setCategory("discussion");
      onClose();
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("Failed to create thread. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Thread"
      footer={
        <>
          <ThreeDButton variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ThreeDButton>
          <ThreeDButton type="button" onClick={() => {
            const form = document.getElementById("add-thread-form") as HTMLFormElement;
            if (form) form.requestSubmit();
          }} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Thread"}
          </ThreeDButton>
        </>
      }
    >
      <form id="add-thread-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ideas for next team building event?"
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            maxLength={150}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm appearance-none"
          >
            <option value="discussion">Discussion</option>
            <option value="question">Question</option>
            <option value="announcement">Announcement</option>
            <option value="fun">Fun</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="body" className="text-sm font-medium text-foreground">
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm min-h-[150px] resize-y"
          />
        </div>
      </form>
    </Modal>
  );
}
