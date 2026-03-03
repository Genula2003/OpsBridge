import { auth, db } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type Role = "user" | "mentor" | "tl" | "admin";

export interface UserProfile {
  uid: string;
  email: string | null;
  role: Role;
  name: string;
  createdAt: number;
}

// Ensure the user has a profile document in Firestore
export const createUserProfile = async (user: FirebaseUser, role: Role = "user", name: string = "") => {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      role,
      name: name || user.email?.split("@")[0] || "User",
      createdAt: Date.now()
    };
    await setDoc(userRef, profile);
    return profile;
  }

  return userDoc.data() as UserProfile;
};

// Retrieve a user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};
