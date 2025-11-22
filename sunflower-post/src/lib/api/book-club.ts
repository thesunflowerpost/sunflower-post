/**
 * Book Club API Client
 *
 * Frontend API client for Book Club operations.
 * Use these functions in your React components to interact with the backend.
 */

import type { Book, BookStatus } from "@/lib/db/schema";

const API_BASE = "/api/book-club";

// ============================================================================
// BOOK OPERATIONS
// ============================================================================

/**
 * Fetch all books
 */
export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(API_BASE);

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  return data.books;
}

/**
 * Fetch a single book by ID
 */
export async function fetchBook(id: string): Promise<Book> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }

  const data = await response.json();
  return data.book;
}

/**
 * Create a new book
 */
export async function createBook(book: {
  title: string;
  author: string;
  status?: BookStatus;
  mood?: string;
  theme?: string;
  format?: string;
  sharedBy?: string;
  note?: string;
  coverUrl?: string;
  link?: string;
}): Promise<Book> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create book");
  }

  const data = await response.json();
  return data.book;
}

/**
 * Update a book
 */
export async function updateBook(
  id: string,
  updates: Partial<Book>
): Promise<Book> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  const data = await response.json();
  return data.book;
}

/**
 * Delete a book
 */
export async function deleteBook(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
}

// ============================================================================
// USER BOOK STATUS
// ============================================================================

/**
 * Update user's reading status for a book
 */
export async function updateBookStatus(
  bookId: string,
  status: BookStatus,
  userId?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${bookId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to update book status");
  }
}

/**
 * Get user's reading status for a book
 */
export async function getBookStatus(
  bookId: string,
  userId?: string
): Promise<BookStatus | null> {
  const url = new URL(`${API_BASE}/${bookId}/status`, window.location.origin);
  if (userId) {
    url.searchParams.set("userId", userId);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch book status");
  }

  const data = await response.json();
  return data.status;
}

// ============================================================================
// REACTIONS
// ============================================================================

/**
 * Toggle a reaction for a book
 */
export async function toggleBookReaction(
  bookId: string,
  reactionId: string,
  active: boolean,
  userId?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${bookId}/reactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reactionId, active, userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to toggle reaction");
  }
}

/**
 * Get all reactions for the current user
 */
export async function getUserReactions(
  userId?: string
): Promise<Record<string, Record<string, boolean>>> {
  const url = new URL(`${API_BASE}/reactions`, window.location.origin);
  if (userId) {
    url.searchParams.set("userId", userId);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch reactions");
  }

  const data = await response.json();
  return data.reactions;
}
