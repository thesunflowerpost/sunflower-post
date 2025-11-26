-- Migration: Add anonymous posting support
-- This migration adds user_id and is_anonymous fields to discussions and replies

-- =============================================================================
-- 1. ADD FIELDS TO EXISTING TV MOVIE TABLES
-- =============================================================================

-- Add user_id and is_anonymous to tv_movie_discussions
ALTER TABLE tv_movie_discussions
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;

-- Add user_id and is_anonymous to tv_movie_replies
ALTER TABLE tv_movie_replies
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tv_movie_discussions_user_id ON tv_movie_discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_tv_movie_replies_user_id ON tv_movie_replies(user_id);

-- =============================================================================
-- 2. CREATE BOOK DISCUSSION TABLES (They don't exist yet)
-- =============================================================================

-- Book discussions table
CREATE TABLE IF NOT EXISTS book_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT false,
  image_url TEXT,
  gif_url TEXT,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book replies table
CREATE TABLE IF NOT EXISTS book_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES book_discussions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT false,
  body TEXT NOT NULL,
  image_url TEXT,
  gif_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book discussion reactions table
CREATE TABLE IF NOT EXISTS book_discussion_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES book_discussions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(discussion_id, user_id, reaction_id)
);

-- Book reply reactions table
CREATE TABLE IF NOT EXISTS book_reply_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reply_id UUID REFERENCES book_replies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reply_id, user_id, reaction_id)
);

-- =============================================================================
-- 3. CREATE INDEXES FOR BOOK DISCUSSION TABLES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_book_discussions_book_id ON book_discussions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_discussions_user_id ON book_discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_book_discussions_created_at ON book_discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_replies_discussion_id ON book_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_book_replies_user_id ON book_replies(user_id);

-- =============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE book_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_discussion_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reply_reactions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. CREATE RLS POLICIES
-- =============================================================================

-- Book discussions
CREATE POLICY "Anyone can read book discussions" ON book_discussions FOR SELECT USING (true);
CREATE POLICY "Anyone can create book discussions" ON book_discussions FOR INSERT WITH CHECK (true);

-- Book replies
CREATE POLICY "Anyone can read book replies" ON book_replies FOR SELECT USING (true);
CREATE POLICY "Anyone can create book replies" ON book_replies FOR INSERT WITH CHECK (true);

-- Book discussion reactions
CREATE POLICY "Anyone can read book discussion reactions" ON book_discussion_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can create book discussion reactions" ON book_discussion_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete book discussion reactions" ON book_discussion_reactions FOR DELETE USING (true);

-- Book reply reactions
CREATE POLICY "Anyone can read book reply reactions" ON book_reply_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can create book reply reactions" ON book_reply_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete book reply reactions" ON book_reply_reactions FOR DELETE USING (true);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON COLUMN tv_movie_discussions.user_id IS 'The actual user who created this discussion';
COMMENT ON COLUMN tv_movie_discussions.is_anonymous IS 'Whether to display with user alias instead of real name';
COMMENT ON COLUMN tv_movie_replies.user_id IS 'The actual user who created this reply';
COMMENT ON COLUMN tv_movie_replies.is_anonymous IS 'Whether to display with user alias instead of real name';

COMMENT ON COLUMN book_discussions.user_id IS 'The actual user who created this discussion';
COMMENT ON COLUMN book_discussions.is_anonymous IS 'Whether to display with user alias instead of real name';
COMMENT ON COLUMN book_replies.user_id IS 'The actual user who created this reply';
COMMENT ON COLUMN book_replies.is_anonymous IS 'Whether to display with user alias instead of real name';
