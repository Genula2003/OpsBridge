export type Role = "user" | "mentor" | "tl" | "admin";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: Role;
  title: string;
  department: string;
}

export interface Script {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  createdAt: string;
  upvotes: number;
  isApproved: boolean;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  category: string;
  likes: number;
  comments: number;
  isPinned: boolean;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  replies: number;
  views: number;
  isLocked: boolean;
  isResolved: boolean;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizerId: string;
  attendees: number;
  type: "training" | "social" | "meeting";
}

export interface Recognition {
  id: string;
  fromId: string;
  toId: string;
  message: string;
  category: string;
  createdAt: string;
  likes: number;
}

export interface BreakRequest {
  id: string;
  userId: string;
  time: string;
  duration: number;
  status: "active" | "matched" | "completed";
  activity: string;
  matchedWith?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
}
