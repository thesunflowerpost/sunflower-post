"use client";

import { useState, useEffect, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";
import { ReactionBar } from "./ui";
import Link from "next/link";
import type { ReactionId } from "@/config/reactions";
import type { TVMovie, TVMovieStatus } from "@/lib/db/schema";

type MoodFilter = "All moods" | string;
type TypeFilter = "All" | "TV series" | "Movies";
type StatusFilter = "All" | "Watching" | "Watched" | "Want to watch";

type UserReactions = Record<string, Record<ReactionId, boolean>>;

const BASE_MOODS: string[] = [
  "Comfort watch",
  "High drama",
  "Background cosy",
  "Coming-of-age",
  "Soft chaos",
  "Other",
];

export default function TVAndMoviesRoom() {
  const [items, setItems] = useState<TVMovie[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [moodFilter, setMoodFilter] = useState<MoodFilter>("All moods");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [reactions, setReactions] = useState<UserReactions>({});
  const [userStatuses, setUserStatuses] = useState<Record<string, TVMovieStatus>>({});

  const [newItem, setNewItem] = useState({
    type: "TV series" as "TV series" | "Movie",
    title: "",
    mood: "Comfort watch",
    genre: "",
    era: "",
    sharedBy: "",
    note: "",
    platform: "",
    trailerUrl: "",
    link: "",
  });

  // Fetch TV shows/movies from database
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/tv-movies");
        if (res.ok) {
          const data = await res.json();
          setItems(data.tvMovies || []);
        }

        // Fetch user reactions
        const reactionsRes = await fetch("/api/tv-movies/reactions?userId=current-user");
        if (reactionsRes.ok) {
          const data = await reactionsRes.json();
          setReactions(data.reactions || {});
        }

        // Fetch user statuses (would need to loop through items, but for simplicity we'll do it on-demand)
      } catch (error) {
        console.error("Error fetching TV shows/movies:", error);
      }
    }

    fetchData();
  }, []);

  // Fetch user status for each item
  useEffect(() => {
    async function fetchStatuses() {
      const statuses: Record<string, TVMovieStatus> = {};
      for (const item of items) {
        try {
          const res = await fetch(`/api/tv-movies/${item.id}/status?userId=current-user`);
          if (res.ok) {
            const data = await res.json();
            if (data.status) {
              statuses[item.id] = data.status;
            }
          }
        } catch (error) {
          console.error("Error fetching status:", error);
        }
      }
      setUserStatuses(statuses);
    }

    if (items.length > 0) {
      fetchStatuses();
    }
  }, [items]);

  // Dynamic moods derived from items
  const dynamicMoods = Array.from(
    new Set(items.map((i) => i.mood).filter(Boolean))
  ).filter((mood) => !BASE_MOODS.includes(mood));

  const moodFilters: MoodFilter[] = [
    "All moods",
    ...BASE_MOODS,
    ...dynamicMoods,
  ];

  const filteredItems = items.filter((item) => {
    // Type filter
    const typeMatch =
      typeFilter === "All" ||
      (typeFilter === "TV series" && item.type === "TV series") ||
      (typeFilter === "Movies" && item.type === "Movie");

    if (!typeMatch) return false;

    // Mood filter
    const moodMatch =
      moodFilter === "All moods" || item.mood === moodFilter;

    if (!moodMatch) return false;

    // Status filter
    const statusMatch =
      statusFilter === "All" || userStatuses[item.id] === statusFilter;

    if (!statusMatch) return false;

    // Search
    return matchesSearch(
      [
        item.title,
        item.mood,
        item.genre || "",
        item.era || "",
        item.note || "",
        item.platform || "",
        item.sharedBy,
      ],
      search
    );
  });

  async function handleAddItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null);

    if (!newItem.title.trim()) return;

    const title = newItem.title.trim().toLowerCase();
    const type = newItem.type;

    // Simple duplicate check
    const exists = items.some(
      (i) =>
        i.title.trim().toLowerCase() === title &&
        i.type === type
    );

    if (exists) {
      setAddError(
        "This show/film is already in the room. You can always add your thoughts under it instead. 🌻"
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/tv-movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newItem.title.trim(),
          type: newItem.type,
          mood: newItem.mood.trim() || "Other",
          genre: newItem.genre.trim() || undefined,
          era: newItem.era.trim() || undefined,
          sharedBy: newItem.sharedBy.trim() || "Anon",
          note: newItem.note.trim() || undefined,
          platform: newItem.platform.trim() || undefined,
          trailerUrl: newItem.trailerUrl.trim() || undefined,
          link: newItem.link.trim() || undefined,
          status: "Want to watch",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems([data.tvMovie, ...items]);

        setNewItem({
          type: "TV series",
          title: "",
          mood: "Comfort watch",
          genre: "",
          era: "",
          sharedBy: "",
          note: "",
          platform: "",
          trailerUrl: "",
          link: "",
        });
        setShowAddForm(false);
      } else {
        setAddError("Failed to add item. Please try again.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setAddError("Failed to add item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function moodEmoji(mood: string) {
    const lower = mood.toLowerCase();
    if (lower.includes("comfort")) return "🛋️";
    if (lower.includes("drama")) return "🎭";
    if (lower.includes("cosy") || lower.includes("cozy")) return "☕";
    if (lower.includes("coming-of-age")) return "🌱";
    if (lower.includes("chaos")) return "✨";
    return "📺";
  }

  function getAuthorInitial(author: string): string {
    return author.charAt(0).toUpperCase();
  }

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

  function toggleReaction(itemId: string, reactionId: ReactionId, active: boolean) {
    setReactions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [reactionId]: active,
      },
    }));

    // Send to API
    fetch(`/api/tv-movies/${itemId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reactionId, active, userId: "current-user" }),
    }).catch((error) => {
      console.error("Error toggling reaction:", error);
    });
  }

  function getStatusBadge(status: TVMovieStatus) {
    const badges = {
      "Watching": { emoji: "👀", color: "bg-blue-100 border-blue-200 text-blue-800" },
      "Watched": { emoji: "✓", color: "bg-green-100 border-green-200 text-green-800" },
      "Want to watch": { emoji: "📌", color: "bg-yellow-100 border-yellow-200 text-yellow-800" },
    };
    return badges[status];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: MAIN CONTENT */}
        <div className="md:col-span-3 space-y-6">
          {/* HEADER */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-900">
                TV & Movies Room
              </h1>
              <p className="text-sm text-[#7A674C] mt-1">
                Share your comfort watches, hidden gems, and the shows that just hit right.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#3A2E1F] text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {showAddForm ? "Cancel" : "+ Add show or movie"}
            </button>
          </header>

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, mood, genre, platform, era, or who shared it…"
              className="w-full border border-yellow-200 rounded-2xl px-5 py-3 pl-11 text-sm bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A08960]">
              🔍
            </span>
          </div>

          {/* ADD FORM */}
          {showAddForm && (
            <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-yellow-900">
                  Add a show or movie 📺
                </h2>
                <p className="text-sm text-[#7A674C] leading-relaxed">
                  Share something that deserves a spot in the collection. Could be your comfort rewatch, a hidden gem, or something everyone keeps recommending.
                </p>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                {/* Type selector */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Type *
                  </label>
                  <div className="flex gap-3">
                    {(["TV series", "Movie"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewItem((prev) => ({ ...prev, type }))}
                        className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          newItem.type === type
                            ? "bg-yellow-100 border-yellow-300 text-[#5C4A33] shadow-sm"
                            : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                    placeholder="E.g., Fleabag, Past Lives, The Bear"
                  />
                </div>

                {/* Mood */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Mood / vibe
                  </label>
                  <select
                    value={newItem.mood}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, mood: e.target.value }))
                    }
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                  >
                    {BASE_MOODS.map((mood) => (
                      <option key={mood} value={mood}>
                        {mood}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Genre */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Genre
                    </label>
                    <input
                      type="text"
                      value={newItem.genre}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, genre: e.target.value }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="E.g., Drama, Comedy, Thriller"
                    />
                  </div>

                  {/* Era */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Era / year
                    </label>
                    <input
                      type="text"
                      value={newItem.era}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, era: e.target.value }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="E.g., 2023, 2010s, 90s"
                    />
                  </div>
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Where to watch
                  </label>
                  <input
                    type="text"
                    value={newItem.platform}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, platform: e.target.value }))
                    }
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                    placeholder="E.g., Netflix, HBO Max, Prime Video"
                  />
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Why you're sharing this
                  </label>
                  <textarea
                    rows={3}
                    value={newItem.note}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, note: e.target.value }))
                    }
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-none"
                    placeholder="E.g., 'Perfect comfort watch for Sunday evenings' or 'Made me cry but in a good way'"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Trailer URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Trailer URL (YouTube)
                    </label>
                    <input
                      type="url"
                      value={newItem.trailerUrl}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          trailerUrl: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="https://youtube.com/..."
                    />
                  </div>

                  {/* Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Link (IMDB, streaming, etc.)
                    </label>
                    <input
                      type="url"
                      value={newItem.link}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, link: e.target.value }))
                      }
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Your name */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Your name (or initial)
                  </label>
                  <input
                    type="text"
                    value={newItem.sharedBy}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        sharedBy: e.target.value,
                      }))
                    }
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                    placeholder="Leave blank to show as Anon"
                  />
                </div>

                {addError && (
                  <p className="text-[11px] text-[#B45309] bg-[#FFF7ED] border border-[#FED7AA] rounded-xl px-3 py-2">
                    {addError}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !newItem.title.trim()}
                    className="px-5 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  >
                    {submitting ? "Adding…" : "Add to TV & Movies room"}
                  </button>
                  <p className="text-[10px] text-[#A08960]">
                    Avoid major spoilers in the description – keep it gentle.
                  </p>
                </div>
              </form>
            </section>
          )}

          {/* FILTERS */}
          <section className="grid lg:grid-cols-3 gap-6 text-xs">
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-3">
                {/* Type Filter */}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#A08960] font-medium">
                    Type
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["All", "TV series", "Movies"] as TypeFilter[]).map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setTypeFilter(filter)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] transition-all ${
                          typeFilter === filter
                            ? "bg-yellow-100 border-yellow-300 text-[#5C4A33] font-semibold shadow-sm"
                            : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50 hover:border-yellow-200"
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>

                {/* Mood Filter */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#A08960] font-medium">
                    Mood
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {moodFilters.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setMoodFilter(mood)}
                      className={`px-3 py-1.5 rounded-full border text-[11px] transition-all ${
                        moodFilter === mood
                          ? "bg-yellow-100 border-yellow-300 text-[#5C4A33] font-semibold shadow-sm"
                          : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50 hover:border-yellow-200"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#A08960] font-medium">
                    My status
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["All", "Watching", "Watched", "Want to watch"] as StatusFilter[]).map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] transition-all ${
                          statusFilter === filter
                            ? "bg-yellow-100 border-yellow-300 text-[#5C4A33] font-semibold shadow-sm"
                            : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50 hover:border-yellow-200"
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* ITEMS */}
              <div className="space-y-4">
                {filteredItems.length === 0 && (
                  <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-5 text-xs text-[#7A674C] shadow-sm">
                    <p className="font-semibold text-yellow-900 mb-1">
                      Nothing matches that (yet).
                    </p>
                    <p>
                      Try a different word, change the filters, or add the show /
                      film you were hoping to find. Someone else probably needs it
                      too. 🌻
                    </p>
                  </div>
                )}

                {filteredItems.map((item) => {
                  const itemReactions = reactions[item.id] || {};
                  const userStatus = userStatuses[item.id];
                  const statusBadge = userStatus ? getStatusBadge(userStatus) : null;

                  return (
                    <article
                      key={item.id}
                      className="bg-gradient-to-br from-white to-yellow-50/20 border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 shadow-md hover:shadow-xl hover:border-yellow-300/80 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Author Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(
                            item.sharedBy
                          )} flex items-center justify-center text-sm font-semibold text-[#3A2E1F] shadow-md flex-shrink-0 ring-2 ring-white`}
                        >
                          {getAuthorInitial(item.sharedBy)}
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-[#5C4A33]">
                              {item.sharedBy}
                            </span>
                            <span className="text-[10px] text-[#A08960]">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 text-[10px]">
                              <span>{moodEmoji(item.mood)}</span>
                              <span className="text-[#7A674C]">{item.mood}</span>
                            </span>
                            <span className="px-2 py-[2px] rounded-full border border-yellow-100 bg-yellow-50 text-[#5C4A33] text-[10px]">
                              {item.type}
                            </span>
                            {item.era && (
                              <span className="px-2 py-[2px] rounded-full border border-yellow-100 bg-yellow-50 text-[#5C4A33] text-[10px]">
                                {item.era}
                              </span>
                            )}
                            {statusBadge && (
                              <span className={`px-2 py-[2px] rounded-full border text-[10px] font-semibold ${statusBadge.color}`}>
                                {statusBadge.emoji} {userStatus}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-3">
                            {/* Cover Image */}
                            {item.coverUrl && (
                              <div className="w-20 h-28 md:w-24 md:h-32 rounded-lg overflow-hidden bg-yellow-50 border-2 border-yellow-100 flex-shrink-0 shadow-md">
                                <img
                                  src={item.coverUrl}
                                  alt={`Cover for ${item.title}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              <Link
                                href={`/tv-movies/${item.id}`}
                                className="text-base font-bold text-yellow-900 leading-snug hover:text-yellow-700 transition-colors"
                              >
                                {item.title}
                              </Link>
                              <p className="text-xs text-[#7A674C] mt-0.5">
                                {item.genre && <span>{item.genre}</span>}
                                {item.platform && (
                                  <span>
                                    {item.genre ? " · " : ""}
                                    <span className="italic">{item.platform}</span>
                                  </span>
                                )}
                              </p>

                              {item.note && (
                                <p className="text-xs text-[#5C4A33] mt-2 leading-relaxed">
                                  {item.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Discussion Link */}
                      <div className="flex items-center justify-end">
                        <Link
                          href={`/tv-movies/${item.id}`}
                          className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50 border border-yellow-200/80 text-[10px] md:text-xs font-semibold text-yellow-900 hover:text-yellow-950 transition-all hover:shadow-md hover:scale-105 active:scale-95"
                        >
                          <span>💬</span>
                          <span>
                            {item.discussionCount === 0
                              ? "Start discussion"
                              : `${item.discussionCount} discussion${
                                  item.discussionCount === 1 ? "" : "s"
                                }`}
                          </span>
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            →
                          </span>
                        </Link>
                      </div>

                      {/* Reactions */}
                      <div className="flex flex-col gap-2 pt-1 border-t border-yellow-200/40">
                        <ReactionBar
                          roomId="tvMovies"
                          postId={item.id}
                          reactions={itemReactions}
                          onReactionToggle={(reactionId, active) =>
                            toggleReaction(item.id, reactionId, active)
                          }
                          showLabels={true}
                        />
                        <p className="text-[9px] text-[#C0A987] italic">
                          Reactions are for care, not counts. Only you see what you&apos;ve sent.
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* SIDEBAR INFO */}
            <aside className="lg:col-span-1 space-y-4">
              <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-4 space-y-3 shadow-md text-xs sticky top-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📺</span>
                  <h3 className="font-bold text-yellow-900">About this room</h3>
                </div>

                <div className="space-y-2 text-[#5C4A33] leading-relaxed">
                  <p>
                    This is where we share the shows and films that hit different –
                    whether it's comfort rewatches, hidden gems, or the ones everyone
                    keeps recommending.
                  </p>
                  <p>
                    Click on any title to start a discussion, share theories, or just
                    talk about how that one scene made you feel.
                  </p>
                </div>

                <div className="pt-2 border-t border-yellow-200/50 space-y-1">
                  <p className="text-[10px] text-[#A08960] italic">
                    💡 Tip: Use status tracking to remember what you're watching or
                    want to watch next.
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
