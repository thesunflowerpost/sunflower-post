/**
 * Display Name Utilities
 *
 * Helper functions for handling anonymous vs real name display
 */

import type { User } from '@/lib/db/schema';

/**
 * Get the display name for a user based on anonymity preference
 * @param user - The user object
 * @param isAnonymous - Whether to display anonymously
 * @returns The name to display (alias if anonymous, real name otherwise)
 */
export function getDisplayName(user: User, isAnonymous: boolean): string {
  return isAnonymous ? user.alias : user.name;
}

/**
 * Get the display name with a fallback for missing user data
 * @param user - The user object (can be null/undefined)
 * @param isAnonymous - Whether to display anonymously
 * @param fallback - Fallback name if user is not available (default: "Someone")
 * @returns The name to display
 */
export function getDisplayNameSafe(
  user: User | null | undefined,
  isAnonymous: boolean,
  fallback: string = "Someone"
): string {
  if (!user) return fallback;
  return isAnonymous ? user.alias : user.name;
}

/**
 * Type for a post/comment author that can be used in UI components
 */
export interface DisplayAuthor {
  userId: string;
  displayName: string;
  isAnonymous: boolean;
  profilePicture?: string;
}

/**
 * Create a display author object from user data
 * @param user - The user object
 * @param isAnonymous - Whether to display anonymously
 * @returns DisplayAuthor object ready for UI rendering
 */
export function createDisplayAuthor(
  user: User,
  isAnonymous: boolean
): DisplayAuthor {
  return {
    userId: user.id,
    displayName: isAnonymous ? user.alias : user.name,
    isAnonymous,
    // Don't show profile picture if anonymous
    profilePicture: isAnonymous ? undefined : user.profilePicture,
  };
}
