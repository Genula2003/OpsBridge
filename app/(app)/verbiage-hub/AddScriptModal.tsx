"use client";

import { Modal } from "@/components/ui/Modal";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

interface AddScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddScriptModal({ isOpen, onClose }: AddScriptModalProps) {
  const { profile } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Greeting");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error("You must be logged in to add a script.");
      return;
    }

    if (!title.trim() || !content.trim() || !category) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "scripts"), {
        title: title.trim(),
        category,
        content: content.trim(),
        authorUid: profile.uid,
        authorName: profile.name || "Unknown",
        createdAt: Date.now(),
        upvoteCount: 0,
        approved: false,
      });

      toast.success("Script added successfully!");
      setTitle("");
      setCategory("Greeting");
      setContent("");
      onClose();
    } catch (error) {
      console.error("Error adding script:", error);
      toast.error("Failed to add script. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Script"
      footer={
        <>
          <ThreeDButton variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ThreeDButton>
          <ThreeDButton onClick={() => {
            const form = document.getElementById("add-script-form") as HTMLFormElement;
            if (form) form.requestSubmit();
          }} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Script"}
          </ThreeDButton>
        </>
      }
    >
      <form id="add-script-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Greeting - Escalation"
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            maxLength={100}
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
            <option value="Greeting">Greeting</option>
            <option value="De-escalation">De-escalation</option>
            <option value="Closing">Closing</option>
            <option value="Policy">Policy</option>
            <option value="Apology">Apology</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-medium text-foreground">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the exact verbiage here..."
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm min-h-[120px] resize-y"
          />
        </div>
      </form>
    </Modal>
  );
}
