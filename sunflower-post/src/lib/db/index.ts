/**
 * Supabase Database Operations
 *
 * This module provides database operations using Supabase.
 * All functions maintain the same API interface as the previous JSON-based implementation.
 */

import { supabase } from '@/lib/supabase';
import type { User, Book, BookStatus, TVMovie, TVMovieStatus, TVMovieDiscussion, TVMovieReply } from './schema';

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapUserFromDb);
}

/**
 * Get a single user by ID
 */
export async function getUser(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data ? mapUserFromDb(data) : null;
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data ? mapUserFromDb(data) : null;
}

/**
 * Create a new user
 */
export async function createUser(
  user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
): Promise<User> {
  // Check if user already exists
  const existing = await getUserByEmail(user.email);
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{
      name: user.name,
      email: user.email.toLowerCase(),
      password_hash: user.passwordHash,
      profile_picture: user.profilePicture,
      sunflower_color: user.sunflowerColor || 'classic',
    }])
    .select()
    .single();

  if (error) throw error;
  return mapUserFromDb(data);
}

/**
 * Update an existing user
 */
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>>
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update({
      name: updates.name,
      profile_picture: updates.profilePicture,
      sunflower_color: updates.sunflowerColor,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data ? mapUserFromDb(data) : null;
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ============================================================================
// BOOK OPERATIONS
// ============================================================================

/**
 * Get all books
 */
export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapBookFromDb);
}

/**
 * Get a single book by ID
 */
export async function getBook(id: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data ? mapBookFromDb(data) : null;
}

/**
 * Create a new book
 */
export async function createBook(
  book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert([{
      title: book.title,
      author: book.author,
      status: book.status,
      mood: book.mood,
      theme: book.theme,
      format: book.format,
      shared_by: book.sharedBy,
      note: book.note,
      cover_url: book.coverUrl,
      link: book.link,
      discussion_count: book.discussionCount || 0,
    }])
    .select()
    .single();

  if (error) throw error;
  return mapBookFromDb(data);
}

/**
 * Update an existing book
 */
export async function updateBook(
  id: string,
  updates: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Book | null> {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.author !== undefined) updateData.author = updates.author;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.mood !== undefined) updateData.mood = updates.mood;
  if (updates.theme !== undefined) updateData.theme = updates.theme;
  if (updates.format !== undefined) updateData.format = updates.format;
  if (updates.sharedBy !== undefined) updateData.shared_by = updates.sharedBy;
  if (updates.note !== undefined) updateData.note = updates.note;
  if (updates.coverUrl !== undefined) updateData.cover_url = updates.coverUrl;
  if (updates.link !== undefined) updateData.link = updates.link;
  if (updates.discussionCount !== undefined) updateData.discussion_count = updates.discussionCount;

  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data ? mapBookFromDb(data) : null;
}

/**
 * Delete a book
 */
export async function deleteBook(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) throw error;
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
  const { error } = await supabase
    .from('user_book_statuses')
    .upsert({
      book_id: bookId,
      user_id: userId,
      status: status,
    }, {
      onConflict: 'book_id,user_id'
    });

  if (error) throw error;
}

/**
 * Get book status for a user
 */
export async function getUserBookStatus(
  bookId: string,
  userId: string
): Promise<BookStatus | null> {
  const { data, error } = await supabase
    .from('user_book_statuses')
    .select('status')
    .eq('book_id', bookId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data?.status as BookStatus || null;
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
  if (active) {
    // Add reaction
    const { error } = await supabase
      .from('book_reactions')
      .insert({
        book_id: bookId,
        user_id: userId,
        reaction_id: reactionId,
      });

    if (error && error.code !== '23505') { // Ignore duplicate key error
      throw error;
    }
  } else {
    // Remove reaction
    const { error } = await supabase
      .from('book_reactions')
      .delete()
      .eq('book_id', bookId)
      .eq('user_id', userId)
      .eq('reaction_id', reactionId);

    if (error) throw error;
  }
}

/**
 * Get all reactions for a user
 */
export async function getUserReactions(
  userId: string
): Promise<Record<string, Record<string, boolean>>> {
  const { data, error } = await supabase
    .from('book_reactions')
    .select('book_id, reaction_id')
    .eq('user_id', userId);

  if (error) throw error;

  const result: Record<string, Record<string, boolean>> = {};
  for (const reaction of data || []) {
    if (!result[reaction.book_id]) {
      result[reaction.book_id] = {};
    }
    result[reaction.book_id][reaction.reaction_id] = true;
  }

  return result;
}

// ============================================================================
// HELPER FUNCTIONS TO MAP DATABASE COLUMNS TO CAMELCASE
// ============================================================================

function mapUserFromDb(dbUser: any): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    passwordHash: dbUser.password_hash,
    profilePicture: dbUser.profile_picture,
    sunflowerColor: dbUser.sunflower_color,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  };
}

