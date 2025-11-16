// src/lib/search.ts

/**
 * Simple helper to check if any of the given string fields
 * contain the search query (case-insensitive).
 *
 * - fields: array of strings to search within
 * - search: raw search input from the user
 */
export function matchesSearch(fields: string[], search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true; // if search is empty, always match

  const haystack = fields.join(" ").toLowerCase();
  return haystack.includes(q);
}
