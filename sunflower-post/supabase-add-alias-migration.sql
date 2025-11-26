-- Migration: Add alias column to users table
-- This adds an alias field for anonymous posting

-- Add alias column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS alias TEXT NOT NULL DEFAULT 'Anonymous User';

-- Update existing users with random aliases (optional, can be done in app)
-- You can run this later to give existing users unique aliases
COMMENT ON COLUMN users.alias IS 'Anonymous display name shown when posting anonymously';
