/**
 * Database Schema Definitions for Sunflower Post
 *
 * This defines the types and structure for our database.
 * Currently uses JSON file storage, but can be easily migrated to
 * PostgreSQL, MySQL, or any other database.
 */

export type BookStatus = "Reading" | "Finished" | "To read";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  mood: string;
  theme?: string;
  format?: string;
  sharedBy: string;
  note?: string;
  coverUrl?: string;
  link?: string;
  discussionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookReaction {
  id: string;
  bookId: string;
  userId: string;
  reactionId: string;
  createdAt: string;
}

export interface UserBookStatus {
  id: string;
  bookId: string;
  userId: string;
  status: BookStatus;
  updatedAt: string;
}

export interface Discussion {
  id: string;
  bookId: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  replyCount: number;
}

export interface Reply {
  id: string;
  discussionId: string;
  author: string;
  body: string;
  createdAt: string;
}

// Database collections
export interface Database {
  books: Book[];
  reactions: BookReaction[];
  userBookStatuses: UserBookStatus[];
  discussions: Discussion[];
  replies: Reply[];
}

// Initial seed data
export const initialDatabase: Database = {
  books: [
    {
      id: "1",
      title: "All About Love",
      author: "bell hooks",
      status: "Reading",
      mood: "Soft self-help",
      theme: "Love · Healing · Community",
      format: "Physical",
      sharedBy: "S.",
      note: "Good for unlearning old ideas about love without feeling attacked.",
      discussionCount: 2,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "The Alchemist",
      author: "Paulo Coelho",
      status: "Finished",
      mood: "Slow & thoughtful",
      theme: "Purpose · Spirituality",
      format: "Audiobook",
      sharedBy: "Anon",
      note: "Great for when you feel lost or like you've 'missed your moment'.",
      discussionCount: 1,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Homegoing",
      author: "Yaa Gyasi",
      status: "To read",
      mood: "Heavy but healing",
      theme: "Ancestry · Diaspora · Generations",
      format: "Kindle",
      sharedBy: "Jay",
      note: "Everyone says it's intense but beautifully written.",
      discussionCount: 0,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  reactions: [],
  userBookStatuses: [],
  discussions: [],
  replies: [],
};
