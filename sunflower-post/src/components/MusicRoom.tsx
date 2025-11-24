"use client";

import Link from "next/link";
import { useState, useRef, type FormEvent, useEffect } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";
import { BouncyButton, ReactionBar } from "./ui";
import type { ReactionId } from "@/config/reactions";

type MusicMood = string;
type MoodFilter = "All moods" | MusicMood;
type EraFilter = "Any era" | string;
type SourceFilter = "Any source" | string;
type ActivityTag = string;
type SortOption = "newest" | "most_commented" | "random" | "popular";

type TrackItem = {
  id: number;
  title: string;
  artist: string;
  mood: MusicMood;
  era?: string;
  genre?: string;
  source?: string; // e.g. Spotify, YouTube, Apple Music
  link?: string; // Link to song/album
  sharedBy: string;
  note?: string;
  timeAgo: string;
  imageUrl?: string; // Album art or uploaded image
  replies?: number; // Number of comments/replies
  activities?: ActivityTag[]; // Activity tags like "Workout", "Cleaning", etc.
  favoriteLyric?: string; // Favorite lyric from the song
  playlistAdds?: number; // How many people added to their playlist
  timestamp?: number; // For sorting
};

// User reactions are now stored as Record<ReactionId, boolean>
type TrackReactions = Record<ReactionId, boolean>;

type ThreadComment = {
  id: number;
  author: string;
  body: string;
  timeAgo: string;
};

const BASE_MOODS: MusicMood[] = [
  "Nostalgia",
  "Feel-good",
  "Soft background",
  "Big main character energy",
  "Cry then feel better",
  "Other",
];

const ACTIVITY_TAGS = [
  { id: "workout", label: "Workout", emoji: "🏃" },
  { id: "cleaning", label: "Cleaning", emoji: "🧹" },
  { id: "study", label: "Study/Focus", emoji: "📚" },
  { id: "roadtrip", label: "Road trip", emoji: "🚗" },
  { id: "latenight", label: "Late night", emoji: "🌙" },
  { id: "morning", label: "Morning energy", emoji: "☕" },
  { id: "walking", label: "Walking", emoji: "🚶" },
  { id: "cooking", label: "Cooking", emoji: "🍳" },
];

const INITIAL_TRACKS: TrackItem[] = [
  {
    id: 1,
    title: "Say My Name",
    artist: "Destiny's Child",
    mood: "Nostalgia",
    era: "90s / 2000s",
    genre: "R&B / Pop",
    source: "Everywhere tbh",
    link: "https://www.youtube.com/watch?v=sQgd6MccwZc",
    sharedBy: "S.",
    note: "Instant throwback energy. Great for cleaning or getting ready.",
    timeAgo: "Shared 3 days ago",
    replies: 3,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    activities: ["cleaning", "morning"],
    favoriteLyric: "Say my name, say my name...",
    playlistAdds: 12,
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2,
    title: "Ordinary People",
    artist: "John Legend",
    mood: "Cry then feel better",
    era: "2000s",
    genre: "Soul",
    source: "Spotify / YouTube",
    link: "https://open.spotify.com/track/6mFkJmJqdDVQ1REhVfGgd1",
    sharedBy: "Anon",
    note: "For when you're processing feelings and need a good reflective cry.",
    timeAgo: "Shared 1 week ago",
    replies: 1,
    activities: ["latenight"],
    favoriteLyric: "We're just ordinary people...",
    playlistAdds: 8,
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 3,
    title: "Just Fine",
    artist: "Mary J. Blige",
    mood: "Feel-good",
    era: "2000s",
    genre: "R&B",
    source: "Spotify / Apple Music",
    sharedBy: "Jay",
    note: "Instant mood lift. Walking anthem when you need to remember you're actually that girl.",
    timeAgo: "Shared 2 weeks ago",
    replies: 0,
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
    activities: ["walking", "morning", "workout"],
    favoriteLyric: "I'm going to be just fine...",
    playlistAdds: 15,
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
];

const INITIAL_COMMENTS: Record<number, ThreadComment[]> = {
  1: [
    {
      id: 1,
      author: "You",
      body: "As soon as the beat drops I'm back in my childhood kitchen 😂",
      timeAgo: "2 days ago",
    },
  ],
  2: [],
  3: [],
};

// Helper function to extract embeddable music URLs
function getEmbedUrl(link: string): { type: 'spotify' | 'youtube' | 'apple' | null; embedUrl: string | null } {
  if (!link) return { type: null, embedUrl: null };

  // Spotify
  const spotifyMatch = link.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return {
      type: 'spotify',
      embedUrl: `https://open.spotify.com/embed/track/${spotifyMatch[1]}?utm_source=generator&theme=0`,
    };
  }

  // YouTube
  const youtubeMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  // Apple Music
  const appleMusicMatch = link.match(/music\.apple\.com\/[a-z]{2}\/album\/[^/]+\/(\d+)\?i=(\d+)/);
  if (appleMusicMatch) {
    return {
      type: 'apple',
      embedUrl: link,
    };
  }

  return { type: null, embedUrl: null };
}

