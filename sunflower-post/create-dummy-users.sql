-- Create 3 dummy users for testing followers/following
-- Password for all: "password123"
-- Bcrypt hash for "password123": $2b$10$YourBcryptHashHere

-- Dummy User 1: Sarah Garden
INSERT INTO users (
  id,
  name,
  email,
  password_hash,
  alias,
  bio,
  profile_picture,
  sunflower_color,
  theme_color,
  created_at
) VALUES (
  'a1b2c3d4-1111-1111-1111-111111111111',
  'Sarah Garden',
  'sarah@example.com',
  '$2b$10$rQKJVr4Y6Y0K6TzJb3Y0WuYJ9X8.0mYrQKJVr4Y6Y0K6TzJb3Y0Wu',
  'gardenqueen',
  '🌸 Plant mom • Nature lover • Finding joy in small things',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'pink',
  '#F472B6',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Dummy User 2: Alex Sunshine
INSERT INTO users (
  id,
  name,
  email,
  password_hash,
  alias,
  bio,
  profile_picture,
  sunflower_color,
  theme_color,
  created_at
) VALUES (
  'b2c3d4e5-2222-2222-2222-222222222222',
  'Alex Sunshine',
  'alex@example.com',
  '$2b$10$rQKJVr4Y6Y0K6TzJb3Y0WuYJ9X8.0mYrQKJVr4Y6Y0K6TzJb3Y0Wu',
  'sunnyalex',
  '☀️ Spreading positivity • Book enthusiast • Coffee addict',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'classic',
  '#FACC15',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Dummy User 3: Maya Bloom
INSERT INTO users (
  id,
  name,
  email,
  password_hash,
  alias,
  bio,
  profile_picture,
  sunflower_color,
  theme_color,
  badge,
  created_at
) VALUES (
  'c3d4e5f6-3333-3333-3333-333333333333',
  'Maya Bloom',
  'maya@example.com',
  '$2b$10$rQKJVr4Y6Y0K6TzJb3Y0WuYJ9X8.0mYrQKJVr4Y6Y0K6TzJb3Y0Wu',
  'mayabloom',
  '🌻 Artist • Mindfulness advocate • Living in the moment',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
  'purple',
  '#A78BFA',
  '✨ Creative Soul',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verify the users were created
SELECT id, name, alias, bio FROM users
WHERE id IN (
  'a1b2c3d4-1111-1111-1111-111111111111',
  'b2c3d4e5-2222-2222-2222-222222222222',
  'c3d4e5f6-3333-3333-3333-333333333333'
);
