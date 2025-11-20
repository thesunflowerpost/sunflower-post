"use client";

import { matchesSearch } from "@/lib/search";
import { useState } from "react";
import Link from "next/link";
import CommunitySidebar from "./CommunitySidebar";

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

type UserReactions = {
  warmth: boolean;
  support: boolean;
  here: boolean;
};

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

  function toggleReaction(storyId: number, key: keyof UserReactions) {
    setReactions((prev) => {
      const current = prev[storyId] || {
        warmth: false,
        support: false,
        here: false,
      };
      return {
        ...prev,
        [storyId]: {
          ...current,
          [key]: !current[key],
        },
      };
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      {/* TWO-COLUMN LAYOUT: SIDEBAR + MAIN, LIKE CIRCLE */}
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: HOPE BANK CONTENT */}
        <div className="md:col-span-3 space-y-8">
          {/* HEADER */}
          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            {/* LEFT: TEXT + SEARCH */}
            <div className="space-y-3 md:max-w-xl">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960]">
                  Room
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-yellow-900">
                  Hope Bank
                </h1>
                <p className="text-xs md:text-sm text-[#5C4A33]">
                  A library of real stories about things quietly getting better.
                  For the days when you&apos;re tired of “it will all work out” and
                  need proof from people who have been there.
                </p>
              </div>

              {/* SEARCH INPUT – under description */}
              <div className="flex items-center gap-2 bg-white border border-yellow-200/60 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-yellow-300/50 focus-within:border-yellow-300">
                <span className="text-base">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories (e.g. visa, burnout, PCOS, overdraft)"
                  className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-[#C0A987]"
                />
              </div>
            </div>

            {/* RIGHT: HERO TILE + BUTTONS */}
            <div className="flex flex-col items-stretch gap-3 text-[11px] w-full md:w-56">
              {/* Little dopamine / personality tile */}
              <div className="rounded-2xl bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 border border-yellow-200/60 px-3 py-3 flex items-center gap-3 shadow-md">
                <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg shadow-sm">
                  😊
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-[#3A2E1F] text-[11px]">
                    Borrow some hope
                  </p>
                  <p className="text-[10px] text-[#7A674C]">
                    These are real humans whose "it got better" didn&apos;t look
                    perfect either.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end md:justify-start">
                <button className="px-3 py-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#3A2E1F] font-semibold shadow-md hover:shadow-lg transition-all">
                  Share a hope story
                </button>
                <button className="px-3 py-2 rounded-full border border-yellow-200/60 bg-white hover:bg-yellow-50 text-[#5C4A33] shadow-sm hover:shadow-md transition-all">
                  Save this room
                </button>
              </div>
            </div>
          </section>

          {/* MAIN LAYOUT */}
          <section className="grid lg:grid-cols-3 gap-6 text-xs">
            {/* STORIES LIST */}
            <div className="lg:col-span-2 space-y-4">
              {/* FILTER BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_FILTERS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all ${
                        activeCategory === cat
                          ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-200/60 text-[#3A2E1F] font-semibold shadow-sm"
                          : "bg-white border-yellow-200/60 text-[#7A674C] hover:bg-yellow-50 hover:border-yellow-300/60"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#7A674C]">
                  <span>Sort by</span>
                  <select className="border border-yellow-200/60 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 shadow-sm hover:shadow-md transition-all">
                    <option>Most saved</option>
                    <option>Most recent</option>
                    <option>Most relevant</option>
                  </select>
                </div>
              </div>

              {/* STORY CARDS */}
              <div className="space-y-4">
                {filteredStories.length === 0 && (
                  <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-5 text-xs text-[#7A674C] shadow-sm">
                    <p className="font-semibold text-yellow-900 mb-1">
                      No stories match that yet.
                    </p>
                    <p>
                      You can try a different word, switch category, or be the
                      first to share a story about this in Hope Bank. 🌻
                    </p>
                  </div>
                )}

                {filteredStories.map((story) => {
                  const storyReactions =
                    reactions[story.id] || {
                      warmth: false,
                      support: false,
                      here: false,
                    };

                  return (
                    <article
                      key={story.id}
                      className="bg-white border border-yellow-200/60 rounded-2xl p-4 space-y-3 shadow-sm hover:shadow-md hover:border-yellow-300/60 transition-all group"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                        <span className="px-2 py-1 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-200/60 text-[#3A2E1F] font-medium shadow-sm">
                          {story.category}
                        </span>
                        <span>{story.timeAgo}</span>
                      </div>

                      <h2 className="text-sm font-semibold text-yellow-900">
                        {story.title}
                      </h2>
                      <p className="text-[#5C4A33]">{story.summary}</p>

                      <p className="text-[11px] text-[#7A674C] italic">
                        Turning point: {story.turningPoint}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
                          <span className="font-medium">
                            By{" "}
                            {story.isAnon ? (
                              <span>Anon</span>
                            ) : (
                              <span>{story.author}</span>
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200/60 hover:shadow-sm transition-all">
                              <span>📎</span>
                              <span className="font-medium">Save</span>
                              <span className="text-[10px] text-[#A08960]">
                                {story.saves}
                              </span>
                            </button>
                            <Link
                              href={`/hope-bank/${story.id}`}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200/60 hover:shadow-sm transition-all font-medium"
                            >
                              <span>👁️</span>
                              <span>View full story</span>
                            </Link>
                          </div>
                        </div>

                        {/* REACTIONS ROW – similar to Lounge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => toggleReaction(story.id, "warmth")}
                              className={`px-2.5 py-1.5 rounded-full border text-[10px] flex items-center gap-1 transition-all ${
                                storyReactions.warmth
                                  ? "bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-300/60 text-[#3A2E1F] shadow-sm font-medium"
                                  : "bg-white border-yellow-200/60 text-[#7A674C] hover:bg-yellow-50 hover:border-yellow-300/60"
                              }`}
                            >
                              <span>🌻</span>
                              <span>Send warmth</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleReaction(story.id, "support")}
                              className={`px-2.5 py-1.5 rounded-full border text-[10px] flex items-center gap-1 transition-all ${
                                storyReactions.support
                                  ? "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200/60 text-[#40325F] shadow-sm font-medium"
                                  : "bg-white border-yellow-200/60 text-[#7A674C] hover:bg-yellow-50 hover:border-yellow-300/60"
                              }`}
                            >
                              <span>🤍</span>
                              <span>Gentle support</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleReaction(story.id, "here")}
                              className={`px-2.5 py-1.5 rounded-full border text-[10px] flex items-center gap-1 transition-all ${
                                storyReactions.here
                                  ? "bg-gradient-to-br from-yellow-200 to-amber-200 border-yellow-300/60 text-[#3A2E1F] shadow-sm font-medium"
                                  : "bg-white border-yellow-200/60 text-[#7A674C] hover:bg-yellow-50 hover:border-yellow-300/60"
                              }`}
                            >
                              <span>💛</span>
                              <span>Here with you</span>
                            </button>
                          </div>
                          <p className="text-[9px] text-[#C0A987]">
                            Reactions are for care, not counts. Only you see what
                            you&apos;ve sent.
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="space-y-4">
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
                    Choose whether to post with your name or anonymously.
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
        </div>
      </div>
    </div>
  );
}