// Get time-based recommendation
function getTimeBasedRecommendation(): { time: string; emoji: string; mood: string; description: string } {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return {
      time: "Morning",
      emoji: "☕",
      mood: "Morning energy",
      description: "Start your day with uplifting, energizing tracks",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      time: "Afternoon",
      emoji: "☀️",
      mood: "Feel-good",
      description: "Keep the momentum with feel-good vibes",
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      time: "Evening",
      emoji: "🌆",
      mood: "Soft background",
      description: "Wind down with relaxing, mellow tunes",
    };
  } else {
    return {
      time: "Late Night",
      emoji: "🌙",
      mood: "Cry then feel better",
      description: "Reflective tracks for those deep night feels",
    };
  }
}

// Find similar tracks based on mood, genre, and activities
function findSimilarTracks(track: TrackItem, allTracks: TrackItem[]): TrackItem[] {
  return allTracks
    .filter((t) => t.id !== track.id)
    .map((t) => {
      let score = 0;
      // Same mood
      if (t.mood === track.mood) score += 3;
      // Same genre
      if (t.genre && track.genre && t.genre === track.genre) score += 2;
      // Shared activities
      const sharedActivities = (t.activities || []).filter((a) =>
        (track.activities || []).includes(a)
      );
      score += sharedActivities.length;
      // Same era
      if (t.era && track.era && t.era === track.era) score += 1;

      return { track: t, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ track }) => track);
}

