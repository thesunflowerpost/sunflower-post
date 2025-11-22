/**
 * Simple File-Based Database
 *
 * This is a lightweight database implementation using JSON files.
 * It's perfect for development and small-scale deployments.
 *
 * To upgrade to a real database (PostgreSQL, MySQL, etc.):
 * 1. Install Prisma or your preferred ORM
 * 2. Replace these functions with database queries
 * 3. Keep the same API interface
 */

import { promises as fs } from "fs";
import path from "path";
import type { Database, Book, BookStatus, TVMovie, TVMovieStatus, TVMovieDiscussion, TVMovieReply, TVMovieDiscussionReaction, TVMovieReplyReaction } from "./schema";
import { initialDatabase } from "./schema";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

/**
 * Ensure the database file and directory exist
 */
async function ensureDatabase(): Promise<void> {
  try {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });

    try {
      await fs.access(DB_PATH);
    } catch {
      // File doesn't exist, create it with initial data
      await fs.writeFile(DB_PATH, JSON.stringify(initialDatabase, null, 2));
    }
  } catch (error) {
    console.error("Error ensuring database:", error);
    throw error;
  }
}

/**
 * Read the entire database
 */
export async function readDatabase(): Promise<Database> {
  await ensureDatabase();
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

/**
 * Write the entire database
 */
async function writeDatabase(db: Database): Promise<void> {
  await ensureDatabase();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

// ============================================================================
// BOOK OPERATIONS
// ============================================================================

/**
 * Get all books
 */
export async function getBooks(): Promise<Book[]> {
  const db = await readDatabase();
  return db.books;
}

/**
 * Get a single book by ID
 */
export async function getBook(id: string): Promise<Book | null> {
  const db = await readDatabase();
  return db.books.find((book) => book.id === id) || null;
}

/**
 * Create a new book
 */
export async function createBook(
  book: Omit<Book, "id" | "createdAt" | "updatedAt">
): Promise<Book> {
  const db = await readDatabase();

  const newBook: Book = {
    ...book,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.books.unshift(newBook);
  await writeDatabase(db);

  return newBook;
}

/**
 * Update an existing book
 */
export async function updateBook(
  id: string,
  updates: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>
): Promise<Book | null> {
  const db = await readDatabase();
  const index = db.books.findIndex((book) => book.id === id);

  if (index === -1) {
    return null;
  }

  db.books[index] = {
    ...db.books[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeDatabase(db);
  return db.books[index];
}

/**
 * Delete a book
 */
export async function deleteBook(id: string): Promise<boolean> {
  const db = await readDatabase();
  const index = db.books.findIndex((book) => book.id === id);

  if (index === -1) {
    return false;
  }

  db.books.splice(index, 1);
  await writeDatabase(db);
  return true;
}

/**
 * Update book status for a user
 */
export async function updateUserBookStatus(
  bookId: string,
  userId: string,
  status: BookStatus
): Promise<void> {
  const db = await readDatabase();

  // Find existing status entry
  const existingIndex = db.userBookStatuses.findIndex(
    (s) => s.bookId === bookId && s.userId === userId
  );

  if (existingIndex !== -1) {
    // Update existing
    db.userBookStatuses[existingIndex].status = status;
    db.userBookStatuses[existingIndex].updatedAt = new Date().toISOString();
  } else {
    // Create new
    db.userBookStatuses.push({
      id: Date.now().toString(),
      bookId,
      userId,
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  await writeDatabase(db);
}

/**
 * Get book status for a user
 */
export async function getUserBookStatus(
  bookId: string,
  userId: string
): Promise<BookStatus | null> {
  const db = await readDatabase();
  const status = db.userBookStatuses.find(
    (s) => s.bookId === bookId && s.userId === userId
  );
  return status ? status.status : null;
}

// ============================================================================
// REACTION OPERATIONS
// ============================================================================

/**
 * Toggle a reaction for a book
 */
export async function toggleReaction(
  bookId: string,
  userId: string,
  reactionId: string,
  active: boolean
): Promise<void> {
  const db = await readDatabase();

  const existingIndex = db.reactions.findIndex(
    (r) => r.bookId === bookId && r.userId === userId && r.reactionId === reactionId
  );

  if (active && existingIndex === -1) {
    // Add reaction
    db.reactions.push({
      id: Date.now().toString(),
      bookId,
      userId,
      reactionId,
      createdAt: new Date().toISOString(),
    });
  } else if (!active && existingIndex !== -1) {
    // Remove reaction
    db.reactions.splice(existingIndex, 1);
  }

  await writeDatabase(db);
}

/**
 * Get all reactions for a user
 */
export async function getUserReactions(
  userId: string
): Promise<Record<string, Record<string, boolean>>> {
  const db = await readDatabase();
  const userReactions = db.reactions.filter((r) => r.userId === userId);

  const result: Record<string, Record<string, boolean>> = {};
  for (const reaction of userReactions) {
    if (!result[reaction.bookId]) {
      result[reaction.bookId] = {};
    }
    result[reaction.bookId][reaction.reactionId] = true;
  }

  return result;
}

// ============================================================================
// TV MOVIE OPERATIONS
// ============================================================================

/**
 * Get all TV shows and movies
 */
export async function getTVMovies(): Promise<TVMovie[]> {
  const db = await readDatabase();
  return db.tvMovies;
}

/**
 * Get a single TV show/movie by ID
 */
export async function getTVMovie(id: string): Promise<TVMovie | null> {
  const db = await readDatabase();
  return db.tvMovies.find((item) => item.id === id) || null;
}

/**
 * Create a new TV show/movie
 */
export async function createTVMovie(
  tvMovie: Omit<TVMovie, "id" | "createdAt" | "updatedAt">
): Promise<TVMovie> {
  const db = await readDatabase();

  const newTVMovie: TVMovie = {
    ...tvMovie,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tvMovies.unshift(newTVMovie);
  await writeDatabase(db);

  return newTVMovie;
}

/**
 * Update an existing TV show/movie
 */
export async function updateTVMovie(
  id: string,
  updates: Partial<Omit<TVMovie, "id" | "createdAt" | "updatedAt">>
): Promise<TVMovie | null> {
  const db = await readDatabase();
  const index = db.tvMovies.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  db.tvMovies[index] = {
    ...db.tvMovies[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeDatabase(db);
  return db.tvMovies[index];
}

/**
 * Delete a TV show/movie
 */
export async function deleteTVMovie(id: string): Promise<boolean> {
  const db = await readDatabase();
  const index = db.tvMovies.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  db.tvMovies.splice(index, 1);
  await writeDatabase(db);
  return true;
}

/**
 * Update TV/Movie status for a user
 */
export async function updateUserTVMovieStatus(
  tvMovieId: string,
  userId: string,
  status: TVMovieStatus
): Promise<void> {
  const db = await readDatabase();

  const existingIndex = db.userTVMovieStatuses.findIndex(
    (s) => s.tvMovieId === tvMovieId && s.userId === userId
  );

  if (existingIndex !== -1) {
    db.userTVMovieStatuses[existingIndex].status = status;
    db.userTVMovieStatuses[existingIndex].updatedAt = new Date().toISOString();
  } else {
    db.userTVMovieStatuses.push({
      id: Date.now().toString(),
      tvMovieId,
      userId,
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  await writeDatabase(db);
}

/**
 * Get TV/Movie status for a user
 */
export async function getUserTVMovieStatus(
  tvMovieId: string,
  userId: string
): Promise<TVMovieStatus | null> {
  const db = await readDatabase();
  const status = db.userTVMovieStatuses.find(
    (s) => s.tvMovieId === tvMovieId && s.userId === userId
  );
  return status ? status.status : null;
}

/**
 * Toggle a reaction for a TV show/movie
 */
export async function toggleTVMovieReaction(
  tvMovieId: string,
  userId: string,
  reactionId: string,
  active: boolean
): Promise<void> {
  const db = await readDatabase();

  const existingIndex = db.tvMovieReactions.findIndex(
    (r) => r.tvMovieId === tvMovieId && r.userId === userId && r.reactionId === reactionId
  );

  if (active && existingIndex === -1) {
    db.tvMovieReactions.push({
      id: Date.now().toString(),
      tvMovieId,
      userId,
      reactionId,
      createdAt: new Date().toISOString(),
    });
  } else if (!active && existingIndex !== -1) {
    db.tvMovieReactions.splice(existingIndex, 1);
  }

  await writeDatabase(db);
}

/**
 * Get all reactions for a user on TV shows/movies
 */
export async function getUserTVMovieReactions(
  userId: string
): Promise<Record<string, Record<string, boolean>>> {
  const db = await readDatabase();
  const userReactions = db.tvMovieReactions.filter((r) => r.userId === userId);

  const result: Record<string, Record<string, boolean>> = {};
  for (const reaction of userReactions) {
    if (!result[reaction.tvMovieId]) {
      result[reaction.tvMovieId] = {};
    }
    result[reaction.tvMovieId][reaction.reactionId] = true;
  }

  return result;
}

/**
 * Get all discussions for a TV show/movie
 */
export async function getTVMovieDiscussions(tvMovieId: string): Promise<TVMovieDiscussion[]> {
  const db = await readDatabase();
  return db.tvMovieDiscussions.filter((d) => d.tvMovieId === tvMovieId);
}

/**
 * Get a single discussion by ID
 */
export async function getTVMovieDiscussion(id: string): Promise<TVMovieDiscussion | null> {
  const db = await readDatabase();
  return db.tvMovieDiscussions.find((d) => d.id === id) || null;
}

/**
 * Create a new discussion for a TV show/movie
 */
export async function createTVMovieDiscussion(
  discussion: Omit<TVMovieDiscussion, "id" | "createdAt" | "replyCount">
): Promise<TVMovieDiscussion> {
  const db = await readDatabase();

  const newDiscussion: TVMovieDiscussion = {
    ...discussion,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    replyCount: 0,
  };

  db.tvMovieDiscussions.unshift(newDiscussion);

  // Increment discussion count on the TV show/movie
  const tvMovie = db.tvMovies.find((item) => item.id === discussion.tvMovieId);
  if (tvMovie) {
    tvMovie.discussionCount++;
  }

  await writeDatabase(db);
  return newDiscussion;
}

/**
 * Get all replies for a discussion
 */
export async function getTVMovieReplies(discussionId: string): Promise<TVMovieReply[]> {
  const db = await readDatabase();
  return db.tvMovieReplies.filter((r) => r.discussionId === discussionId);
}

/**
 * Create a new reply for a discussion
 */
export async function createTVMovieReply(
  reply: Omit<TVMovieReply, "id" | "createdAt">
): Promise<TVMovieReply> {
  const db = await readDatabase();

  const newReply: TVMovieReply = {
    ...reply,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  db.tvMovieReplies.push(newReply);

  // Increment reply count on the discussion
  const discussion = db.tvMovieDiscussions.find((d) => d.id === reply.discussionId);
  if (discussion) {
    discussion.replyCount++;
  }

  await writeDatabase(db);
  return newReply;
}

/**
 * Toggle a reaction for a discussion
 */
export async function toggleTVMovieDiscussionReaction(
  discussionId: string,
  userId: string,
  reactionId: string,
  active: boolean
): Promise<void> {
  const db = await readDatabase();

  const existingIndex = db.tvMovieDiscussionReactions.findIndex(
    (r) => r.discussionId === discussionId && r.userId === userId && r.reactionId === reactionId
  );

  if (active && existingIndex === -1) {
    db.tvMovieDiscussionReactions.push({
      id: Date.now().toString(),
      discussionId,
      userId,
      reactionId,
      createdAt: new Date().toISOString(),
    });
  } else if (!active && existingIndex !== -1) {
    db.tvMovieDiscussionReactions.splice(existingIndex, 1);
  }

  await writeDatabase(db);
}

/**
 * Get all reactions for a user on discussions
 */
export async function getUserTVMovieDiscussionReactions(
  userId: string
): Promise<Record<string, Record<string, boolean>>> {
  const db = await readDatabase();
  const userReactions = db.tvMovieDiscussionReactions.filter((r) => r.userId === userId);

  const result: Record<string, Record<string, boolean>> = {};
  for (const reaction of userReactions) {
    if (!result[reaction.discussionId]) {
      result[reaction.discussionId] = {};
    }
    result[reaction.discussionId][reaction.reactionId] = true;
  }

  return result;
}

/**
 * Toggle a reaction for a reply
 */
export async function toggleTVMovieReplyReaction(
  replyId: string,
  userId: string,
  reactionId: string,
  active: boolean
): Promise<void> {
  const db = await readDatabase();

  const existingIndex = db.tvMovieReplyReactions.findIndex(
    (r) => r.replyId === replyId && r.userId === userId && r.reactionId === reactionId
  );

  if (active && existingIndex === -1) {
    db.tvMovieReplyReactions.push({
      id: Date.now().toString(),
      replyId,
      userId,
      reactionId,
      createdAt: new Date().toISOString(),
    });
  } else if (!active && existingIndex !== -1) {
    db.tvMovieReplyReactions.splice(existingIndex, 1);
  }

  await writeDatabase(db);
}

/**
 * Get all reactions for a user on replies
 */
export async function getUserTVMovieReplyReactions(
  userId: string
): Promise<Record<string, Record<string, boolean>>> {
  const db = await readDatabase();
  const userReactions = db.tvMovieReplyReactions.filter((r) => r.userId === userId);

  const result: Record<string, Record<string, boolean>> = {};
  for (const reaction of userReactions) {
    if (!result[reaction.replyId]) {
      result[reaction.replyId] = {};
    }
    result[reaction.replyId][reaction.reactionId] = true;
  }

  return result;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the database (create file if it doesn't exist)
 */
export async function initializeDatabase(): Promise<void> {
  await ensureDatabase();
}
