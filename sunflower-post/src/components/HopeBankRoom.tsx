"use client";

import { matchesSearch } from "@/lib/search";
import { useState } from "react";
import Link from "next/link";
import CommunitySidebar from "./CommunitySidebar";
import { BouncyButton, ShimmerIcon, ReactionBar } from "./ui";
import type { ReactionId } from "@/config/reactions";

type HopeStory = {
  id: number;
  title: string;
  summary: string;
  category: "Career" | "Health" | "Family" | "Money" | "Faith" | "Other";
  turningPoint: string;
  author: string;
  isAnon: boolean;
  timeAgo: string;
  saves: number;
};

// User reactions are now stored as Record<ReactionId, boolean>
type UserReactions = Record<ReactionId, boolean>;

const STORIES: HopeStory[] = [
  {
    id: 1,
    title: "I got rejected from 12 roles… and then landed the one that actually fit",
    summary:
      "I was convinced I’d missed my moment. The role I finally got didn’t even exist when I started applying.",
    category: "Career",
    turningPoint: "A friend made me apply for a role I felt underqualified for.",
    author: "S.",
    isAnon: true,
    timeAgo: "3 days ago",
    saves: 18,
  },
  {
    id: 2,
    title: "The scary health letter that turned out to be a second chance",
    summary:
      "I ignored symptoms for months. The diagnosis was early enough to change everything.",
    category: "Health",
    turningPoint: "A nurse quietly told me, “I’m glad you came in today.”",
    author: "Leah",
    isAnon: false,
    timeAgo: "1 week ago",
    saves: 25,
  },
  {
    id: 3,
    title: "We were sure we’d never get out of overdraft",
    summary:
      "It felt impossible to imagine a month without dread. It took longer than we hoped, but it did shift.",
    category: "Money",
    turningPoint:
      "One unexpected grant and a very honest conversation with our bank.",
    author: "Anon",
    isAnon: true,
    timeAgo: "2 weeks ago",
    saves: 31,
  },
];

const CATEGORY_FILTERS = [
  "All",
  "Career",
  "Health",
  "Family",
  "Money",
  "Faith",
  "Other",
] as const;

