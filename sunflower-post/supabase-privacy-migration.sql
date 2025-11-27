-- Migration: Add privacy and profile fields to users table
-- Run this in your Supabase SQL Editor after the main schema

-- Add new columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'followers_only', 'private')),
  ADD COLUMN IF NOT EXISTS follower_approval_required BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS default_anonymous_mode BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS activity_visible BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS data_export_enabled BOOLEAN DEFAULT true;

-- Add alias column for anonymous mode
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS alias TEXT;

-- Create function to generate a unique alias on user creation
CREATE OR REPLACE FUNCTION generate_user_alias()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.alias IS NULL THEN
    NEW.alias := 'sunflower' || substr(md5(random()::text), 1, 8);
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-generate alias
DROP TRIGGER IF EXISTS set_user_alias ON users;
CREATE TRIGGER set_user_alias
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION generate_user_alias();

-- Update existing users to have an alias if they don't have one
UPDATE users
SET alias = 'sunflower' || substr(md5(random()::text || id::text), 1, 8)
WHERE alias IS NULL;

-- Create followers table for managing follower relationships
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS on followers table
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- RLS policies for followers
CREATE POLICY "Anyone can read approved followers" ON followers
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can manage their own follower relationships" ON followers
  FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON followers(following_id);
CREATE INDEX IF NOT EXISTS idx_followers_status ON followers(status);

-- Comments for documentation
COMMENT ON COLUMN users.bio IS 'User profile bio (max 160 characters in app)';
COMMENT ON COLUMN users.profile_visibility IS 'Who can view the full profile: public, followers_only, or private';
COMMENT ON COLUMN users.follower_approval_required IS 'Whether follow requests need approval';
COMMENT ON COLUMN users.default_anonymous_mode IS 'Default posting mode preference';
COMMENT ON COLUMN users.activity_visible IS 'Whether activity feed is visible to others';
COMMENT ON COLUMN users.alias IS 'Unique anonymous identifier (e.g., sunflower12abc)';
