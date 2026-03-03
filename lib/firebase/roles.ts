import { Role, UserProfile } from "./auth";

/**
 * Returns the role of the currently logged-in user profile.
 */
export function getCurrentUserRole(profile: UserProfile | null): Role {
  return profile?.role || "user";
}

/**
 * Checks if the current user is an admin.
 */
export function isAdmin(profile: UserProfile | null): boolean {
  return getCurrentUserRole(profile) === "admin";
}

/**
 * Checks if the current user is a team leader.
 */
export function isTL(profile: UserProfile | null): boolean {
  return getCurrentUserRole(profile) === "tl";
}

/**
 * Checks if the current user is a mentor (QA).
 */
export function isMentor(profile: UserProfile | null): boolean {
  return getCurrentUserRole(profile) === "mentor";
}

/**
 * Checks if the current user has any elevated privileges (admin, tl, or mentor).
 * Role hierarchy: admin > tl > mentor > user
 */
export function isPrivileged(profile: UserProfile | null): boolean {
  const role = getCurrentUserRole(profile);
  return role === "admin" || role === "tl" || role === "mentor";
}