export default function MusicRoom() {
  const [tracks, setTracks] = useState<TrackItem[]>(INITIAL_TRACKS);
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<MoodFilter>("All moods");
  const [eraFilter, setEraFilter] = useState<EraFilter>("Any era");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("Any source");
  const [activityFilter, setActivityFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);
  const [showSimilarFor, setShowSimilarFor] = useState<number | null>(null);

  const [newTrack, setNewTrack] = useState({
    title: "",
    artist: "",
    mood: "Feel-good" as MusicMood,
    era: "",
    genre: "",
    source: "",
    link: "",
    note: "",
    sharedBy: "",
    isAnon: false,
    activities: [] as string[],
    favoriteLyric: "",
  });

  // Image upload state
  const [trackMediaUrl, setTrackMediaUrl] = useState("");
  const [trackFilePreviewUrl, setTrackFilePreviewUrl] = useState<string | null>(null);
  const [showTrackUrlInput, setShowTrackUrlInput] = useState(false);
  const trackFileInputRef = useRef<HTMLInputElement>(null);

  // per-track reactions for this viewer
  const [reactions, setReactions] = useState<Record<number, TrackReactions>>({});
  // per-track comments
  const [comments, setComments] =
    useState<Record<number, ThreadComment[]>>(INITIAL_COMMENTS);
  // open thread
  const [openTrackId, setOpenTrackId] = useState<number | null>(null);
  // comment drafts
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  // “My playlist” favourites (local only)
  const [playlist, setPlaylist] = useState<Record<number, boolean>>({});

  // derive unique moods / eras / sources from data
  const dynamicMoods = Array.from(
    new Set(tracks.map((t) => t.mood).filter(Boolean))
  ).filter((m) => !BASE_MOODS.includes(m));

  const moodFilters: MoodFilter[] = ["All moods", ...BASE_MOODS, ...dynamicMoods];

  const eras = Array.from(
    new Set(tracks.map((t) => t.era).filter(Boolean))
  ) as string[];
  const eraFilters: EraFilter[] = ["Any era", ...eras];

  const sources = Array.from(
    new Set(tracks.map((t) => t.source).filter(Boolean))
  ) as string[];
  const sourceFilters: SourceFilter[] = ["Any source", ...sources];

  const timeRecommendation = getTimeBasedRecommendation();

  let filteredTracks = tracks.filter((track) => {
    // mood filter
    const moodMatch =
      moodFilter === "All moods" || track.mood === moodFilter;
    if (!moodMatch) return false;

    // era filter
    const eraMatch =
      eraFilter === "Any era" || track.era === eraFilter;
    if (!eraMatch) return false;

    // source filter
    const sourceMatch =
      sourceFilter === "Any source" || track.source === sourceFilter;
    if (!sourceMatch) return false;

    // activity filter
    if (activityFilter && !(track.activities || []).includes(activityFilter)) {
      return false;
    }

    // search
    return matchesSearch(
      [
        track.title,
        track.artist,
        track.mood,
        track.genre || "",
        track.era || "",
        track.source || "",
        track.note || "",
        track.sharedBy,
        track.favoriteLyric || "",
        ...(track.activities || []),
      ],
      search
    );
  });

  // Apply sorting
  if (sortOption === "newest") {
    filteredTracks = [...filteredTracks].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } else if (sortOption === "most_commented") {
    filteredTracks = [...filteredTracks].sort((a, b) => (b.replies || 0) - (a.replies || 0));
  } else if (sortOption === "popular") {
    filteredTracks = [...filteredTracks].sort((a, b) => (b.playlistAdds || 0) - (a.playlistAdds || 0));
  } else if (sortOption === "random") {
    filteredTracks = [...filteredTracks].sort(() => Math.random() - 0.5);
  }

  // Hidden gems: tracks with high quality (playlist adds) but few comments
  const hiddenGems = [...tracks]
    .filter((t) => (t.playlistAdds || 0) > 5 && (t.replies || 0) < 3)
    .sort((a, b) => (b.playlistAdds || 0) - (a.playlistAdds || 0))
    .slice(0, 3);

  function moodEmoji(mood: MusicMood) {
    const lower = mood.toLowerCase();
    if (lower.includes("nostalgia")) return "📼";
    if (lower.includes("feel-good") || lower.includes("feel good")) return "🌞";
    if (lower.includes("soft background")) return "☁️";
    if (lower.includes("main character")) return "✨";
    if (lower.includes("cry")) return "😭";
    return "🎵";
  }

  // Helper to get author initials
  function getAuthorInitial(author: string): string {
    return author.charAt(0).toUpperCase();
  }

  // Helper to get avatar color based on author name
  function getAvatarColor(author: string): string {
    const colors = [
      "bg-gradient-to-br from-yellow-200 to-amber-300",
      "bg-gradient-to-br from-rose-200 to-pink-300",
      "bg-gradient-to-br from-blue-200 to-indigo-300",
      "bg-gradient-to-br from-green-200 to-emerald-300",
      "bg-gradient-to-br from-purple-200 to-violet-300",
    ];
    const index = author.length % colors.length;
    return colors[index];
  }

  function handleTrackFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setTrackFilePreviewUrl(url);
    setTrackMediaUrl("");
  }

  function toggleReaction(trackId: number, reactionId: ReactionId, active: boolean) {
    setReactions((prev) => {
      const current = prev[trackId] || {};
      return {
        ...prev,
        [trackId]: {
          ...current,
          [reactionId]: active,
        },
      };
    });
  }

  function togglePlaylist(trackId: number) {
    const wasInPlaylist = playlist[trackId];

    setPlaylist((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));

    // Update playlistAdds count
    setTracks((prev) =>
      prev.map((t) =>
        t.id === trackId
          ? { ...t, playlistAdds: (t.playlistAdds || 0) + (wasInPlaylist ? -1 : 1) }
          : t
      )
    );
  }

  function handleSurpriseMe() {
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    setMoodFilter(randomTrack.mood);
    setActivityFilter(null);
    setSearch("");
    setSortOption("random");
  }

  function exportPlaylist() {
    const playlistTracks = tracks.filter((t) => playlist[t.id]);
    const playlistText = playlistTracks
      .map((t) => `${t.title} - ${t.artist}${t.link ? ` (${t.link})` : ""}`)
      .join("\n");

    const blob = new Blob([playlistText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sunflower-music-playlist.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleAddTrack(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null);

    const title = newTrack.title.trim();
    const artist = newTrack.artist.trim();

    if (!title || !artist) return;

    // simple duplicate check (title + artist)
    const exists = tracks.some(
      (t) =>
        t.title.trim().toLowerCase() === title.toLowerCase() &&
        t.artist.trim().toLowerCase() === artist.toLowerCase()
    );

    if (exists) {
      setAddError(
        "This track is already in the room. You can always add a comment under it instead. 🌻"
      );
      return;
    }

    setSubmitting(true);

    const finalImageUrl = trackFilePreviewUrl || trackMediaUrl.trim() || undefined;

    const track: TrackItem = {
      id: tracks.length + 1,
      title,
      artist,
      mood: newTrack.mood.trim() || "Other",
      era: newTrack.era.trim() || undefined,
      genre: newTrack.genre.trim() || undefined,
      source: newTrack.source.trim() || undefined,
      link: newTrack.link.trim() || undefined,
      note: newTrack.note.trim() || undefined,
      sharedBy: newTrack.isAnon ? "Anon" : newTrack.sharedBy.trim() || "Anon",
      timeAgo: "Just now",
      imageUrl: finalImageUrl,
      replies: 0,
      activities: newTrack.activities.length > 0 ? newTrack.activities : undefined,
      favoriteLyric: newTrack.favoriteLyric.trim() || undefined,
      playlistAdds: 0,
      timestamp: Date.now(),
    };

    setTracks([track, ...tracks]);
    setComments((prev) => ({
      ...prev,
      [track.id]: [],
    }));

    setNewTrack({
      title: "",
      artist: "",
      mood: "Feel-good",
      era: "",
      genre: "",
      source: "",
      link: "",
      note: "",
      sharedBy: "",
      isAnon: false,
      activities: [],
      favoriteLyric: "",
    });
    setTrackMediaUrl("");
    setTrackFilePreviewUrl(null);
    setShowTrackUrlInput(false);

    setSubmitting(false);
    setShowAddForm(false);
  }

  function handleAddComment(trackId: number, e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = (commentDrafts[trackId] || "").trim();
    if (!body) return;

    setComments((prev) => {
      const existing = prev[trackId] || [];
      const nextId =
        existing.length > 0 ? existing[existing.length - 1].id + 1 : 1;

      const newComment: ThreadComment = {
        id: nextId,
        author: "You",
        body,
        timeAgo: "Just now",
      };

      return {
        ...prev,
        [trackId]: [...existing, newComment],
      };
    });

    setCommentDrafts((prev) => ({
      ...prev,
      [trackId]: "",
    }));
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white border-b border-[color:var(--border-medium)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
                <span>🎵</span>
                <span>Music Room</span>
              </h1>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                Nostalgic tracks, feel-good songs and "this lives in my bones" music. Share the songs that make cleaning easier, walks brighter and hard days feel more human.
              </p>
            </div>
            <button
              onClick={() => {
                setShowAddForm((s) => !s);
                setAddError(null);
              }}
              className="px-5 py-2.5 rounded-full bg-[#FFD52A] text-sm font-medium text-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-[#ffcc00] transition"
            >
              {showAddForm ? "Close" : "+ Add song"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="lg:w-64 flex-shrink-0">
            <CommunitySidebar
              filters={[
                {
                  title: "Mood / Vibe",
                  options: moodFilters.map((mood) => ({
                    label: mood,
                    value: mood,
                  })),
                  activeValue: moodFilter,
                  onChange: (value) => {
                    setMoodFilter(value as MoodFilter);
                    setActivityFilter(null);
                  },
                },
                {
                  title: "Activity",
                  options: [
                    { label: "All activities", value: "all" },
                    ...ACTIVITY_TAGS.map((activity) => ({
                      label: `${activity.emoji} ${activity.label}`,
                      value: activity.id,
                    })),
                  ],
                  activeValue: activityFilter || "all",
                  onChange: (value) => {
                    setActivityFilter(value === "all" ? null : value);
                    if (value !== "all") {
                      setMoodFilter("All moods");
                    }
                  },
                },
              ]}
            />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* SEARCH BAR */}
            <div className="mb-6">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by song, artist, mood, era, genre..."
                className="w-full rounded-2xl bg-white border border-[#E5E5EA] px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD52A]/60"
              />
            </div>

          {/* TIME-BASED RECOMMENDATION BANNER */}
          <section className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-yellow-300/60 rounded-2xl p-4 md:p-5 shadow-lg mb-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{timeRecommendation.emoji}</div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-semibold text-yellow-900">
                  {timeRecommendation.time} Vibes
                </h3>
                <p className="text-xs text-[#7A674C]">
                  {timeRecommendation.description}
                </p>
                <button
                  onClick={() => {
                    setMoodFilter(timeRecommendation.mood);
                    setActivityFilter(null);
                  }}
                  className="text-xs text-yellow-700 hover:text-yellow-900 font-medium underline underline-offset-2"
                >
                  Show {timeRecommendation.mood} tracks →
                </button>
              </div>
            </div>
          </section>

          {/* ADD TRACK FORM */}
          {showAddForm && (
            <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-5 md:p-6 space-y-4 text-xs md:text-sm shadow-lg mb-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-base font-semibold text-yellow-900">
                  Share a song for the room 🎧
                </p>
                <p className="text-[10px] text-[#A08960]">
                  The goal is vibes, not perfection. Old school, new school,
                  gospel, R&amp;B, whatever feels like sunshine.
                </p>
              </div>

              <form onSubmit={handleAddTrack} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Song title
                    </label>
                    <input
                      type="text"
                      value={newTrack.title}
                      onChange={(e) =>
                        setNewTrack((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="e.g. Just Fine"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Artist
                    </label>
                    <input
                      type="text"
                      value={newTrack.artist}
                      onChange={(e) =>
                        setNewTrack((prev) => ({
                          ...prev,
                          artist: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="e.g. Mary J. Blige"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Mood / vibe
                    </label>
                    <input
                      type="text"
                      value={newTrack.mood}
                      onChange={(e) =>
                        setNewTrack((prev) => ({
                          ...prev,
                          mood: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="e.g. Nostalgia, Feel-good, Soft background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Era (optional)
                    </label>
                    <input
                      type="text"
                      value={newTrack.era}
                      onChange={(e) =>
                        setNewTrack((prev) => ({
                          ...prev,
                          era: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="e.g. 90s, 2000s, 2010s"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Genre (optional)
                    </label>
                    <input
                      type="text"
                      value={newTrack.genre}
                      onChange={(e) =>
                        setNewTrack((prev) => ({
                          ...prev,
                          genre: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="e.g. R&B, Gospel, Afrobeats"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Where do you listen? (optional)
                    </label>
                    <input
                      type="text"
                      value={newTrack.source}
                      onChange={(e) =>
                        setNewTrack((prev) => ({
                          ...prev,
                          source: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="e.g. Spotify, YouTube, Apple Music"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Song link (optional)
                    </label>
                    <input
                      type="url"
                      value={newTrack.link}
                      onChange={(e) =>
                        setNewTrack((prev) => ({
                          ...prev,
                          link: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="Link to Spotify, YouTube, Apple Music…"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Why this song? (optional)
                  </label>
                  <textarea
                    value={newTrack.note}
                    onChange={(e) =>
                      setNewTrack((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-none"
                    placeholder="Is it a cleaning song, walk song, cry song, shower concert song…?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Favorite lyric (optional)
                  </label>
                  <input
                    type="text"
                    value={newTrack.favoriteLyric}
                    onChange={(e) =>
                      setNewTrack((prev) => ({
                        ...prev,
                        favoriteLyric: e.target.value,
                      }))
                    }
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                    placeholder="A line from the song that hits different…"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    When do you listen to this? (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ACTIVITY_TAGS.map((activity) => {
                      const isSelected = newTrack.activities.includes(activity.id);
                      return (
                        <button
                          key={activity.id}
                          type="button"
                          onClick={() => {
                            setNewTrack((prev) => ({
                              ...prev,
                              activities: isSelected
                                ? prev.activities.filter((a) => a !== activity.id)
                                : [...prev.activities, activity.id],
                            }));
                          }}
                          className={`px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-medium shadow-sm"
                              : "bg-white border-yellow-200 text-[#7A674C] hover:bg-yellow-50"
                          }`}
                        >
                          <span>{activity.emoji}</span>
                          <span>{activity.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* IMAGE UPLOAD SECTION */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Add album art or image (optional)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => trackFileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl border border-yellow-200 bg-white text-xs text-[#5C4A33] hover:bg-yellow-50 inline-flex items-center gap-1.5 transition-all"
                    >
                      <span>📷</span>
                      <span>Upload image</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowTrackUrlInput((s) => !s)}
                      className="px-3 py-2 rounded-xl border border-yellow-200 bg-white text-xs text-[#5C4A33] hover:bg-yellow-50 inline-flex items-center gap-1.5 transition-all"
                    >
                      <span>🎵</span>
                      <span>Add album art link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTrackMediaUrl("/music-placeholder.svg");
                        setTrackFilePreviewUrl(null);
                        setShowTrackUrlInput(false);
                      }}
                      className="px-3 py-2 rounded-xl border border-yellow-200 bg-white text-xs text-[#5C4A33] hover:bg-yellow-50 inline-flex items-center gap-1.5 transition-all"
                    >
                      <span>🌻</span>
                      <span>Use default image</span>
                    </button>

                    <span className="text-[10px] text-[#A08960]">
                      Perfect for adding atmosphere to your song share!
                    </span>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={trackFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleTrackFileChange}
                  />

                  {/* URL input */}
                  {showTrackUrlInput && (
                    <div className="space-y-1">
                      <input
                        type="url"
                        value={trackMediaUrl}
                        onChange={(e) => {
                          setTrackMediaUrl(e.target.value);
                          if (trackFilePreviewUrl) {
                            setTrackFilePreviewUrl(null);
                          }
                        }}
                        placeholder="Paste a link to album art (e.g. from Spotify, Apple Music, or direct image URL)"
                        className="w-full border border-yellow-200 rounded-xl px-4 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      />
                      <p className="text-[10px] text-[#A08960]">
                        Tip: Find album art on Spotify or Apple Music, right-click the image, and copy the image link.
                      </p>
                    </div>
                  )}

                  {/* PREVIEW */}
                  {(trackFilePreviewUrl || trackMediaUrl.trim()) && (
                    <div className="bg-white border border-yellow-200 rounded-xl p-3 flex items-start gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-yellow-50 flex items-center justify-center flex-shrink-0">
                        {trackFilePreviewUrl || trackMediaUrl.trim() ? (
                          <img
                            src={trackFilePreviewUrl || trackMediaUrl.trim()}
                            alt="Album art preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">🌻</span>
                        )}
                      </div>
                      <div className="flex-1 text-[10px] text-[#7A674C] space-y-1">
                        <p className="font-medium text-yellow-900">Image preview</p>
                        <p>
                          This will appear with your song. If it doesn&apos;t look right, you can change or clear it before posting.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Your name (or initials)
                    </label>
                    <input
                      type="text"
                      value={newTrack.sharedBy}
                      onChange={(e) =>
                        setNewTrack((prev) => ({
                          ...prev,
                          sharedBy: e.target.value,
                        }))
                      }
                      required={!newTrack.isAnon}
                      disabled={newTrack.isAnon}
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all disabled:bg-gray-50 disabled:text-gray-400"
                      placeholder='e.g. "Jay" or "J."'
                    />
                    <label className="inline-flex items-center gap-2 mt-2 text-xs text-[#7A674C]">
                      <input
                        type="checkbox"
                        checked={newTrack.isAnon}
                        onChange={(e) =>
                          setNewTrack((prev) => ({ ...prev, isAnon: e.target.checked }))
                        }
                        className="rounded border-yellow-300 text-yellow-500 focus:ring-yellow-300"
                      />
                      <span>Post anonymously (still linked to your account)</span>
                    </label>
                  </div>

                  <div className="space-y-2 text-xs text-[#7A674C] bg-yellow-50/50 rounded-xl p-4 border border-yellow-100">
                    <p className="font-medium text-yellow-900">Gentle boundaries</p>
                    <ul className="space-y-1">
                      <li>• Keep it kind and inclusive.</li>
                      <li>• Avoid lyrics/music that are hateful or explicitly violent.</li>
                      <li>
                        • If a song has heavy themes (grief, heartbreak), mention it gently in your note.
                      </li>
                    </ul>
                  </div>
                </div>

                {addError && (
                  <p className="text-[11px] text-[#B45309] bg-[#FFF7ED] border border-[#FED7AA] rounded-xl px-3 py-2">
                    {addError}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <BouncyButton
                    type="submit"
                    disabled={submitting || !newTrack.title.trim() || !newTrack.artist.trim()}
                    variant="primary"
                    size="sm"
                    className="shadow-md"
                  >
                    {submitting ? "Adding…" : "Add to Music Room"}
                  </BouncyButton>
                  <p className="text-[10px] text-[#A08960]">
                    Your post may be gently moderated for safety and tone.
                  </p>
                </div>
              </form>
            </section>
          )}

          {/* MAIN LAYOUT */}
          <section className="grid lg:grid-cols-3 gap-6 text-xs mt-6">
            {/* TRACK LIST */}
            <div className="lg:col-span-2 space-y-5">
              {/* SORT & DISCOVERY */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E5EA]">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-[11px] text-[#A08960] font-medium">Sort by:</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="border border-yellow-200 rounded-xl px-3 py-1.5 bg-white text-[11px] focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="most_commented">Most Commented</option>
                    <option value="popular">Most Popular</option>
                    <option value="random">Random</option>
                  </select>
                  <select
                    value={eraFilter}
                    onChange={(e) => setEraFilter(e.target.value as EraFilter)}
                    className="border border-yellow-200 rounded-xl px-3 py-1.5 bg-white text-[11px] focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
                  >
                    {eraFilters.map((era) => (
                      <option key={era} value={era}>
                        {era === "Any era" ? "Any era" : era}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
                    className="border border-yellow-200 rounded-xl px-3 py-1.5 bg-white text-[11px] focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
                  >
                    {sourceFilters.map((source) => (
                      <option key={source} value={source}>
                        {source === "Any source" ? "Any source" : source}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSurpriseMe}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-yellow-300 text-yellow-900 text-[11px] font-medium hover:shadow-md transition-all flex items-center gap-1"
                  >
                    <span>✨</span>
                    <span>Surprise Me</span>
                  </button>
                </div>
              </div>

              {/* TRACK CARDS */}
              <div className="space-y-5">
                {filteredTracks.length === 0 && (
                  <div className="bg-white border border-[#E5E5EA] rounded-2xl p-5 shadow-sm">
                    <p className="font-semibold text-[color:var(--text-primary)] mb-1">
                      Nothing matches that (yet).
                    </p>
                    <p className="text-xs text-[color:var(--text-secondary)]">
                      Try a different word or filter… or add the song you were
                      hoping to see. Someone else probably needs it too. 🌻
                    </p>
                  </div>
                )}

                {filteredTracks.map((track) => {
                  const trackReactions = reactions[track.id] || {};
                  const isInPlaylist = !!playlist[track.id];
                  const embedInfo = track.link ? getEmbedUrl(track.link) : { type: null, embedUrl: null };
                  const isPlayerExpanded = expandedPlayerId === track.id;
                  const similarTracks = showSimilarFor === track.id ? findSimilarTracks(track, tracks) : [];

                  return (
                    <article
                      key={track.id}
                      className="bg-white border-2 border-[#FFD52A] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        {/* Author Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(
                            track.sharedBy
                          )} flex items-center justify-center text-sm font-semibold text-[#3A2E1F] shadow-md flex-shrink-0 ring-2 ring-white`}
                        >
                          {getAuthorInitial(track.sharedBy)}
                        </div>

                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-[#5C4A33]">
                              {track.sharedBy}
                            </span>
                            <span className="text-[10px] text-[#A08960]">
                              {track.timeAgo}
                            </span>
                            <span className="flex items-center gap-1 text-[10px]">
                              <span>{moodEmoji(track.mood)}</span>
                              <span className="text-[#7A674C]">{track.mood}</span>
                            </span>
                            {track.era && (
                              <span className="px-2 py-[2px] rounded-full border border-yellow-100 bg-yellow-50 text-[#5C4A33] text-[10px]">
                                {track.era}
                              </span>
                            )}
                          </div>

                          {/* Activity Tags */}
                          {track.activities && track.activities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {track.activities.map((actId) => {
                                const activity = ACTIVITY_TAGS.find((a) => a.id === actId);
                                if (!activity) return null;
                                return (
                                  <span
                                    key={actId}
                                    className="px-2 py-1 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/60 text-[10px] text-orange-900 flex items-center gap-1"
                                  >
                                    <span>{activity.emoji}</span>
                                    <span>{activity.label}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          <div className="flex gap-3">
                            {/* Album art thumbnail */}
                            {track.imageUrl && (
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-yellow-50 border-2 border-yellow-100 flex-shrink-0 shadow-md">
                                <img
                                  src={track.imageUrl}
                                  alt={`Album art for ${track.title}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              <h2 className="text-base font-bold text-yellow-900 leading-snug">
                                {track.title}
                              </h2>
                              <p className="text-xs text-[#7A674C] mt-0.5">
                                {track.artist}
                                {track.genre && <span> · {track.genre}</span>}
                                {track.source && (
                                  <span>
                                    {" "}
                                    ·{" "}
                                    <span className="italic">
                                      {track.source}
                                    </span>
                                  </span>
                                )}
                              </p>

                              {/* Playlist Adds Count */}
                              {(track.playlistAdds || 0) > 0 && (
                                <p className="text-[10px] text-[#7A674C] mt-1 flex items-center gap-1">
                                  <span>🎧</span>
                                  <span>{track.playlistAdds} {track.playlistAdds === 1 ? 'person' : 'people'} added to playlist</span>
                                </p>
                              )}

                              {track.note && (
                                <p className="text-xs text-[#5C4A33] mt-2 leading-relaxed">
                                  {track.note}
                                </p>
                              )}

                              {/* Favorite Lyric */}
                              {track.favoriteLyric && (
                                <blockquote className="mt-2 pl-3 border-l-2 border-yellow-300 text-xs italic text-[#7A674C] leading-relaxed">
                                  "{track.favoriteLyric}"
                                </blockquote>
                              )}
                            </div>
                          </div>

                          {/* Embedded Music Player */}
                          {embedInfo.embedUrl && (
                            <div className="space-y-2">
                              <button
                                onClick={() => setExpandedPlayerId(isPlayerExpanded ? null : track.id)}
                                className="text-[11px] text-yellow-700 hover:text-yellow-900 font-medium underline underline-offset-2 flex items-center gap-1"
                              >
                                <span>🎵</span>
                                <span>{isPlayerExpanded ? 'Hide player' : 'Show player'}</span>
                              </button>
                              {isPlayerExpanded && (
                                <div className="w-full rounded-xl overflow-hidden shadow-lg border-2 border-yellow-200">
                                  {embedInfo.type === 'spotify' && (
                                    <iframe
                                      src={embedInfo.embedUrl}
                                      width="100%"
                                      height="152"
                                      frameBorder="0"
                                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                      loading="lazy"
                                    ></iframe>
                                  )}
                                  {embedInfo.type === 'youtube' && (
                                    <iframe
                                      width="100%"
                                      height="200"
                                      src={embedInfo.embedUrl}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    ></iframe>
                                  )}
                                  {embedInfo.type === 'apple' && (
                                    <div className="p-4 bg-white text-center">
                                      <a
                                        href={track.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-yellow-700 hover:text-yellow-900 font-medium"
                                      >
                                        Open in Apple Music →
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
                              {!isPlayerExpanded && track.link && (
                                <a
                                  href={track.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-yellow-700 hover:text-yellow-900 font-medium hover:underline"
                                >
                                  <span>🎵</span>
                                  <span>Listen to song</span>
                                  <span>↗</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4 border-t border-[#E5E5EA]">
                        {/* REACTIONS - Using ReactionBar with Music Room config */}
                        <div className="flex-1">
                          <ReactionBar
                            roomId="musicRoom"
                            postId={track.id}
                            reactions={trackReactions}
                            onReactionToggle={(reactionId, active) =>
                              toggleReaction(track.id, reactionId, active)
                            }
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePlaylist(track.id)}
                            className={`px-3 py-1.5 rounded-xl border text-[10px] flex items-center gap-1 transition-all ${
                              isInPlaylist
                                ? "bg-[#E0F2FE] border-[#BFDBFE] text-[#1D4ED8] shadow-sm"
                                : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                            }`}
                          >
                            <span>🎧</span>
                            <span>
                              {isInPlaylist
                                ? "In playlist"
                                : "Add to playlist"}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowSimilarFor(showSimilarFor === track.id ? null : track.id)}
                            className="px-3 py-1.5 rounded-xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-[10px] text-yellow-900 flex items-center gap-1 transition-all"
                          >
                            <span>✨</span>
                            <span>Similar vibes</span>
                          </button>

                          <Link
                            href={`/music-room/${track.id}`}
                            className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50 border border-yellow-200/80 text-[10px] md:text-xs font-semibold text-yellow-900 hover:text-yellow-950 transition-all hover:shadow-md hover:scale-105 active:scale-95"
                          >
                            <span>💬</span>
                            <span className="hidden sm:inline">{track.replies || 0} {track.replies === 1 ? 'comment' : 'comments'}</span>
                            <span className="sm:hidden">{track.replies || 0}</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                          </Link>
                        </div>
                      </div>

                      {/* Similar Vibes Section */}
                      {showSimilarFor === track.id && similarTracks.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 space-y-2">
                          <p className="text-xs font-semibold text-purple-900">Similar Vibes:</p>
                          <div className="space-y-2">
                            {similarTracks.map((similar) => (
                              <div key={similar.id} className="flex items-center gap-2 text-[11px]">
                                <span className="text-purple-600">•</span>
                                <span className="font-medium text-purple-900">{similar.title}</span>
                                <span className="text-purple-700">by {similar.artist}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-[9px] text-[#C0A987] italic">
                        Reactions &amp; playlist are just for you. No public
                        scores, just shared vibes.
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* SIDEBAR INFO - Modernized */}
            <aside className="space-y-4">
              {/* Hidden Gems */}
              {hiddenGems.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-yellow-300/60 rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💎</span>
                    <p className="text-xs font-semibold text-yellow-900">
                      Hidden Gems
                    </p>
                  </div>
                  <p className="text-[11px] text-[#7A674C]">
                    Loved by many, but quietly waiting to be discovered
                  </p>
                  <div className="space-y-2">
                    {hiddenGems.map((gem) => (
                      <button
                        key={gem.id}
                        onClick={() => {
                          setSearch(gem.title);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left p-2 rounded-lg bg-white/60 hover:bg-white border border-yellow-200 hover:border-yellow-300 transition-all group"
                      >
                        <p className="text-xs font-medium text-yellow-900 group-hover:text-yellow-950">
                          {gem.title}
                        </p>
                        <p className="text-[10px] text-[#7A674C]">
                          {gem.artist} · {gem.playlistAdds} adds
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-5 space-y-3 shadow-md">
                <p className="text-xs font-semibold text-yellow-900">
                  How people use this room
                </p>
                <ul className="space-y-2 text-xs text-[#7A674C]">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Build "I can't be bothered" playlists together</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Share nostalgia songs that feel like home</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Collect walking / cleaning / shower concert songs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Swap "I forgot about this banger" tracks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Discover new tracks through activity tags</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-yellow-200/60 rounded-2xl p-5 space-y-2 shadow-md">
                <p className="text-xs font-semibold text-yellow-900">
                  Gentle boundaries
                </p>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  Please avoid lyrics or visuals that are hateful or explicitly
                  violent. It&apos;s okay if songs have heavy themes – just flag them
                  gently in your note (e.g. grief, heartbreak, faith, etc.).
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 border border-orange-200/60 rounded-2xl p-5 space-y-3 shadow-md">
                <p className="text-xs font-semibold text-orange-900">
                  Stuck on what to add?
                </p>
                <ul className="space-y-2 text-xs text-[#6C4A33]">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">💭</span>
                    <span>"A song that always gets me out of bed…"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">💭</span>
                    <span>"The soundtrack to my healing era…"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">💭</span>
                    <span>"A song that makes cleaning less annoying…"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">💭</span>
                    <span>"My go-to workout hype track…"</span>
                  </li>
                </ul>
              </div>
            </aside>
          </section>
          </main>
        </div>
      </div>
    </div>
  );
}
