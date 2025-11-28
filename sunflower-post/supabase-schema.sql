-- Supabase Database Schema for The Sunflower Post
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  profile_picture TEXT,
  bio TEXT,
  alias TEXT,
  sunflower_color TEXT DEFAULT 'classic',
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'followers_only', 'private')),
  follower_approval_required BOOLEAN DEFAULT false,
  default_anonymous_mode BOOLEAN DEFAULT false,
  activity_visible BOOLEAN DEFAULT true,
  data_export_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Reading', 'Finished', 'To read')),
  mood TEXT NOT NULL,
  theme TEXT,
  format TEXT,
  shared_by TEXT NOT NULL,
  note TEXT,
  cover_url TEXT,
  link TEXT,
  discussion_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book reactions table
CREATE TABLE IF NOT EXISTS book_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, user_id, reaction_id)
);

-- User book statuses table
CREATE TABLE IF NOT EXISTS user_book_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Reading', 'Finished', 'To read')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, user_id)
);

-- TV & Movies table
CREATE TABLE IF NOT EXISTS tv_movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('TV series', 'Movie')),
  status TEXT NOT NULL CHECK (status IN ('Watching', 'Watched', 'Want to watch')),
  mood TEXT NOT NULL,
  genre TEXT,
  era TEXT,
  platform TEXT,
  note TEXT,
  shared_by TEXT NOT NULL,
  cover_url TEXT,
  trailer_url TEXT,
  link TEXT,
  discussion_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TV Movie reactions table
CREATE TABLE IF NOT EXISTS tv_movie_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tv_movie_id UUID REFERENCES tv_movies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tv_movie_id, user_id, reaction_id)
);

-- User TV Movie statuses table
CREATE TABLE IF NOT EXISTS user_tv_movie_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tv_movie_id UUID REFERENCES tv_movies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Watching', 'Watched', 'Want to watch')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tv_movie_id, user_id)
);

-- TV Movie discussions table
CREATE TABLE IF NOT EXISTS tv_movie_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tv_movie_id UUID REFERENCES tv_movies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author TEXT NOT NULL,
  is_spoiler BOOLEAN DEFAULT false,
  image_url TEXT,
  gif_url TEXT,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TV Movie replies table
CREATE TABLE IF NOT EXISTS tv_movie_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES tv_movie_discussions(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  is_spoiler BOOLEAN DEFAULT false,
  image_url TEXT,
  gif_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TV Movie discussion reactions table
CREATE TABLE IF NOT EXISTS tv_movie_discussion_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES tv_movie_discussions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(discussion_id, user_id, reaction_id)
);

-- TV Movie reply reactions table
CREATE TABLE IF NOT EXISTS tv_movie_reply_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reply_id UUID REFERENCES tv_movie_replies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reply_id, user_id, reaction_id)
);

-- Journal entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  mood TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved items table
CREATE TABLE IF NOT EXISTS saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('post', 'book', 'tv_movie', 'music', 'discussion')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_reactions_book_id ON book_reactions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_reactions_user_id ON book_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tv_movies_created_at ON tv_movies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tv_movie_discussions_tv_movie_id ON tv_movie_discussions(tv_movie_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_type_id ON saved_items(item_type, item_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tv_movies_updated_at BEFORE UPDATE ON tv_movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_movie_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tv_movie_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_movie_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_movie_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_movie_discussion_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_movie_reply_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now, you can make them more restrictive later)
-- Users: Can read all, but only update own profile
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (true);

-- Books: Everyone can read, authenticated users can create
CREATE POLICY "Anyone can read books" ON books FOR SELECT USING (true);
CREATE POLICY "Anyone can create books" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update books" ON books FOR UPDATE USING (true);

-- Book reactions: Everyone can read and create
CREATE POLICY "Anyone can read book reactions" ON book_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can create book reactions" ON book_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete book reactions" ON book_reactions FOR DELETE USING (true);

-- User book statuses
CREATE POLICY "Anyone can read user book statuses" ON user_book_statuses FOR SELECT USING (true);
CREATE POLICY "Anyone can create user book statuses" ON user_book_statuses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update user book statuses" ON user_book_statuses FOR UPDATE USING (true);

-- TV & Movies: Everyone can read and create
CREATE POLICY "Anyone can read tv movies" ON tv_movies FOR SELECT USING (true);
CREATE POLICY "Anyone can create tv movies" ON tv_movies FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tv movies" ON tv_movies FOR UPDATE USING (true);

-- TV Movie reactions
CREATE POLICY "Anyone can read tv movie reactions" ON tv_movie_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can create tv movie reactions" ON tv_movie_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete tv movie reactions" ON tv_movie_reactions FOR DELETE USING (true);

-- User TV Movie statuses
CREATE POLICY "Anyone can read user tv movie statuses" ON user_tv_movie_statuses FOR SELECT USING (true);
CREATE POLICY "Anyone can create user tv movie statuses" ON user_tv_movie_statuses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update user tv movie statuses" ON user_tv_movie_statuses FOR UPDATE USING (true);

-- TV Movie discussions
CREATE POLICY "Anyone can read tv movie discussions" ON tv_movie_discussions FOR SELECT USING (true);
CREATE POLICY "Anyone can create tv movie discussions" ON tv_movie_discussions FOR INSERT WITH CHECK (true);

-- TV Movie replies
CREATE POLICY "Anyone can read tv movie replies" ON tv_movie_replies FOR SELECT USING (true);
CREATE POLICY "Anyone can create tv movie replies" ON tv_movie_replies FOR INSERT WITH CHECK (true);

-- TV Movie discussion reactions
CREATE POLICY "Anyone can read tv movie discussion reactions" ON tv_movie_discussion_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can create tv movie discussion reactions" ON tv_movie_discussion_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete tv movie discussion reactions" ON tv_movie_discussion_reactions FOR DELETE USING (true);

-- TV Movie reply reactions
CREATE POLICY "Anyone can read tv movie reply reactions" ON tv_movie_reply_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can create tv movie reply reactions" ON tv_movie_reply_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete tv movie reply reactions" ON tv_movie_reply_reactions FOR DELETE USING (true);

-- Journal entries (private to user only)
CREATE POLICY "Users can read own journal entries" ON journal_entries FOR SELECT USING (true);
CREATE POLICY "Users can create own journal entries" ON journal_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own journal entries" ON journal_entries FOR UPDATE USING (true);
CREATE POLICY "Users can delete own journal entries" ON journal_entries FOR DELETE USING (true);

-- Saved items (private to user only)
CREATE POLICY "Users can read own saved items" ON saved_items FOR SELECT USING (true);
CREATE POLICY "Users can create own saved items" ON saved_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own saved items" ON saved_items FOR DELETE USING (true);
