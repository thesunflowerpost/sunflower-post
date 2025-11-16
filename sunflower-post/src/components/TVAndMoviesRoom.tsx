"use client";

import { useState, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";

type MediaType = "tv" | "movie";

type TVMovieMood = string;
type MoodFilter = "All moods" | TVMovieMood;
type TypeFilter = "All" | "TV series" | "Movies";

type TVMovieItem = {
  id: number;
  type: MediaType;
  title: string;
  mood: TVMovieMood;
  genre?: string;
  era?: string;
  sharedBy: string;
  note?: string;
  platform?: string;
  extraInfo?: string; // e.g. "Season 2, Episode 16"
  timeAgo: string;
};

type ReactionState = {
  cackle: boolean; // 😂 Big cackle
  comfort: boolean; // 🛋️ Comfort rewatch
  rentfree: boolean; // 🧠 Lives rent-free
  twist: boolean; // 😲 That twist!!
};

type ThreadComment = {
  id: number;
  author: string;
  body: string;
  timeAgo: string;
};

const BASE_MOODS: TVMovieMood[] = [
  "Comfort watch",
  "High drama",
  "Background cosy",
  "Coming-of-age",
  "Soft chaos",
  "Other",
];

const INITIAL_ITEMS: TVMovieItem[] = [
  {
    id: 1,
    type: "tv",
    title: "Grey's Anatomy",
    mood: "Comfort watch",
    genre: "Medical drama",
    era: "2000s–",
    sharedBy: "S.",
    note: "For when you need background feelings and random surgeries. Yes, it will emotionally damage you, but softly.",
    platform: "Disney+ / Netflix (varies by region)",
    extraInfo: "Best for rewatch: seasons 1–5",
    timeAgo: "Shared 3 days ago",
  },
  {
    id: 2,
    type: "tv",
    title: "One Tree Hill",
    mood: "Coming-of-age",
    genre: "Teen drama",
    era: "2000s",
    sharedBy: "Jay",
    note: "Peak teenage angst, basketball, voiceovers and surprisingly profound lines.",
    platform: "Amazon / various",
    extraInfo: "Season 3 when you need maximum drama",
    timeAgo: "Shared 1 week ago",
  },
  {
    id: 3,
    type: "tv",
    title: "The O.C.",
    mood: "Nostalgia / Soft chaos",
    genre: "Teen drama",
    era: "Early 2000s",
    sharedBy: "Anon",
    note: "Instant teleport to early-2000s soundtracks, low-rise jeans and chaotic rich people.",
    platform: "Disney+",
    extraInfo: "Season 1 for pure comfort",
    timeAgo: "Shared 2 weeks ago",
  },
  {
    id: 4,
    type: "movie",
    title: "The Notebook",
    mood: "High drama",
    genre: "Romance",
    era: "2000s",
    sharedBy: "Leah",
    note: "When you need a cathartic cry and dramatic rain.",
    platform: "Netflix / various",
    extraInfo: "Prepare tissues",
    timeAgo: "Shared 1 month ago",
  },
  {
    id: 5,
    type: "movie",
    title: "Mean Girls",
    mood: "Comfort watch",
    genre: "Comedy",
    era: "2000s",
    sharedBy: "Dani",
    note: "For quotes, nostalgia and light chaos that somehow still hits.",
    platform: "Paramount+ / various",
    extraInfo: "October 3rd, obviously",
    timeAgo: "Shared 1 month ago",
  },
  {
    id: 6,
    type: "movie",
    title: "Gone Girl",
    mood: "Soft chaos",
    genre: "Thriller",
    era: "2010s",
    sharedBy: "Anon",
    note: "For when you want to feel unsettled and analyse relationship dynamics for three business days.",
    platform: "Netflix / various",
    extraInfo: "Not a comfort watch, but a brain-occupying one.",
    timeAgo: "Shared 6 weeks ago",
  },
];

const INITIAL_COMMENTS: Record<number, ThreadComment[]> = {
  1: [
    {
      id: 1,
      author: "You",
      body: "Grey's on in the background while I work = instant fake productivity boost.",
      timeAgo: "1 day ago",
    },
  ],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
};

export default function TVAndMoviesRoom() {
  const [items, setItems] = useState<TVMovieItem[]>(INITIAL_ITEMS);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [moodFilter, setMoodFilter] = useState<MoodFilter>("All moods");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    type: "tv" as MediaType,
    title: "",
    mood: "Comfort watch" as TVMovieMood,
    genre: "",
    era: "",
    sharedBy: "",
    note: "",
    platform: "",
    extraInfo: "",
  });

  // per-item reactions for this viewer
  const [reactions, setReactions] = useState<Record<number, ReactionState>>({});
  // per-item comments
  const [comments, setComments] =
    useState<Record<number, ThreadComment[]>>(INITIAL_COMMENTS);
  // which item thread is open
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  // comment drafts per item
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  // watchlist per item (true = in your watchlist)
  const [watchlist, setWatchlist] = useState<Record<number, boolean>>({});

  // dynamic moods derived from items
  const dynamicMoods = Array.from(
    new Set(items.map((i) => i.mood).filter(Boolean))
  ).filter((mood) => !BASE_MOODS.includes(mood));

  const moodFilters: MoodFilter[] = [
    "All moods",
    ...BASE_MOODS,
    ...dynamicMoods,
  ];

  const filteredItems = items.filter((item) => {
    // type filter
    const typeMatch =
      typeFilter === "All" ||
      (typeFilter === "TV series" && item.type === "tv") ||
      (typeFilter === "Movies" && item.type === "movie");

    if (!typeMatch) return false;

    // mood filter
    const moodMatch =
      moodFilter === "All moods" || item.mood === moodFilter;

    if (!moodMatch) return false;

    // search
    return matchesSearch(
      [
        item.title,
        item.mood,
        item.genre || "",
        item.era || "",
        item.note || "",
        item.platform || "",
        item.sharedBy,
        item.extraInfo || "",
      ],
      search
    );
  });

  function handleAddItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null);

    if (!newItem.title.trim()) return;

    const title = newItem.title.trim().toLowerCase();
    const type = newItem.type;

    // simple duplicate check: title + type
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

    const item: TVMovieItem = {
      id: items.length + 1,
      type: newItem.type,
      title: newItem.title.trim(),
      mood: newItem.mood.trim() || "Other",
      genre: newItem.genre.trim() || undefined,
      era: newItem.era.trim() || undefined,
      sharedBy: newItem.sharedBy.trim() || "Anon",
      note: newItem.note.trim() || undefined,
      platform: newItem.platform.trim() || undefined,
      extraInfo: newItem.extraInfo.trim() || undefined,
      timeAgo: "Just now",
    };

    setItems([item, ...items]);
    setComments((prev) => ({
      ...prev,
      [item.id]: [],
    }));

    setNewItem({
      type: "tv",
      title: "",
      mood: "Comfort watch",
      genre: "",
      era: "",
      sharedBy: "",
      note: "",
      platform: "",
      extraInfo: "",
    });
    setSubmitting(false);
    setShowAddForm(false);
  }

  function moodEmoji(mood: TVMovieMood) {
    const lower = mood.toLowerCase();
    if (lower.includes("comfort")) return "🛋️";
    if (lower.includes("drama")) return "🎭";
    if (lower.includes("background")) return "🌙";
    if (lower.includes("nostalgia")) return "📼";
    if (lower.includes("chaos")) return "🔥";
    if (lower.includes("coming-of-age") || lower.includes("coming of age"))
      return "🌱";
    return "📺";
  }

  function typeLabel(type: MediaType) {
    return type === "tv" ? "TV series" : "Movie";
  }

  function toggleReaction(itemId: number, key: keyof ReactionState) {
    setReactions((prev) => {
      const current =
        prev[itemId] || ({
          cackle: false,
          comfort: false,
          rentfree: false,
          twist: false,
        } as ReactionState);
      return {
        ...prev,
        [itemId]: {
          ...current,
          [key]: !current[key],
        },
      };
    });
  }

  function toggleWatchlist(itemId: number) {
    setWatchlist((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }

  function handleAddComment(itemId: number, e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = (commentDrafts[itemId] || "").trim();
    if (!body) return;

    setComments((prev) => {
      const existing = prev[itemId] || [];
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
        [itemId]: [...existing, newComment],
      };
    });

    setCommentDrafts((prev) => ({
      ...prev,
      [itemId]: "",
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: TV & MOVIES ROOM CONTENT */}
        <div className="md:col-span-3 space-y-8">
          {/* HEADER */}
          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 md:max-w-xl">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960]">
                  Room
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-yellow-900">
                  TV &amp; Movies
                </h1>
                <p className="text-xs md:text-sm text-[#5C4A33] max-w-xl">
                  The room for comfort rewatches, chaotic plot twists and the
                  shows you put on when your brain is tired. Think: Grey&apos;s
                  on in the background, a romcom on a Sunday, or that thriller
                  you can&apos;t stop thinking about.
                </p>
              </div>

              {/* SEARCH BAR */}
              <div className="flex items-center gap-2 bg-white border border-yellow-100 rounded-full px-3 py-1 shadow-sm">
                <span>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, mood, genre, era, platform…"
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
                {showAddForm ? "Close add form" : "Add a show or film"}
              </button>
            </div>
          </section>

          {/* ADD ITEM FORM */}
          {showAddForm && (
            <section className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3 text-xs md:text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-yellow-900">
                  Share a comfort watch or brain-occupying show 🎬
                </p>
                <p className="text-[10px] text-[#A08960]">
                  No need for spoilers – just enough context so people know the
                  vibe.
                </p>
              </div>

              <form onSubmit={handleAddItem} className="space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Type
                    </label>
                    <select
                      value={newItem.type}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          type: e.target.value === "movie" ? "movie" : "tv",
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      <option value="tv">TV series</option>
                      <option value="movie">Movie</option>
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newItem.title}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Grey&apos;s Anatomy, The Notebook"
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
                      value={newItem.mood}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          mood: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Comfort watch, Background cosy, Soft chaos"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Genre (optional)
                    </label>
                    <input
                      type="text"
                      value={newItem.genre}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          genre: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Comedy, Thriller, Medical drama"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Era (optional)
                    </label>
                    <input
                      type="text"
                      value={newItem.era}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          era: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. 90s, 2000s, 2010s"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Where do you watch it? (optional)
                    </label>
                    <input
                      type="text"
                      value={newItem.platform}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          platform: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Netflix, Disney+, Amazon"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Specific season / episode (optional)
                    </label>
                    <input
                      type="text"
                      value={newItem.extraInfo}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          extraInfo: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Season 2, Episode 16"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#5C4A33]">
                    Why this one? (optional)
                  </label>
                  <textarea
                    value={newItem.note}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    placeholder="Is it your background show? A breakup recovery film? A 'my brain is tired' series?"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#5C4A33]">
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
                    disabled={submitting || !newItem.title.trim()}
                    className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
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

          {/* MAIN LAYOUT */}
          <section className="grid lg:grid-cols-3 gap-6 text-xs">
            {/* LIST */}
            <div className="lg:col-span-2 space-y-4">
              {/* FILTERS */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {/* TYPE FILTERS */}
                  <div className="flex flex-wrap gap-2">
                    {(["All", "TV series", "Movies"] as TypeFilter[]).map(
                      (filter) => (
                        <button
                          key={filter}
                          onClick={() => setTypeFilter(filter)}
                          className={`px-3 py-1 rounded-full border text-[11px] ${
                            typeFilter === filter
                              ? "bg-yellow-100 border-yellow-200 text-[#5C4A33] font-medium"
                              : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                          }`}
                        >
                          {filter}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* MOOD FILTERS */}
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
              </div>

              {/* CARDS */}
              <div className="space-y-3">
                {filteredItems.length === 0 && (
                  <div className="bg-white border border-yellow-100 rounded-2xl p-4 text-[11px] text-[#7A674C]">
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
                  const itemReactions =
                    reactions[item.id] || {
                      cackle: false,
                      comfort: false,
                      rentfree: false,
                      twist: false,
                    };

                  const isOnWatchlist = !!watchlist[item.id];
                  const thread = comments[item.id] || [];
                  const isOpen = openItemId === item.id;
                  const draft = commentDrafts[item.id] || "";

                  return (
                    <article
                      key={item.id}
                      className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-3 hover:border-yellow-200 transition"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                        <span className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <span>{moodEmoji(item.mood)}</span>
                            <span>{item.mood}</span>
                          </span>
                          <span className="px-2 py-[2px] rounded-full border border-yellow-100 bg-yellow-50 text-[#5C4A33]">
                            {typeLabel(item.type)}
                          </span>
                        </span>
                        <span>{item.timeAgo}</span>
                      </div>

                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <h2 className="text-sm font-semibold text-yellow-900">
                            {item.title}
                          </h2>
                          <p className="text-[11px] text-[#7A674C]">
                            {item.genre && <span>{item.genre}</span>}
                            {item.era && (
                              <span>
                                {item.genre ? " · " : ""}
                                {item.era}
                              </span>
                            )}
                            {item.platform && (
                              <span>
                                {" "}
                                ·{" "}
                                <span className="italic">
                                  {item.platform}
                                </span>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {item.extraInfo && (
                        <p className="text-[11px] text-[#7A674C]">
                          <span className="font-medium text-yellow-900">
                            Go-to bit:
                          </span>{" "}
                          {item.extraInfo}
                        </p>
                      )}

                      {item.note && (
                        <p className="text-[11px] text-[#5C4A33]">
                          {item.note}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
                        <span>
                          Shared by{" "}
                          {item.sharedBy ? (
                            <span>{item.sharedBy}</span>
                          ) : (
                            <span>Anon</span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenItemId((current) =>
                              current === item.id ? null : item.id
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

                      {/* WATCHLIST BUTTON */}
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(item.id)}
                          className={`px-3 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                            isOnWatchlist
                              ? "bg-[#E0F2FE] border-[#BFDBFE] text-[#1D4ED8]"
                              : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                          }`}
                        >
                          <span>👀</span>
                          <span>
                            {isOnWatchlist
                              ? "In your watchlist"
                              : "Add to watchlist"}
                          </span>
                        </button>
                      </div>

                      {/* REACTIONS ROW – TV/Movie flavoured */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              toggleReaction(item.id, "cackle")
                            }
                            className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                              itemReactions.cackle
                                ? "bg-[#FEE2E2] border-[#FCA5A5] text-[#7F1D1D]"
                                : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                            }`}
                          >
                            <span>😂</span>
                            <span>Big cackle</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              toggleReaction(item.id, "comfort")
                            }
                            className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                              itemReactions.comfort
                                ? "bg-[#FEF3C7] border-[#FACC15] text-[#92400E]"
                                : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                            }`}
                          >
                            <span>🛋️</span>
                            <span>Comfort rewatch</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              toggleReaction(item.id, "rentfree")
                            }
                            className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                              itemReactions.rentfree
                                ? "bg-[#E0F2FE] border-[#BFDBFE] text-[#1D4ED8]"
                                : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                            }`}
                          >
                            <span>🧠</span>
                            <span>Lives rent-free</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              toggleReaction(item.id, "twist")
                            }
                            className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                              itemReactions.twist
                                ? "bg-[#FDE68A] border-[#FACC15] text-[#92400E]"
                                : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                            }`}
                          >
                            <span>😲</span>
                            <span>That twist!!</span>
                          </button>
                        </div>
                        <p className="text-[9px] text-[#C0A987]">
                          Reactions &amp; watchlist are just for you. No public
                          scores, just vibes.
                        </p>
                      </div>

                      {/* COMMENTS */}
                      {isOpen && (
                        <div className="mt-2 border-t border-yellow-50 pt-3 space-y-2">
                          {thread.length > 0 && (
                            <div className="space-y-2">
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

                          <form
                            className="space-y-2"
                            onSubmit={(e) => handleAddComment(item.id, e)}
                          >
                            <textarea
                              value={draft}
                              onChange={(e) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [item.id]: e.target.value,
                                }))
                              }
                              rows={2}
                              className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                              placeholder="Quote your favourite line, explain why it became a comfort watch, or gently warn if it’s intense."
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
                                Be spoiler-kind. “Without spoiling it…” goes a long
                                way.
                              </p>
                            </div>
                          </form>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-4">
              <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  How people use this room
                </p>
                <ul className="space-y-1 text-[#7A674C]">
                  <li>• Share comfort shows to rewatch on tired days</li>
                  <li>• Add films that helped you feel less alone</li>
                  <li>• Collect background series for admin days</li>
                  <li>• Swap “lives rent-free in my head” episodes</li>
                </ul>
              </div>

              <div className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  Gentle boundaries
                </p>
                <p className="text-[#7A674C]">
                  No detailed spoilers in the main description, and avoid sharing
                  clips that include graphic content. You can mention themes
                  gently (e.g. grief, breakup, medical) to help people choose.
                </p>
              </div>

              <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  Little prompt if you&apos;re stuck
                </p>
                <ul className="space-y-1 text-[#7A674C]">
                  <li>• “My go-to background show when I&apos;m overwhelmed…”</li>
                  <li>• “A film that helped me feel less alone…”</li>
                  <li>• “A series that feels like a hug and a warm drink…”</li>
                </ul>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
