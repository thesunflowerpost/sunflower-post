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
import type { Database, Book, BookStatus } from "./schema";
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
// INITIALIZATION
// ============================================================================

/**
 * Initialize the database (create file if it doesn't exist)
 */
export async function initializeDatabase(): Promise<void> {
  await ensureDatabase();
}
