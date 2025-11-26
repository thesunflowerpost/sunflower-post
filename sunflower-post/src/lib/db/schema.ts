/**
 * Database Schema Definitions for Sunflower Post
 *
 * This defines the types and structure for our database.
 * Currently uses JSON file storage, but can be easily migrated to
 * PostgreSQL, MySQL, or any other database.
 */

export type BookStatus = "Reading" | "Finished" | "To read";

export type TVMovieStatus = "Watching" | "Watched" | "Want to watch";

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  alias: string; // Anonymous display name
  profilePicture?: string;
  sunflowerColor?: string;
  createdAt: string;
  updatedAt: string;
}

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
  userId: string; // The actual user who created this
  isAnonymous: boolean; // Whether to display with alias
  createdAt: string;
  replyCount: number;
}

export interface Reply {
  id: string;
  discussionId: string;
  userId: string; // The actual user who created this
  isAnonymous: boolean; // Whether to display with alias
  body: string;
  createdAt: string;
}

// TV & Movies types
export interface TVMovie {
  id: string;
  title: string;
  type: "TV series" | "Movie";
  status: TVMovieStatus;
  mood: string;
  genre?: string;
  era?: string;
  platform?: string;
  note?: string;
  sharedBy: string;
  coverUrl?: string;
  trailerUrl?: string;
  link?: string;
  discussionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TVMovieReaction {
  id: string;
  tvMovieId: string;
  userId: string;
  reactionId: string;
  createdAt: string;
}

export interface UserTVMovieStatus {
  id: string;
  tvMovieId: string;
  userId: string;
  status: TVMovieStatus;
  updatedAt: string;
}

export interface TVMovieDiscussion {
  id: string;
  tvMovieId: string;
  title: string;
  body: string;
  userId: string; // The actual user who created this
  isAnonymous: boolean; // Whether to display with alias
  isSpoiler?: boolean;
  imageUrl?: string;
  gifUrl?: string;
  createdAt: string;
  replyCount: number;
}

export interface TVMovieReply {
  id: string;
  discussionId: string;
  userId: string; // The actual user who created this
  isAnonymous: boolean; // Whether to display with alias
  body: string;
  isSpoiler?: boolean;
  imageUrl?: string;
  gifUrl?: string;
  createdAt: string;
}

export interface TVMovieDiscussionReaction {
  id: string;
  discussionId: string;
  userId: string;
  reactionId: string;
  createdAt: string;
}

export interface TVMovieReplyReaction {
  id: string;
  replyId: string;
  userId: string;
  reactionId: string;
  createdAt: string;
}

// Database collections
export interface Database {
  users: User[];
  books: Book[];
  reactions: BookReaction[];
  userBookStatuses: UserBookStatus[];
  discussions: Discussion[];
  replies: Reply[];
  tvMovies: TVMovie[];
  tvMovieReactions: TVMovieReaction[];
  userTVMovieStatuses: UserTVMovieStatus[];
  tvMovieDiscussions: TVMovieDiscussion[];
  tvMovieReplies: TVMovieReply[];
  tvMovieDiscussionReactions: TVMovieDiscussionReaction[];
  tvMovieReplyReactions: TVMovieReplyReaction[];
}

// Initial seed data
export const initialDatabase: Database = {
  users: [],
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
  tvMovies: [
    {
      id: "1",
      title: "Fleabag",
      type: "TV series",
      status: "Watched",
      mood: "Soft chaos",
      genre: "Comedy · Drama",
      era: "2016-2019",
      platform: "Prime Video",
      note: "Breaking the fourth wall never felt so raw and healing.",
      sharedBy: "Em",
      discussionCount: 0,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Past Lives",
      type: "Movie",
      status: "Watched",
      mood: "High drama",
      genre: "Romance · Drama",
      era: "2023",
      platform: "A24",
      note: "Made me think about all the versions of myself I could have been.",
      sharedBy: "Anon",
      discussionCount: 0,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "The Bear",
      type: "TV series",
      status: "Watching",
      mood: "High drama",
      genre: "Drama · Comedy",
      era: "2022-present",
      platform: "Hulu",
      note: "Stressful but oddly comforting? The kitchen chaos hits different.",
      sharedBy: "S.",
      discussionCount: 0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  tvMovieReactions: [],
  userTVMovieStatuses: [],
  tvMovieDiscussions: [],
  tvMovieReplies: [],
  tvMovieDiscussionReactions: [],
  tvMovieReplyReactions: [],
};
