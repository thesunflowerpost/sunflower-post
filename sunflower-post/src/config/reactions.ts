/**
 * Reactions Configuration
 *
 * Dopamine-safe, low-pressure reaction system for Sunflower Post.
 * Reactions are for care, not counts. Only the user sees what they've sent.
 */

export type ReactionId =
  // Core reactions (used in all rooms)
  | "sunburst"
  | "heart"
  | "withYou"
  | "shine"
  // Lounge extras
  | "softExhale"
  | "littleGrowth"
  | "gentleSmile"
  // Hope Bank extras
  | "hopeful"
  | "brighterDays"
  | "healing"
  // Music Room extras
  | "onRepeat"
  | "bigVibe"
  | "feltThat"
  | "instantMoodShift"
  | "dopamineHit"
  // Book Club extras
  | "bookmark"
  | "resonated"
  | "sameHere"
  | "tearUp"
  | "quotable"
  | "beautifully"
  // TV & Movies extras
  | "thisGotMe"
  | "shocked"
  | "cinematic"
  // Pinterest Wall extras
  | "beautiful"
  | "inspired"
  | "savedThis"
  // Solution Rooms extras
  | "helpful"
  | "holdingSpace"
  | "noted";

export interface ReactionDefinition {
  id: ReactionId;
  emoji: string;
  label: string;      // short, neutral e.g. "Warmth"
  tooltip?: string;   // optional slightly longer text
  // Visual theming (for Sunburst component)
  color?: string;
  bgColor?: string;
  borderColor?: string;
}

/**
 * Complete reaction definitions
 * Primary UI: emojis
 * Labels: short, neutral, optional (for tooltips/aria-labels)
 */
export const reactionDefinitions: Record<ReactionId, ReactionDefinition> = {
  // Core reactions (used in all rooms)
  sunburst: {
    id: "sunburst",
    emoji: "🌻",
    label: "Warmth",
    tooltip: "Send warmth",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  heart: {
    id: "heart",
    emoji: "❤️",
    label: "Love",
    tooltip: "Send love",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  withYou: {
    id: "withYou",
    emoji: "🤝",
    label: "With you",
    tooltip: "Here with you",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  shine: {
    id: "shine",
    emoji: "✨",
    label: "Shine",
    tooltip: "You shine",
    color: "text-blue-400",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },

  // Lounge extras
  softExhale: {
    id: "softExhale",
    emoji: "😌",
    label: "Soft exhale",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  littleGrowth: {
    id: "littleGrowth",
    emoji: "🌱",
    label: "Little growth",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  gentleSmile: {
    id: "gentleSmile",
    emoji: "😊",
    label: "Gentle smile",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },

  // Hope Bank extras
  hopeful: {
    id: "hopeful",
    emoji: "🌈",
    label: "Hopeful",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  brighterDays: {
    id: "brighterDays",
    emoji: "☀️",
    label: "Brighter days",
    color: "text-orange-400",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  healing: {
    id: "healing",
    emoji: "🌿",
    label: "Healing",
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
  },

  // Music Room extras
  onRepeat: {
    id: "onRepeat",
    emoji: "🔁",
    label: "On repeat",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  bigVibe: {
    id: "bigVibe",
    emoji: "🔥",
    label: "Big vibe",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  feltThat: {
    id: "feltThat",
    emoji: "😭",
    label: "Felt that",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  instantMoodShift: {
    id: "instantMoodShift",
    emoji: "🌈",
    label: "Instant mood shift",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  dopamineHit: {
    id: "dopamineHit",
    emoji: "⚡",
    label: "Dopamine hit",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },

  // Book Club extras
  bookmark: {
    id: "bookmark",
    emoji: "📑",
    label: "Bookmarked",
    tooltip: "Bookmarking this",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  resonated: {
    id: "resonated",
    emoji: "💫",
    label: "Resonated",
    tooltip: "This resonated",
    color: "text-purple-400",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  sameHere: {
    id: "sameHere",
    emoji: "🙋",
    label: "Same",
    tooltip: "I felt this too",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  tearUp: {
    id: "tearUp",
    emoji: "😢",
    label: "Hit hard",
    tooltip: "This hit hard",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
  },
  quotable: {
    id: "quotable",
    emoji: "✍️",
    label: "Quotable",
    tooltip: "So quotable",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  beautifully: {
    id: "beautifully",
    emoji: "🌸",
    label: "Beautifully said",
    tooltip: "Beautifully said",
    color: "text-pink-400",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },

  // TV & Movies extras
  thisGotMe: {
    id: "thisGotMe",
    emoji: "😂",
    label: "This got me",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  shocked: {
    id: "shocked",
    emoji: "😮",
    label: "Shocked",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  cinematic: {
    id: "cinematic",
    emoji: "🎬",
    label: "Cinematic",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },

  // Pinterest Wall extras
  beautiful: {
    id: "beautiful",
    emoji: "🌼",
    label: "Beautiful",
    color: "text-pink-400",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  inspired: {
    id: "inspired",
    emoji: "🎨",
    label: "Inspired",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  savedThis: {
    id: "savedThis",
    emoji: "📸",
    label: "Saved this",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
  },

  // Solution Rooms extras
  helpful: {
    id: "helpful",
    emoji: "🧩",
    label: "Helpful",
    color: "text-indigo-400",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  holdingSpace: {
    id: "holdingSpace",
    emoji: "🫶",
    label: "Holding space",
    color: "text-rose-400",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  noted: {
    id: "noted",
    emoji: "📝",
    label: "Noted",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
};

/**
 * Room-to-reactions mapping
 * Defines which reactions are available in each room
 */
export const roomReactions: Record<string, ReactionId[]> = {
  lounge: [
    "sunburst",
    "heart",
    "withYou",
    "shine",
    "softExhale",
    "littleGrowth",
    "gentleSmile",
  ],
  hopeBank: [
    "sunburst",
    "heart",
    "withYou",
    "shine",
    "hopeful",
    "brighterDays",
    "healing",
  ],
  musicRoom: [
    "onRepeat",
    "bigVibe",
    "feltThat",
    "instantMoodShift",
    "dopamineHit",
  ],
  bookClub: [
    "bookmark",
    "resonated",
    "sameHere",
    "tearUp",
    "quotable",
    "beautifully",
    "sunburst",
    "heart",
  ],
  tvAndMovies: [
    "sunburst",
    "heart",
    "withYou",
    "shine",
    "thisGotMe",
    "shocked",
    "cinematic",
  ],
  pinterestWall: [
    "sunburst",
    "heart",
    "withYou",
    "shine",
    "beautiful",
    "inspired",
    "savedThis",
  ],
  solutionRooms: [
    "sunburst",
    "heart",
    "withYou",
    "shine",
    "helpful",
    "holdingSpace",
    "noted",
  ],
};

/**
 * Helper: Get reaction definitions for a specific room
 */
export function getReactionsForRoom(roomId: string): ReactionDefinition[] {
  const reactionIds = roomReactions[roomId] || roomReactions.lounge;
  return reactionIds.map((id) => reactionDefinitions[id]);
}

/**
 * Helper: Get a single reaction definition by ID
 */
export function getReaction(id: ReactionId): ReactionDefinition {
  return reactionDefinitions[id];
}