function mapBookFromDb(dbBook: any): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    status: dbBook.status,
    mood: dbBook.mood,
    theme: dbBook.theme,
    format: dbBook.format,
    sharedBy: dbBook.shared_by,
    note: dbBook.note,
    coverUrl: dbBook.cover_url,
    link: dbBook.link,
    discussionCount: dbBook.discussion_count,
    createdAt: dbBook.created_at,
    updatedAt: dbBook.updated_at,
  };
}

// ============================================================================
// TV MOVIE OPERATIONS (Stub implementations - can be expanded later)
// ============================================================================

export async function getTVMovies(): Promise<TVMovie[]> {
  const { data, error } = await supabase
    .from('tv_movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapTVMovieFromDb);
}

export async function getTVMovie(id: string): Promise<TVMovie | null> {
  const { data, error } = await supabase
    .from('tv_movies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data ? mapTVMovieFromDb(data) : null;
}

export async function createTVMovie(
  tvMovie: Omit<TVMovie, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TVMovie> {
  const { data, error } = await supabase
    .from('tv_movies')
    .insert([{
      title: tvMovie.title,
      type: tvMovie.type,
      status: tvMovie.status,
      mood: tvMovie.mood,
      genre: tvMovie.genre,
      era: tvMovie.era,
      platform: tvMovie.platform,
      note: tvMovie.note,
      shared_by: tvMovie.sharedBy,
      cover_url: tvMovie.coverUrl,
      trailer_url: tvMovie.trailerUrl,
      link: tvMovie.link,
      discussion_count: tvMovie.discussionCount || 0,
    }])
    .select()
    .single();

  if (error) throw error;
  return mapTVMovieFromDb(data);
}

export async function updateTVMovie(
  id: string,
  updates: Partial<Omit<TVMovie, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<TVMovie | null> {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.mood !== undefined) updateData.mood = updates.mood;
  if (updates.genre !== undefined) updateData.genre = updates.genre;
  if (updates.era !== undefined) updateData.era = updates.era;
  if (updates.platform !== undefined) updateData.platform = updates.platform;
  if (updates.note !== undefined) updateData.note = updates.note;
  if (updates.sharedBy !== undefined) updateData.shared_by = updates.sharedBy;
  if (updates.coverUrl !== undefined) updateData.cover_url = updates.coverUrl;
  if (updates.trailerUrl !== undefined) updateData.trailer_url = updates.trailerUrl;
  if (updates.link !== undefined) updateData.link = updates.link;
  if (updates.discussionCount !== undefined) updateData.discussion_count = updates.discussionCount;

  const { data, error } = await supabase
    .from('tv_movies')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data ? mapTVMovieFromDb(data) : null;
}

export async function deleteTVMovie(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('tv_movies')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function updateUserTVMovieStatus(
  tvMovieId: string,
  userId: string,
  status: TVMovieStatus
): Promise<void> {
  const { error } = await supabase
    .from('user_tv_movie_statuses')
    .upsert({
      tv_movie_id: tvMovieId,
      user_id: userId,
      status: status,
    }, {
      onConflict: 'tv_movie_id,user_id'
    });

  if (error) throw error;
}

export async function getUserTVMovieStatus(
  tvMovieId: string,
  userId: string
): Promise<TVMovieStatus | null> {
  const { data, error } = await supabase
    .from('user_tv_movie_statuses')
    .select('status')
    .eq('tv_movie_id', tvMovieId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data?.status as TVMovieStatus || null;
}

export async function toggleTVMovieReaction(
  tvMovieId: string,
  userId: string,
  reactionId: string,
  active: boolean
): Promise<void> {
  if (active) {
    const { error } = await supabase
      .from('tv_movie_reactions')
      .insert({
        tv_movie_id: tvMovieId,
        user_id: userId,
        reaction_id: reactionId,
      });

    if (error && error.code !== '23505') {
      throw error;
    }
  } else {
    const { error } = await supabase
      .from('tv_movie_reactions')
      .delete()
      .eq('tv_movie_id', tvMovieId)
      .eq('user_id', userId)
      .eq('reaction_id', reactionId);

    if (error) throw error;
  }
}

export async function getUserTVMovieReactions(
  userId: string
): Promise<Record<string, Record<string, boolean>>> {
  const { data, error } = await supabase
    .from('tv_movie_reactions')
    .select('tv_movie_id, reaction_id')
    .eq('user_id', userId);

  if (error) throw error;

  const result: Record<string, Record<string, boolean>> = {};
  for (const reaction of data || []) {
    if (!result[reaction.tv_movie_id]) {
      result[reaction.tv_movie_id] = {};
    }
    result[reaction.tv_movie_id][reaction.reaction_id] = true;
  }

  return result;
}

function mapTVMovieFromDb(dbTVMovie: any): TVMovie {
  return {
    id: dbTVMovie.id,
    title: dbTVMovie.title,
    type: dbTVMovie.type,
    status: dbTVMovie.status,
    mood: dbTVMovie.mood,
    genre: dbTVMovie.genre,
    era: dbTVMovie.era,
    platform: dbTVMovie.platform,
    note: dbTVMovie.note,
    sharedBy: dbTVMovie.shared_by,
    coverUrl: dbTVMovie.cover_url,
    trailerUrl: dbTVMovie.trailer_url,
    link: dbTVMovie.link,
    discussionCount: dbTVMovie.discussion_count,
    createdAt: dbTVMovie.created_at,
    updatedAt: dbTVMovie.updated_at,
  };
}

// Stub functions for TV movie discussions - can be implemented similarly
export async function getTVMovieDiscussions(tvMovieId: string): Promise<TVMovieDiscussion[]> {
  return []; // TODO: Implement
}

export async function getTVMovieDiscussion(id: string): Promise<TVMovieDiscussion | null> {
  return null; // TODO: Implement
}

export async function createTVMovieDiscussion(
  discussion: Omit<TVMovieDiscussion, 'id' | 'createdAt' | 'replyCount'>
): Promise<TVMovieDiscussion> {
  throw new Error('Not implemented');
}

export async function getTVMovieReplies(discussionId: string): Promise<TVMovieReply[]> {
  return []; // TODO: Implement
}

export async function createTVMovieReply(
  reply: Omit<TVMovieReply, 'id' | 'createdAt'>
): Promise<TVMovieReply> {
  throw new Error('Not implemented');
}

export async function toggleTVMovieDiscussionReaction(
  discussionId: string,
  userId: string,
  reactionId: string,
  active: boolean
): Promise<void> {
  // TODO: Implement
}

export async function getUserTVMovieDiscussionReactions(
  userId: string
): Promise<Record<string, Record<string, boolean>>> {
  return {}; // TODO: Implement
}

export async function toggleTVMovieReplyReaction(
  replyId: string,
  userId: string,
  reactionId: string,
  active: boolean
): Promise<void> {
  // TODO: Implement
}

export async function getUserTVMovieReplyReactions(
  userId: string
): Promise<Record<string, Record<string, boolean>>> {
  return {}; // TODO: Implement
}

export async function initializeDatabase(): Promise<void> {
  // No-op for Supabase - tables are created via SQL
  return;
}

// Export readDatabase for backward compatibility (though it's not used with Supabase)
export async function readDatabase() {
  throw new Error('readDatabase is not supported with Supabase. Use specific query functions instead.');
}
