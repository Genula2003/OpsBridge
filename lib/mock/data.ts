import { Script, Story, Thread, Event, Recognition, BreakRequest, User, Resource } from "@/types";

export const users: User[] = [
  { id: "u1", name: "Alice Johnson", role: "admin", title: "Operations Manager", department: "Operations" },
  { id: "u2", name: "Bob Smith", role: "tl", title: "Team Lead", department: "Customer Support" },
  { id: "u3", name: "Charlie Davis", role: "mentor", title: "Senior Specialist", department: "Technical Support" },
  { id: "u4", name: "Diana Prince", role: "user", title: "Support Agent", department: "Customer Support" },
  { id: "u5", name: "Evan Wright", role: "user", title: "Support Agent", department: "Customer Support" },
];

export const scripts: Script[] = [
  { id: "sc1", title: "Greeting - Escalation", content: "Hello, I understand your frustration. I am escalating this to our specialized team immediately.", category: "De-escalation", authorUid: "u2", authorName: "Bob Smith", createdAt: Date.parse("2023-10-01T10:00:00Z"), upvoteCount: 42, approved: true },
  { id: "sc2", title: "Closing - General", content: "Thank you for reaching out. Is there anything else I can assist you with today?", category: "Closing", authorUid: "u3", authorName: "Charlie Davis", createdAt: Date.parse("2023-10-02T11:30:00Z"), upvoteCount: 89, approved: true },
  { id: "sc3", title: "Refund Policy Explanation", content: "Our refund policy allows for returns within 30 days of purchase, provided the item is in its original condition.", category: "Policy", authorUid: "u4", authorName: "Diana Prince", createdAt: Date.parse("2023-10-05T09:15:00Z"), upvoteCount: 12, approved: false },
  { id: "sc4", title: "Apology for Delay", content: "I apologize for the wait. We are currently experiencing higher than normal volume.", category: "Apology", authorUid: "u2", authorName: "Bob Smith", createdAt: Date.parse("2023-10-10T14:45:00Z"), upvoteCount: 35, approved: true },
];

export const stories: Story[] = [
  { id: "st1", title: "Saved a high-value account", story: "A customer was about to cancel their enterprise plan, but after walking them through our new feature set, they decided to upgrade instead!", authorUid: "u3", authorName: "Charlie Davis", createdAt: Date.parse("2023-10-12T16:20:00Z"), tags: ["Win"], upvoteCount: 24 },
  { id: "st2", title: "Funny typo in chat", story: "I accidentally typed 'have a great die' instead of 'day' and the customer replied 'RIP'. We had a good laugh.", authorUid: "u4", authorName: "Diana Prince", createdAt: Date.parse("2023-10-14T09:10:00Z"), tags: ["Humor"], upvoteCount: 56 },
  { id: "st3", title: "Tricky technical issue resolved", story: "Spent 2 hours diagnosing a weird caching issue. Turns out clearing their browser data did the trick. Always check the basics first.", authorUid: "u5", authorName: "Evan Wright", createdAt: Date.parse("2023-10-15T11:05:00Z"), tags: ["Learning"], upvoteCount: 18 },
];

export const threads: Thread[] = [
  { id: "th1", title: "How to handle angry customers during an outage?", body: "Looking for tips on de-escalation when our services go down.", authorUid: "u4", authorName: "Diana Prince", createdAt: Date.parse("2023-10-10T08:00:00Z"), upvoteCount: 15, category: "question" },
  { id: "th2", title: "Feedback on the new CRM interface", body: "The new layout is a bit confusing. Anyone else finding it hard to locate customer history?", authorUid: "u5", authorName: "Evan Wright", createdAt: Date.parse("2023-10-16T13:30:00Z"), upvoteCount: 8, category: "discussion" },
  { id: "th3", title: "Upcoming policy changes Q&A", body: "Post your questions about next month's return policy changes here.", authorUid: "u1", authorName: "Alice Johnson", createdAt: Date.parse("2023-10-17T09:00:00Z"), upvoteCount: 22, category: "announcement" },
];

export const events: Event[] = [
  { id: "ev1", title: "Quarterly All-Hands Meeting", description: "Join us for updates on company performance and future goals.", date: "2023-11-01T15:00:00Z", location: "Main Conference Room / Zoom", organizerId: "u1", attendees: 150, type: "meeting" },
  { id: "ev2", title: "De-escalation Workshop", description: "Interactive session on handling difficult conversations.", date: "2023-11-05T10:00:00Z", location: "Training Room A", organizerId: "u2", attendees: 25, type: "training" },
  { id: "ev3", title: "Virtual Trivia Night", description: "Grab a drink and join us for some fun trivia!", date: "2023-11-10T18:00:00Z", location: "Zoom", organizerId: "u3", attendees: 40, type: "social" },
];

export const recognitions: Recognition[] = [
  { id: "rc1", fromId: "u2", toId: "u4", message: "Great job handling that escalated call today. You stayed perfectly calm.", category: "Excellence", createdAt: "2023-10-15T14:20:00Z", likes: 12 },
  { id: "rc2", fromId: "u1", toId: "u3", message: "Thanks for staying late to help the new trainees get set up.", category: "Teamwork", createdAt: "2023-10-16T17:45:00Z", likes: 28 },
  { id: "rc3", fromId: "u5", toId: "u2", message: "Appreciate your guidance on that tricky technical ticket.", category: "Mentorship", createdAt: "2023-10-18T09:10:00Z", likes: 8 },
];

export const breakRequests: BreakRequest[] = [
  { id: "br1", userId: "u4", time: "14:00", duration: 15, status: "active", activity: "Coffee chat" },
  { id: "br2", userId: "u5", time: "15:30", duration: 30, status: "matched", activity: "Walk outside", matchedWith: "u3" },
  { id: "br3", userId: "u2", time: "11:00", duration: 15, status: "completed", activity: "Quick vent session", matchedWith: "u1" },
];

export const resources: Resource[] = [
  { id: "rs1", title: "Product Knowledge Base", description: "Central repository for all product details and specs.", url: "https://kb.company.com", category: "Documentation", icon: "book" },
  { id: "rs2", title: "HR Portal", description: "Access your benefits, paystubs, and time off requests.", url: "https://hr.company.com", category: "Internal Tools", icon: "users" },
  { id: "rs3", title: "IT Helpdesk", description: "Submit a ticket for hardware or software issues.", url: "https://it.company.com", category: "Support", icon: "monitor" },
];

export const weeklyDigest = {
  topScript: scripts[1],
  newJoiners: [users[4]],
  upcomingEvents: [events[0], events[1]],
  mostAppreciated: users[2],
  topThread: threads[0],
};
