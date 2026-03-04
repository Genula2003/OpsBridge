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
  authorUid: string;
  authorName: string;
  createdAt: number;
  updatedAt?: number;
  upvoteCount: number;
  approved: boolean;
  approvedBy?: string;
}

export interface ScriptVote {
  scriptId: string;
  uid: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  uid: string;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface Story {
  id: string;
  title: string;
  story: string;
  tags: string[];
  authorUid: string;
  authorName: string;
  createdAt: number;
  upvoteCount: number;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  authorUid: string;
  authorName: string;
  createdAt: number;
  upvoteCount: number;
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
