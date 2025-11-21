"use client";

import Link from "next/link";
import { useState, useRef, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";
import { BouncyButton, ReactionBar } from "./ui";
import type { ReactionId } from "@/config/reactions";

type MusicMood = string;
type MoodFilter = "All moods" | MusicMood;
type EraFilter = "Any era" | string;
type SourceFilter = "Any source" | string;

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

const INITIAL_TRACKS: TrackItem[] = [
  {
    id: 1,
    title: "Say My Name",
    artist: "Destiny's Child",
    mood: "Nostalgia",
    era: "90s / 2000s",
    genre: "R&B / Pop",
    source: "Everywhere tbh",
    sharedBy: "S.",
    note: "Instant throwback energy. Great for cleaning or getting ready.",
    timeAgo: "Shared 3 days ago",
    replies: 3,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Ordinary People",
    artist: "John Legend",
    mood: "Cry then feel better",
    era: "2000s",
    genre: "Soul",
    source: "Spotify / YouTube",
    sharedBy: "Anon",
    note: "For when you're processing feelings and need a good reflective cry.",
    timeAgo: "Shared 1 week ago",
    replies: 1,
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
  },
];

const INITIAL_COMMENTS: Record<number, ThreadComment[]> = {
  1: [
    {
      id: 1,
      author: "You",
      body: "As soon as the beat drops I’m back in my childhood kitchen 😂",
      timeAgo: "2 days ago",
    },
  ],
  2: [],
  3: [],
};

export default function MusicRoom() {
  const [tracks, setTracks] = useState<TrackItem[]>(INITIAL_TRACKS);
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<MoodFilter>("All moods");
  const [eraFilter, setEraFilter] = useState<EraFilter>("Any era");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("Any source");

  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

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

  const filteredTracks = tracks.filter((track) => {
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
      ],
      search
    );
  });

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
    setPlaylist((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
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
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: MUSIC ROOM CONTENT */}
        <div className="md:col-span-3 space-y-8">
          {/* HEADER */}
          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 md:max-w-xl">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960] font-medium">
                  Room
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-yellow-900">
                  Music Room
                </h1>
                <p className="text-sm text-[#5C4A33] max-w-xl leading-relaxed">
                  Nostalgic tracks, feel-good songs and "this lives in my
                  bones" music. Share the songs that make cleaning easier,
                  walks brighter and hard days feel more human.
                </p>
              </div>

              {/* SEARCH BAR - Modernized */}
              <div className="flex items-center gap-2 bg-white border border-yellow-200/60 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-yellow-300/50 focus-within:border-yellow-300">
                <span className="text-base">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by song, artist, mood, era, genre…"
                  className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-[#C0A987]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <BouncyButton
                onClick={() => {
                  setShowAddForm((s) => !s);
                  setAddError(null);
                }}
                variant="primary"
                size="sm"
                className="shadow-md"
              >
                {showAddForm ? "Close add form" : "Add a song"}
              </BouncyButton>
            </div>
          </section>

          {/* ADD TRACK FORM */}
          {showAddForm && (
            <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-5 md:p-6 space-y-4 text-xs md:text-sm shadow-lg">
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
          <section className="grid lg:grid-cols-3 gap-6 text-xs">
            {/* TRACK LIST */}
            <div className="lg:col-span-2 space-y-4">
              {/* FILTERS */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {moodFilters.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setMoodFilter(mood)}
                      className={`px-3 py-1 rounded-full border text-[11px] ${
                        moodFilter === mood
                          ? "bg-yellow-100 border-yellow-200 text-[#5C4A33] font-medium"
                          : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={eraFilter}
                    onChange={(e) =>
                      setEraFilter(e.target.value as EraFilter)
                    }
                    className="border border-yellow-100 rounded-full px-2 py-1 bg-[#FFFEFA] text-[11px] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    {eraFilters.map((era) => (
                      <option key={era} value={era}>
                        {era === "Any era" ? "Any era" : era}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sourceFilter}
                    onChange={(e) =>
                      setSourceFilter(e.target.value as SourceFilter)
                    }
                    className="border border-yellow-100 rounded-full px-2 py-1 bg-[#FFFEFA] text-[11px] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    {sourceFilters.map((source) => (
                      <option key={source} value={source}>
                        {source === "Any source" ? "Any source" : source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TRACK CARDS */}
              <div className="space-y-4">
                {filteredTracks.length === 0 && (
                  <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-5 text-xs text-[#7A674C] shadow-sm">
                    <p className="font-semibold text-yellow-900 mb-1">
                      Nothing matches that (yet).
                    </p>
                    <p>
                      Try a different word or filter… or add the song you were
                      hoping to see. Someone else probably needs it too. 🌻
                    </p>
                  </div>
                )}

                {filteredTracks.map((track) => {
                  const trackReactions = reactions[track.id] || {};
                  const isInPlaylist = !!playlist[track.id];

                  return (
                    <article
                      key={track.id}
                      className="bg-gradient-to-br from-white to-yellow-50/20 border border-yellow-200/60 rounded-2xl p-5 space-y-3 shadow-md hover:shadow-xl hover:border-yellow-300/80 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Author Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(
                            track.sharedBy
                          )} flex items-center justify-center text-sm font-semibold text-[#3A2E1F] shadow-md flex-shrink-0 ring-2 ring-white`}
                        >
                          {getAuthorInitial(track.sharedBy)}
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
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
                              {track.note && (
                                <p className="text-xs text-[#5C4A33] mt-2 leading-relaxed">
                                  {track.note}
                                </p>
                              )}
                              {track.link && (
                                <a
                                  href={track.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-2 text-[11px] text-yellow-700 hover:text-yellow-900 font-medium hover:underline"
                                >
                                  <span>🎵</span>
                                  <span>Listen to song</span>
                                  <span>↗</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
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

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePlaylist(track.id)}
                            className={`px-3 py-1.5 rounded-xl border text-[10px] flex items-center gap-1 ${
                              isInPlaylist
                                ? "bg-[#E0F2FE] border-[#BFDBFE] text-[#1D4ED8]"
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

                          <Link
                            href={`/music-room/${track.id}`}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50 border border-yellow-200/80 text-xs font-semibold text-yellow-900 hover:text-yellow-950 transition-all hover:shadow-md hover:scale-105 active:scale-95"
                          >
                            <span>💬</span>
                            <span>{track.replies || 0} {track.replies === 1 ? 'comment' : 'comments'}</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                          </Link>
                        </div>
                      </div>

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
                </ul>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
