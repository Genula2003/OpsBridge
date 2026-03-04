"use client";

import { Modal } from "@/components/ui/Modal";
import { ThreeDButton } from "@/components/ui/ThreeDButton";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStoryModal({ isOpen, onClose }: AddStoryModalProps) {
  const { profile } = useAuth();
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error("You must be logged in to share a story.");
      return;
    }

    if (!title.trim() || !story.trim()) {
      toast.error("Please provide both a title and the story content.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "shiftStories"), {
        title: title.trim(),
        story: story.trim(),
        tags: tags,
        authorUid: profile.uid,
        authorName: profile.name || "Unknown",
        createdAt: Date.now(),
        upvoteCount: 0,
      });

      toast.success("Story shared successfully!");
      setTitle("");
      setStory("");
      setTags([]);
      setTagInput("");
      onClose();
    } catch (error) {
      console.error("Error sharing story:", error);
      toast.error("Failed to share story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share a Shift Story"
      footer={
        <>
          <ThreeDButton variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ThreeDButton>
          <ThreeDButton type="button" onClick={() => {
            const form = document.getElementById("add-story-form") as HTMLFormElement;
            if (form) form.requestSubmit();
          }} disabled={isSubmitting}>
            {isSubmitting ? "Sharing..." : "Share Story"}
          </ThreeDButton>
        </>
      }
    >
      <form id="add-story-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Saved a high-value account today!"
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            maxLength={100}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="story" className="text-sm font-medium text-foreground">
            Story
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="What happened? Share the details..."
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm min-h-[150px] resize-y"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tags" className="text-sm font-medium text-foreground">
            Tags (Optional)
          </label>
          <div className="flex flex-col gap-2">
            <input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter or comma"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-primary/30 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
