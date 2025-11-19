"use client";

import { useState, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";
import { ReactionBar } from "./ui";
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
  sharedBy: string;
  note?: string;
  timeAgo: string;
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
    artist: "Destiny’s Child",
    mood: "Nostalgia",
    era: "90s / 2000s",
    genre: "R&B / Pop",
    source: "Everywhere tbh",
    sharedBy: "S.",
    note: "Instant throwback energy. Great for cleaning or getting ready.",
    timeAgo: "Shared 3 days ago",
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
    note: "For when you’re processing feelings and need a good reflective cry.",
    timeAgo: "Shared 1 week ago",
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
    note: "Instant mood lift. Walking anthem when you need to remember you’re actually that girl.",
    timeAgo: "Shared 2 weeks ago",
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
    note: "",
    sharedBy: "",
  });

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

    const track: TrackItem = {
      id: tracks.length + 1,
      title,
      artist,
      mood: newTrack.mood.trim() || "Other",
      era: newTrack.era.trim() || undefined,
      genre: newTrack.genre.trim() || undefined,
      source: newTrack.source.trim() || undefined,
      note: newTrack.note.trim() || undefined,
      sharedBy: newTrack.sharedBy.trim() || "Anon",
      timeAgo: "Just now",
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
      note: "",
      sharedBy: "",
    });

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
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960]">
                  Room
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-yellow-900">
                  Music Room
                </h1>
                <p className="text-xs md:text-sm text-[#5C4A33] max-w-xl">
                  Nostalgic tracks, feel-good songs and “this lives in my
                  bones” music. Share the songs that make cleaning easier,
                  walks brighter and hard days feel more human.
                </p>
              </div>

              {/* SEARCH BAR */}
              <div className="flex items-center gap-2 bg-white border border-yellow-100 rounded-full px-3 py-1 shadow-sm">
                <span>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by song, artist, mood, era, genre…"
                  className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:text-[#C0A987]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                onClick={() => {
                  setShowAddForm((s) => !s);
                  setAddError(null);
                }}
                className="px-3 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-sm"
              >
                {showAddForm ? "Close add form" : "Add a song"}
              </button>
            </div>
          </section>

          {/* ADD TRACK FORM */}
          {showAddForm && (
            <section className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3 text-xs md:text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-yellow-900">
                  Share a song for the room 🎧
                </p>
                <p className="text-[10px] text-[#A08960]">
                  The goal is vibes, not perfection. Old school, new school,
                  gospel, R&amp;B, whatever feels like sunshine.
                </p>
              </div>

              <form onSubmit={handleAddTrack} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
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
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Just Fine"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
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
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Mary J. Blige"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
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
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Nostalgia, Feel-good, Soft background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
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
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. 90s, 2000s, 2010s"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
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
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. R&B, Gospel, Afrobeats"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
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
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Spotify, YouTube, Apple Music"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
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
                      rows={2}
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="Is it a cleaning song, walk song, cry song, shower concert song…?"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#5C4A33]">
                    Your name (or initial)
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
                    className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    placeholder="Leave blank to show as Anon"
                  />
                </div>

                {addError && (
                  <p className="text-[11px] text-[#B45309] bg-[#FFF7ED] border border-[#FED7AA] rounded-xl px-3 py-2">
                    {addError}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || !newTrack.title.trim() || !newTrack.artist.trim()}
                    className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
                  >
                    {submitting ? "Adding…" : "Add to Music Room"}
                  </button>
                  <p className="text-[10px] text-[#A08960]">
                    Try not to add the exact same song + artist twice – the room
                    will gently tell you if it&apos;s already here.
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
              <div className="space-y-3">
                {filteredTracks.length === 0 && (
                  <div className="bg-white border border-yellow-100 rounded-2xl p-4 text-[11px] text-[#7A674C]">
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
                  const thread = comments[track.id] || [];
                  const isOpen = openTrackId === track.id;
                  const draft = commentDrafts[track.id] || "";

                  return (
                    <article
                      key={track.id}
                      className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-3 hover:border-yellow-200 transition"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                        <span className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <span>{moodEmoji(track.mood)}</span>
                            <span>{track.mood}</span>
                          </span>
                          {track.era && (
                            <span className="px-2 py-[2px] rounded-full border border-yellow-100 bg-yellow-50 text-[#5C4A33]">
                              {track.era}
                            </span>
                          )}
                        </span>
                        <span>{track.timeAgo}</span>
                      </div>

                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <h2 className="text-sm font-semibold text-yellow-900">
                            {track.title}
                          </h2>
                          <p className="text-[11px] text-[#7A674C]">
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
                            <p className="text-[11px] text-[#5C4A33] mt-1">
                              {track.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
                        <span>
                          Shared by{" "}
                          {track.sharedBy ? (
                            <span>{track.sharedBy}</span>
                          ) : (
                            <span>Anon</span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenTrackId((current) =>
                              current === track.id ? null : track.id
                            )
                          }
                          className="flex items-center gap-1 hover:text-yellow-900"
                        >
                          <span>💬</span>
                          <span>
                            {thread.length === 0
                              ? "Start thread"
                              : `${thread.length} comment${
                                  thread.length === 1 ? "" : "s"
                                }`}
                          </span>
                        </button>
                      </div>

                      {/* PLAYLIST BUTTON */}
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => togglePlaylist(track.id)}
                          className={`px-3 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                            isInPlaylist
                              ? "bg-[#E0F2FE] border-[#BFDBFE] text-[#1D4ED8]"
                              : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                          }`}
                        >
                          <span>🎧</span>
                          <span>
                            {isInPlaylist
                              ? "In your playlist"
                              : "Add to your playlist"}
                          </span>
                        </button>
                      </div>

                      {/* REACTIONS - Using ReactionBar with Music Room config */}
                      <div className="flex flex-col gap-2">
                        <ReactionBar
                          roomId="musicRoom"
                          postId={track.id}
                          reactions={trackReactions}
                          onReactionToggle={(reactionId, active) =>
                            toggleReaction(track.id, reactionId, active)
                          }
                          showLabels={true}
                        />
                        <p className="text-[9px] text-[#C0A987] italic">
                          Reactions &amp; playlist are just for you. No public
                          scores, just shared vibes.
                        </p>
                      </div>

                      {/* COMMENTS THREAD */}
                      {isOpen && (
                        <div className="mt-2 border-t border-yellow-50 pt-3 space-y-3">
                          {/* COMMENT FORM - Above existing comments */}
                          <form
                            className="space-y-2"
                            onSubmit={(e) => handleAddComment(track.id, e)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">💬</span>
                              <label className="text-[11px] font-medium text-[#5C4A33]">
                                Add a reflection
                              </label>
                            </div>
                            <textarea
                              value={draft}
                              onChange={(e) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [track.id]: e.target.value,
                                }))
                              }
                              rows={2}
                              className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                              placeholder="Share the memory it reminds you of, how you found it, or what mood it fits."
                            />
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="submit"
                                disabled={!draft.trim()}
                                className="px-3 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-[11px] font-semibold shadow-sm"
                              >
                                Post comment
                              </button>
                              <p className="text-[9px] text-[#A08960]">
                                No music snobbery here – your guilty pleasures are
                                safe. 🎶
                              </p>
                            </div>
                          </form>

                          {/* EXISTING COMMENTS - Below form */}
                          {thread.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <p className="text-[10px] text-[#A08960] font-medium">
                                {thread.length} comment{thread.length === 1 ? "" : "s"}
                              </p>
                              {thread.map((c) => (
                                <div
                                  key={c.id}
                                  className="bg-[#FFFEFA] border border-yellow-50 rounded-xl px-3 py-2 text-[11px]"
                                >
                                  <p className="text-[#5C4A33] whitespace-pre-line">
                                    {c.body}
                                  </p>
                                  <p className="mt-1 text-[10px] text-[#A08960]">
                                    {c.author} · {c.timeAgo}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            {/* SIDEBAR INFO */}
            <aside className="space-y-4">
              <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  How people use this room
                </p>
                <ul className="space-y-1 text-[#7A674C]">
                  <li>• Build “I can’t be bothered” playlists together</li>
                  <li>• Share nostalgia songs that feel like home</li>
                  <li>• Collect walking / cleaning / shower concert songs</li>
                  <li>• Swap “I forgot about this banger” tracks</li>
                </ul>
              </div>

              <div className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  Gentle boundaries
                </p>
                <p className="text-[#7A674C]">
                  Please avoid lyrics or visuals that are hateful or explicitly
                  violent. It&apos;s okay if songs have heavy themes – just flag them
                  gently in your note (e.g. grief, heartbreak, faith, etc.).
                </p>
              </div>

              <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  Stuck on what to add?
                </p>
                <ul className="space-y-1 text-[#7A674C]">
                  <li>• “A song that always gets me out of bed…”</li>
                  <li>• “The soundtrack to my healing era…”</li>
                  <li>• “A song that makes cleaning less annoying…”</li>
                </ul>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