export default function HopeBankRoom() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORY_FILTERS)[number]>("All");
  const [showForm, setShowForm] = useState(false);

  // per-story reactions for *this* viewer only
  const [reactions, setReactions] = useState<Record<number, UserReactions>>({});

  const filteredStories = STORIES.filter((story) => {
    const categoryMatch =
      activeCategory === "All" || story.category === activeCategory;

    if (!categoryMatch) return false;

    return matchesSearch(
      [story.title, story.summary, story.turningPoint],
      search
    );
  });

  // toggle helper for reactions
  function toggleReaction(storyId: number, reactionId: ReactionId, active: boolean) {
    setReactions((prev) => {
      const current = prev[storyId] || {};
      return {
        ...prev,
        [storyId]: {
          ...current,
          [reactionId]: active,
        },
      };
    });
  }

  // Helper to get author initials
  function getAuthorInitial(author: string): string {
    return author.charAt(0).toUpperCase();
  }

  // Helper to get avatar color based on author name
  function getAvatarColor(author: string): string {
    const colors = [
      "bg-gradient-to-br from-yellow-200 to-amber-300",
      "bg-gradient-to-br from-orange-200 to-orange-300",
      "bg-gradient-to-br from-rose-200 to-pink-300",
      "bg-gradient-to-br from-purple-200 to-violet-300",
      "bg-gradient-to-br from-teal-200 to-emerald-300",
    ];
    const index = author.length % colors.length;
    return colors[index];
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white border-b border-[color:var(--border-medium)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
                <span>🌱</span>
                <span>Hope Bank</span>
              </h1>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                A library of real stories about things quietly getting better. For the days when you're tired of "it will all work out" and need proof from people who have been there.
              </p>
            </div>
            <button
              onClick={() => setShowForm((s) => !s)}
              className="px-5 py-2.5 rounded-full bg-[#FFD52A] text-sm font-medium text-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-[#ffcc00] transition"
            >
              {showForm ? "Close" : "Share your story"}
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
                  title: "Category",
                  options: CATEGORY_FILTERS.map((cat) => ({
                    label: cat,
                    value: cat,
                  })),
                  activeValue: activeCategory,
                  onChange: (value) => setActiveCategory(value as typeof CATEGORY_FILTERS[number]),
                },
              ]}
            />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* SEARCH INPUT */}
            <div className="mb-6">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories..."
                className="w-full rounded-2xl bg-white border border-[#E5E5EA] px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD52A]/60"
              />
            </div>

          {/* MAIN LAYOUT */}
          <section className="grid lg:grid-cols-3 gap-6 text-xs">
            {/* STORIES LIST */}
            <div className="lg:col-span-2 space-y-5">
              {/* SORTING BAR */}
              <div className="bg-white border border-[color:var(--border-medium)] rounded-xl p-4 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-[color:var(--text-tertiary)]">
                    Stories are sorted by relevance and recency
                  </p>
                  <select className="px-4 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)] text-sm">
                    <option>Most saved</option>
                    <option>Most recent</option>
                    <option>Most relevant</option>
                  </select>
                </div>
              </div>

              {/* STORY CARDS */}
              <div className="space-y-5">
                {STORIES.length === 0 ? (
                  <div className="bg-gradient-to-br from-white to-yellow-50/30 border-2 border-yellow-200/60 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                    <div className="text-6xl">🌈</div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-yellow-900">
                        Hope Bank is waiting for its first story
                      </p>
                      <p className="text-sm text-[#7A674C] max-w-md mx-auto">
                        Be the first to share a moment when things shifted, when hope found a way in, or when you made it through. Your story might be the one someone else needs right now. 💛
                      </p>
                    </div>
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 rounded-full bg-[#FFD52A] text-sm font-medium text-[#111111] shadow-md hover:bg-[#ffcc00] transition-all inline-flex items-center gap-2"
                    >
                      <span>🌻</span>
                      <span>Share your first story</span>
                    </button>
                  </div>
                ) : filteredStories.length === 0 ? (
                  <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-5 text-xs text-[#7A674C] shadow-sm">
                    <p className="font-semibold text-yellow-900 mb-1">
                      No stories match that yet.
                    </p>
                    <p>
                      You can try a different word, switch category, or be the
                      first to share a story about this in Hope Bank. 🌻
                    </p>
                  </div>
                ) : null}

                {filteredStories.map((story) => {
                  const storyReactions = reactions[story.id] || {};

                  return (
                    <article
                      key={story.id}
                      className="bg-white border border-yellow-200/60 rounded-2xl p-5 md:p-6 space-y-3 shadow-sm hover:shadow-md hover:border-yellow-300/60 transition-all group max-w-4xl"
                    >
                      <div className="flex items-start gap-2">
                        {/* Author Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full ${getAvatarColor(
                            story.author
                          )} flex items-center justify-center text-xs font-semibold text-[#3A2E1F] shadow-sm flex-shrink-0`}
                        >
                          {getAuthorInitial(story.author)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-[#5C4A33]">
                              {story.isAnon ? "Anon" : story.author}
                            </span>
                            <span className="text-[10px] text-[#A08960]">
                              {story.timeAgo}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-200/60 text-[#3A2E1F] font-medium shadow-sm text-[9px]">
                              {story.category}
                            </span>
                          </div>

                          <h2 className="text-sm font-semibold text-yellow-900 leading-snug">
                            {story.title}
                          </h2>
                          <p className="text-xs text-[#5C4A33] leading-relaxed">{story.summary}</p>

                          <p className="text-[11px] text-[#7A674C] italic">
                            Turning point: {story.turningPoint}
                          </p>

                          <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200/60 hover:shadow-sm transition-all">
                                <ShimmerIcon>
                                  <span>📎</span>
                                </ShimmerIcon>
                                <span className="font-medium text-[10px]">Save</span>
                                <span className="text-[10px] text-[#A08960]">
                                  {story.saves}
                                </span>
                              </button>
                              <Link
                                href={`/hope-bank/${story.id}`}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200/60 hover:shadow-sm transition-all font-medium text-[10px]"
                              >
                                <ShimmerIcon>
                                  <span>👁️</span>
                                </ShimmerIcon>
                                <span>View full story</span>
                                <span>→</span>
                              </Link>
                            </div>
                          </div>

                          {/* REACTIONS ROW – Using new ReactionBar with room-specific config */}
                          <div className="pt-1">
                            <ReactionBar
                              roomId="hopeBank"
                              postId={story.id}
                              reactions={storyReactions}
                              onReactionToggle={(reactionId, active) =>
                                toggleReaction(story.id, reactionId, active)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="space-y-4">
              {/* BORROW SOME HOPE */}
              <div className="rounded-2xl bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 border border-yellow-200/60 px-4 py-4 flex items-center gap-3 shadow-md">
                <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                  😊
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-[#3A2E1F] text-xs">
                    Borrow some hope
                  </p>
                  <p className="text-[10px] text-[#7A674C] leading-relaxed">
                    These are real humans whose "it got better" didn&apos;t look
                    perfect either.
                  </p>
                </div>
              </div>

              {/* WHAT IS HOPE BANK */}
              <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-5 space-y-3 shadow-md">
                <p className="text-xs font-semibold text-yellow-900">
                  What is Hope Bank?
                </p>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  A growing collection of moments when things quietly turned a
                  corner: finances, health, work, love, family, faith and more.
                </p>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  These aren&apos;t miracle stories – just honest timelines that
                  remind you: stuck isn&apos;t permanent.
                </p>
              </div>

              {/* HOW TO SHARE */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 border border-orange-200/60 rounded-2xl p-5 space-y-3 shadow-md">
                <p className="text-xs font-semibold text-orange-900">
                  How to share a story
                </p>
                <ol className="space-y-2 text-xs text-[#6C4A33] list-decimal list-inside">
                  <li>Describe what was hard or felt impossible.</li>
                  <li>Mention the small or big turning point.</li>
                  <li>Share what you&apos;d tell someone in that place now.</li>
                  <li>
                    Choose to post with your name or anonymously.
                  </li>
                </ol>
              </div>

              {/* BOUNDARIES */}
              <div className="bg-white border border-yellow-200/60 rounded-2xl p-5 space-y-2 shadow-md">
                <p className="text-xs font-semibold text-yellow-900">
                  Gentle boundaries
                </p>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  This room is for stories where you&apos;re on the other side or at
                  least a little further along. For current crises or unsafe
                  situations, please seek local support or emergency help instead.
                </p>
              </div>
            </aside>
          </section>
          </main>
        </div>
      </div>
    </div>
  );
}
