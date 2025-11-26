/**
 * Alias Generator
 *
 * Generates random, fun aliases for anonymous posting.
 * Format: [Adjective] [Noun]
 */

const adjectives = [
  'Cosmic', 'Dreamy', 'Velvet', 'Golden', 'Soft', 'Gentle', 'Warm', 'Cool',
  'Mystic', 'Radiant', 'Silent', 'Dancing', 'Wandering', 'Floating', 'Glowing',
  'Peaceful', 'Starlit', 'Cozy', 'Whispering', 'Serene', 'Tender', 'Quiet',
  'Hopeful', 'Bright', 'Calm', 'Sweet', 'Mellow', 'Dreaming', 'Thoughtful',
  'Curious', 'Gentle', 'Kind', 'Wise', 'Brave', 'Creative', 'Playful'
];

const nouns = [
  'Sunflower', 'Cloud', 'Breeze', 'Moon', 'Star', 'River', 'Ocean', 'Forest',
  'Garden', 'Meadow', 'Sky', 'Dawn', 'Dusk', 'Rain', 'Snow', 'Rose', 'Lily',
  'Butterfly', 'Bird', 'Deer', 'Fox', 'Wolf', 'Bear', 'Owl', 'Hawk', 'Dove',
  'Willow', 'Oak', 'Pine', 'Cedar', 'Maple', 'Cherry', 'Peach', 'Plum',
  'Petal', 'Leaf', 'Stone', 'Crystal', 'Feather', 'Wave', 'Flame', 'Echo'
];

/**
 * Generate a random alias in the format "Adjective Noun"
 * @returns A random alias string
 */
export function generateAlias(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}

/**
 * Generate multiple unique aliases
 * @param count Number of aliases to generate
 * @returns Array of unique alias strings
 */
export function generateUniqueAliases(count: number): string[] {
  const aliases = new Set<string>();

  while (aliases.size < count && aliases.size < adjectives.length * nouns.length) {
    aliases.add(generateAlias());
  }

  return Array.from(aliases);
}
