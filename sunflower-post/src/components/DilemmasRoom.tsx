"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";
import { BouncyButton } from "./ui";

type DilemmaCategory = "Work & Money" | "Dating & Relationships" | "Family & Boundaries" | "Health & Burnout" | "Friendships" | "Life";
type CategoryFilter = "All" | DilemmaCategory;
type SortOption = "newest" | "most_replies" | "most_saved";
type Urgency = "low" | "medium" | "high";

type Dilemma = {
  id: number;
  title: string;
  body: string;
  category: DilemmaCategory;
  urgency?: Urgency;
  author: string;
  isAnonymous: boolean;
  timeAgo: string;
  replies: number;
  saves: number;
  sameBoat: number;
  timestamp: number;
};

const CATEGORIES: DilemmaCategory[] = [
  "Work & Money",
  "Dating & Relationships",
  "Family & Boundaries",
  "Health & Burnout",
  "Friendships",
  "Life",
];

const INITIAL_DILEMMAS: Dilemma[] = [
  {
    id: 1,
    title: "Should I quit my job without another one lined up?",
    body: "I've been at my current job for 3 years and I'm completely burned out. The work environment is toxic, but I don't have another offer yet. I have 6 months savings. Is it reckless to just... leave?",
    category: "Work & Money",
    urgency: "high",
    author: "Anon",
    isAnonymous: true,
    timeAgo: "2 hours ago",
    replies: 24,
    saves: 12,
    sameBoat: 8,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 2,
    title: "How do I tell my friend her boyfriend is not it?",
    body: "My best friend has been dating this guy for 6 months and he's... not great. Nothing abusive, just subtly dismissive and kind of mean. She seems happy but I see her making herself smaller. Do I say something or stay out of it?",
    category: "Friendships",
    urgency: "medium",
    author: "M.",
    isAnonymous: false,
    timeAgo: "5 hours ago",
    replies: 18,
    saves: 7,
    sameBoat: 15,
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: 3,
    title: "Parents expect me to visit every weekend—how do I set boundaries?",
    body: "I moved an hour away for work but my parents guilt trip me every time I don't come home on weekends. I'm 28. I love them but I also need my own life. How do I have this conversation without hurting them?",
    category: "Family & Boundaries",
    urgency: "medium",
    author: "Anon",
    isAnonymous: true,
    timeAgo: "1 day ago",
    replies: 31,
    saves: 19,
    sameBoat: 22,
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
  {
    id: 4,
    title: "Is it okay to go to therapy just because life feels... hard?",
    body: "Nothing is technically 'wrong' but I feel exhausted all the time. Do I need an actual crisis to justify therapy or is 'I'm just not doing great' enough?",
    category: "Health & Burnout",
    urgency: "low",
    author: "J.",
    isAnonymous: false,
    timeAgo: "2 days ago",
    replies: 27,
    saves: 34,
    sameBoat: 41,
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 5,
    title: "Third date and they haven't asked a single question about me",
    body: "We've been on 3 dates and every conversation is about them. I've tried steering it back but they just... don't ask. Am I being too picky or is this a red flag?",
    category: "Dating & Relationships",
    urgency: "low",
    author: "Anon",
    isAnonymous: true,
    timeAgo: "3 days ago",
    replies: 16,
    saves: 8,
    sameBoat: 12,
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
];

function getCategoryColor(category: DilemmaCategory): string {
  const colors: Record<DilemmaCategory, string> = {
    "Work & Money": "bg-blue-50 text-blue-700 border-blue-200",
    "Dating & Relationships": "bg-pink-50 text-pink-700 border-pink-200",
    "Family & Boundaries": "bg-purple-50 text-purple-700 border-purple-200",
    "Health & Burnout": "bg-green-50 text-green-700 border-green-200",
    "Friendships": "bg-orange-50 text-orange-700 border-orange-200",
    "Life": "bg-gray-50 text-gray-700 border-gray-200",
  };
  return colors[category];
}

function getUrgencyLabel(urgency?: Urgency): { label: string; color: string } | null {
  if (!urgency || urgency === "low") return null;

  if (urgency === "high") {
    return { label: "Urgent", color: "bg-red-100 text-red-700 border-red-200" };
  }
  return { label: "Soon-ish", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
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

export default function DilemmasRoom() {
  const [dilemmas, setDilemmas] = useState<Dilemma[]>(INITIAL_DILEMMAS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showComposer, setShowComposer] = useState(false);
  const [userSameBoat, setUserSameBoat] = useState<Record<number, boolean>>({});
  const [userSaves, setUserSaves] = useState<Record<number, boolean>>({});

  const [newDilemma, setNewDilemma] = useState({
    title: "",
    body: "",
    category: "Life" as DilemmaCategory,
    urgency: "low" as Urgency,
    isAnonymous: true,
  });

  // Filter & sort
  let filteredDilemmas = dilemmas;

  if (search.trim()) {
    filteredDilemmas = filteredDilemmas.filter((d) =>
      matchesSearch([d.title, d.body, d.category], search)
    );
  }

  if (categoryFilter !== "All") {
    filteredDilemmas = filteredDilemmas.filter((d) => d.category === categoryFilter);
  }

  if (sortOption === "newest") {
    filteredDilemmas = [...filteredDilemmas].sort((a, b) => b.timestamp - a.timestamp);
  } else if (sortOption === "most_replies") {
    filteredDilemmas = [...filteredDilemmas].sort((a, b) => b.replies - a.replies);
  } else if (sortOption === "most_saved") {
    filteredDilemmas = [...filteredDilemmas].sort((a, b) => b.saves - a.saves);
  }

  const handleSubmitDilemma = (e: FormEvent) => {
    e.preventDefault();
    if (!newDilemma.title.trim() || !newDilemma.body.trim()) return;

    const dilemma: Dilemma = {
      id: Date.now(),
      title: newDilemma.title,
      body: newDilemma.body,
      category: newDilemma.category,
      urgency: newDilemma.urgency,
      author: newDilemma.isAnonymous ? "Anon" : "You",
      isAnonymous: newDilemma.isAnonymous,
      timeAgo: "Just now",
      replies: 0,
      saves: 0,
      sameBoat: 0,
      timestamp: Date.now(),
    };

    setDilemmas([dilemma, ...dilemmas]);
    setNewDilemma({
      title: "",
      body: "",
      category: "Life",
      urgency: "low",
      isAnonymous: true,
    });
    setShowComposer(false);
  };

  const handleToggleSameBoat = (id: number) => {
    setUserSameBoat((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      setDilemmas((current) =>
        current.map((d) =>
          d.id === id ? { ...d, sameBoat: d.sameBoat + (newState[id] ? 1 : -1) } : d
        )
      );
      return newState;
    });
  };

  const handleToggleSave = (id: number) => {
    setUserSaves((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      setDilemmas((current) =>
        current.map((d) =>
          d.id === id ? { ...d, saves: d.saves + (newState[id] ? 1 : -1) } : d
        )
      );
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white border-b border-[color:var(--border-medium)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
                <span>💭</span>
                <span>Dilemmas</span>
              </h1>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                For the "what should I do?" moments — work, money, dating, family, all of it
              </p>
            </div>
            <button
              onClick={() => setShowComposer(!showComposer)}
              className="px-5 py-2.5 rounded-full bg-[#FFD52A] text-sm font-medium text-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-[#ffcc00] transition"
            >
              {showComposer ? "Cancel" : "Share a dilemma"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="lg:w-64 flex-shrink-0 space-y-4">
            <CommunitySidebar />

            {/* CATEGORY FILTERS */}
            <div className="bg-white border border-[#E5E5EA] rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#111111] mb-3">
                Category
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCategoryFilter("All")}
                  className={[
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors border text-left",
                    categoryFilter === "All"
                      ? "bg-[#FFD52A] text-[#111111] border-[#FFD52A]"
                      : "bg-white text-[#666666] border-[#E5E5EA] hover:border-[#CCCCCC]",
                  ].join(" ")}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={[
                      "px-4 py-2 rounded-xl text-sm font-medium transition-colors border text-left",
                      categoryFilter === cat
                        ? "bg-[#FFD52A] text-[#111111] border-[#FFD52A]"
                        : "bg-white text-[#666666] border-[#E5E5EA] hover:border-[#CCCCCC]",
                    ].join(" ")}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* COMPOSER */}
            {showComposer && (
              <div className="bg-white border border-[#E5E5EA] rounded-2xl p-6 mb-6 shadow-sm">
                <h3 className="text-base font-semibold text-[#111111] mb-4">
                  Share your dilemma
                </h3>
                <form onSubmit={handleSubmitDilemma} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                      What's going on?
                    </label>
                    <input
                      type="text"
                      value={newDilemma.title}
                      onChange={(e) => setNewDilemma({ ...newDilemma, title: e.target.value })}
                      placeholder="Give it a title..."
                      className="w-full px-4 py-2.5 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)]"
                      maxLength={120}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                        Category
                      </label>
                      <select
                        value={newDilemma.category}
                        onChange={(e) =>
                          setNewDilemma({ ...newDilemma, category: e.target.value as DilemmaCategory })
                        }
                        className="w-full px-4 py-2.5 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)]"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                        How urgent?
                      </label>
                      <div className="flex gap-2">
                        {(["low", "medium", "high"] as Urgency[]).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setNewDilemma({ ...newDilemma, urgency: level })}
                            className={[
                              "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                              newDilemma.urgency === level
                                ? "bg-[color:var(--sunflower-gold)] text-[color:var(--text-primary)] border-[color:var(--honey-gold)]"
                                : "bg-white text-[color:var(--text-secondary)] border-[color:var(--border-medium)] hover:border-[color:var(--border-strong)]",
                            ].join(" ")}
                          >
                            {level === "low" ? "Chill" : level === "medium" ? "Soon-ish" : "Urgent"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                      Tell us more
                    </label>
                    <textarea
                      value={newDilemma.body}
                      onChange={(e) => setNewDilemma({ ...newDilemma, body: e.target.value })}
                      placeholder="What's the situation? What are you weighing? What feels hard about this?"
                      rows={6}
                      className="w-full px-4 py-3 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[color:var(--border-soft)]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDilemma.isAnonymous}
                        onChange={(e) => setNewDilemma({ ...newDilemma, isAnonymous: e.target.checked })}
                        className="w-4 h-4 rounded border-[color:var(--border-medium)] text-[color:var(--sunflower-gold)] focus:ring-[color:var(--sunflower-gold)]"
                      />
                      <span className="text-sm text-[color:var(--text-secondary)]">Post anonymously</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!newDilemma.title.trim() || !newDilemma.body.trim()}
                      className="bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] disabled:bg-gray-200 disabled:text-gray-400 text-[color:var(--text-primary)] px-6 py-2.5 rounded-full font-semibold shadow-[var(--shadow-soft)] transition-colors"
                    >
                      Post dilemma
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TWO-COLUMN GRID: MAIN CONTENT + RIGHT SIDEBAR */}
            <div className="mt-6 grid grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] gap-6 items-start">
              {/* LEFT COLUMN: SEARCH + DILEMMAS LIST */}
              <div className="space-y-4">
                {/* SEARCH & SORT BAR */}
                <div className="space-y-3">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search dilemmas..."
                    className="w-full rounded-2xl bg-white border border-[#E5E5EA] px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD52A]/60"
                  />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="w-full rounded-2xl bg-white border border-[#E5E5EA] px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD52A]/60"
                  >
                    <option value="newest">Newest</option>
                    <option value="most_replies">Most perspectives</option>
                    <option value="most_saved">Most saved</option>
                  </select>
                </div>

                {/* DILEMMA LIST */}
                <div className="space-y-4">
                  {filteredDilemmas.map((dilemma) => {
                    const urgencyBadge = getUrgencyLabel(dilemma.urgency);
                    return (
                      <div
                        key={dilemma.id}
                        className="bg-white border border-[#E5E5EA] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getAvatarColor(
                          dilemma.author
                        )}`}
                      >
                        {getAuthorInitial(dilemma.author)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[color:var(--text-primary)]">
                            {dilemma.author}
                          </span>
                          <span className="text-xs text-[color:var(--text-tertiary)]">•</span>
                          <span className="text-xs text-[color:var(--text-tertiary)]">{dilemma.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(dilemma.category)}`}>
                            {dilemma.category}
                          </span>
                          {urgencyBadge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${urgencyBadge.color}`}>
                              {urgencyBadge.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <Link href={`/dilemmas/${dilemma.id}`} className="block mb-4">
                      <h3 className="text-base font-semibold text-[color:var(--text-primary)] mb-2 hover:text-[color:var(--honey-gold)] transition-colors">
                        {dilemma.title}
                      </h3>
                      <p className="text-xs text-[color:var(--text-secondary)] line-clamp-3 leading-relaxed">
                        {dilemma.body}
                      </p>
                    </Link>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[color:var(--border-soft)]">
                      <Link
                        href={`/dilemmas/${dilemma.id}`}
                        className="text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors font-medium"
                      >
                        💬 {dilemma.replies} {dilemma.replies === 1 ? "perspective" : "perspectives"}
                      </Link>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleSameBoat(dilemma.id)}
                          className={[
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            userSameBoat[dilemma.id]
                              ? "bg-[color:var(--sunflower-gold)] text-[color:var(--text-primary)]"
                              : "bg-gray-50 text-[color:var(--text-secondary)] hover:bg-gray-100",
                          ].join(" ")}
                        >
                          <span>🚣</span>
                          <span>Same boat</span>
                          {dilemma.sameBoat > 0 && (
                            <span className="text-[10px] opacity-75">({dilemma.sameBoat})</span>
                          )}
                        </button>

                        <button
                          onClick={() => handleToggleSave(dilemma.id)}
                          className={[
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            userSaves[dilemma.id]
                              ? "text-[color:var(--honey-gold)]"
                              : "text-[color:var(--text-tertiary)] hover:text-[color:var(--honey-gold)]",
                          ].join(" ")}
                        >
                          <span className="font-bold">{userSaves[dilemma.id] ? "✓" : "📌"}</span>
                          {dilemma.saves > 0 && (
                            <span className="text-[10px]">({dilemma.saves})</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
                </div>

                {/* Empty state */}
                {filteredDilemmas.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <p className="text-base text-[color:var(--text-secondary)] mb-2">No dilemmas found</p>
                    <p className="text-xs text-[color:var(--text-tertiary)]">
                      Try adjusting your filters or share the first one
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: SIDEBAR INFO */}
              <aside className="space-y-4">
                {/* WHAT IS DILEMMAS? */}
                <div className="bg-white border border-[#E5E5EA] rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-semibold text-[#111111] mb-3">
                    What is Dilemmas?
                  </p>
                  <p className="text-xs text-[#666666] leading-relaxed mb-4">
                    This is a space for those "I genuinely don't know what to do" moments. Work decisions,
                    relationship crossroads, family dynamics, life stuff. Share what's on your mind and get
                    real perspectives from people who've been there.
                  </p>

                  <p className="text-xs font-semibold text-[#111111] mb-2">
                    How this works
                  </p>
                  <ul className="space-y-2 text-xs text-[#666666]">
                    <li className="flex gap-2">
                      <span className="text-[#FFD52A] flex-shrink-0">→</span>
                      <span>No judgment, no shaming. We're all figuring it out.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#FFD52A] flex-shrink-0">→</span>
                      <span>Advice is perspective, not instruction. Take what resonates.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#FFD52A] flex-shrink-0">→</span>
                      <span>"Same boat" = solidarity. You're not alone in this.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#FFD52A] flex-shrink-0">→</span>
                      <span>You can post anonymously—this is a safe space.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#FFD52A] flex-shrink-0">→</span>
                      <span>Be kind, be honest, be the big sister energy you'd want.</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
