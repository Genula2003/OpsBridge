import { auth, db } from "./config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc, getDoc, Timestamp, writeBatch } from "firebase/firestore";

// A utility function to seed the database
export const seedDatabase = async () => {
  try {
    const batch = writeBatch(db);

    // Create a mock user if one doesn't exist
    let uid = auth.currentUser?.uid;
    if (!uid) {
      console.log("No authenticated user, attempting to create seed admin user...");
      try {
        const cred = await createUserWithEmailAndPassword(auth, "admin@opsbridge.com", "password123");
        uid = cred.user.uid;

        await setDoc(doc(db, "users", uid), {
          uid: uid,
          name: "Admin User",
          email: "admin@opsbridge.com",
          role: "admin",
          shift: "morning",
          isRemote: true,
          createdAt: Timestamp.now()
        });
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          const cred = await signInWithEmailAndPassword(auth, "admin@opsbridge.com", "password123");
          uid = cred.user.uid;
        } else {
          throw err;
        }
      }
    }

    if (!uid) throw new Error("Could not initialize a user UID for seeding.");

    // Seed 5 scripts
    const scriptsRef = collection(db, "scripts");
    for (let i = 1; i <= 5; i++) {
      const newScript = doc(scriptsRef);
      batch.set(newScript, {
        title: `Script ${i} - Standard SOP`,
        category: ["id", "workspace", "monitoring", "misconduct", "restart"][i-1],
        content: `This is the mock content for script number ${i}. Ensure all steps are followed.`,
        authorId: uid,
        upvoteCount: i * 5,
        approved: true,
        approvedBy: uid,
        createdAt: Timestamp.now()
      });
    }

    // Seed 3 stories
    const storiesRef = collection(db, "stories");
    for (let i = 1; i <= 3; i++) {
      const newStory = doc(storiesRef);
      batch.set(newStory, {
        category: ["common_issue", "smart_handling", "process_insight"][i-1],
        content: `During my shift, I resolved issue ${i} by doing X. Here is what I learned.`,
        authorId: uid,
        shift: "morning",
        pinned: i === 1,
        createdAt: Timestamp.now()
      });
    }

    // Seed 2 threads
    const threadsRef = collection(db, "threads");
    for (let i = 1; i <= 2; i++) {
      const newThread = doc(threadsRef);
      batch.set(newThread, {
        type: ["event", "icebreaker"][i-1],
        title: `Discussion Topic ${i}`,
        authorId: uid,
        locked: false,
        createdAt: Timestamp.now()
      });
    }

    // Seed 2 events
    const eventsRef = collection(db, "events");
    for (let i = 1; i <= 2; i++) {
      const newEvent = doc(eventsRef);
      const futureDate = Timestamp.fromMillis(Date.now() + 86400000 * (i + 5)); // Next week
      batch.set(newEvent, {
        title: `Upcoming Event ${i}`,
        description: `Join us for the monthly sync up ${i}.`,
        date: futureDate,
        location: i === 1 ? "Virtual" : "HQ Room A",
        mode: i === 1 ? "remote" : "onsite",
        createdBy: uid,
        createdAt: Timestamp.now()
      });
    }

    // Seed 3 recognitions
    const recognitionsRef = collection(db, "recognitions");
    for (let i = 1; i <= 3; i++) {
      const newRec = doc(recognitionsRef);
      batch.set(newRec, {
        fromUserId: uid,
        toUserId: "some-other-user-id", // mock
        message: `Great job on handling the escalation ticket today! #${i}`,
        createdAt: Timestamp.now()
      });
    }

    // Seed 1 active break request
    const breakRequestsRef = collection(db, "breakRequests");
    const newActiveBreak = doc(breakRequestsRef);
    batch.set(newActiveBreak, {
      userId: uid,
      userName: "Admin User",
      shift: "morning",
      mode: "remote",
      timeWindow: 15,
      status: "active",
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromMillis(Date.now() + 15 * 60000), // 15 mins from now
      endedAt: null
    });

    // Seed 1 expired break request
    const newExpiredBreak = doc(breakRequestsRef);
    batch.set(newExpiredBreak, {
      userId: uid,
      userName: "Admin User",
      shift: "morning",
      mode: "remote",
      timeWindow: 15,
      status: "ended",
      createdAt: Timestamp.fromMillis(Date.now() - 3600000), // 1 hour ago
      expiresAt: Timestamp.fromMillis(Date.now() - 3600000 + 15 * 60000),
      endedAt: Timestamp.fromMillis(Date.now() - 2700000) // ended 15 mins later
    });

    // Commit all operations
    await batch.commit();
    console.log("Database seeded successfully with test data!");

    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};
