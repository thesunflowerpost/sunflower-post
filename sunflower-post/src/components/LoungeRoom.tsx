"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";

type LoungePostType = "joy" | "pickmeup" | "softrant";

type LoungePost = {
  id: number;
  type: LoungePostType;
  title: string;
  body: string;
  author: string;
  timeAgo: string;
  replies: number;
};

const FILTERS = ["Today", "This week", "All time", "Needs love"] as const;

const INITIAL_POSTS: LoungePost[] = [
  {
    id: 1,
    type: "joy",
    title: "Tiny win: I actually folded my laundry the same day",
    body: "It’s been staring at me for 4 days and today I just did it while on a call. 10/10 recommend low-stakes multitasking.",
    author: "Dani",
    timeAgo: "2 hours ago",
    replies: 3,
  },
  {
    id: 2,
    type: "pickmeup",
    title: "Soft pick-me-up for job hunting",
    body: "Interviews keep falling through and I’m trying not to take it personally. Could use a gentle reminder that it’s not over for me.",
    author: "Anon",
    timeAgo: "5 hours ago",
    replies: 7,
  },
  {
    id: 3,
    type: "softrant",
    title: "Everyone else seems to be ‘thriving’ online",
    body: "Logically I know it’s curated, but lately social media has felt loud, performative and exhausting. Grateful this space exists tbh.",
    author: "Leah",
    timeAgo: "Yesterday",
    replies: 5,
  },
];

type UserReactions = {
  warmth: boolean;
  support: boolean;
  here: boolean;
};

export default function LoungeRoom() {
  const [posts, setPosts] = useState<LoungePost[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("Today");
  const [showPickForm, setShowPickForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // per-post reactions for *this* viewer only
  const [reactions, setReactions] = useState<Record<number, UserReactions>>({});

  const [pickForm, setPickForm] = useState({
    title: "",
    body: "",
    authorName: "",
    isAnon: true,
  });

  // NEW: search state
  const [search, setSearch] = useState("");

  function handlePickSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pickForm.body.trim() && !pickForm.title.trim()) return;

    setSubmitting(true);

    const newPost: LoungePost = {
      id: posts.length + 1,
      type: "pickmeup",
      title:
        pickForm.title.trim() ||
        "Could use a gentle reminder that things can change",
      body:
        pickForm.body.trim() ||
        "Just having one or two kind words would mean a lot today.",
      author:
        pickForm.isAnon || !pickForm.authorName.trim()
          ? "Anon"
          : pickForm.authorName.trim(),
      timeAgo: "Just now",
      replies: 0,
    };

    setPosts([newPost, ...posts]);
    setPickForm({
      title: "",
      body: "",
      authorName: "",
      isAnon: true,
    });
    setSubmitting(false);
    setShowPickForm(false);
  }

  // toggle helper for reactions
  function toggleReaction(postId: number, key: keyof UserReactions) {
    setReactions((prev) => {
      const current = prev[postId] || {
        warmth: false,
        support: false,
        here: false,
      };
      return {
        ...prev,
        [postId]: {
          ...current,
          [key]: !current[key],
        },
      };
    });
  }

  // derive visible posts with search applied (using shared helper)
  const visiblePosts = posts.filter((post) =>
    matchesSearch([post.title, post.body, post.author], search)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: LOUNGE CONTENT */}
        <div className="md:col-span-3 space-y-8">
          {/* HEADER ROW */}
          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 md:max-w-xl">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960]">
                  Room
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-yellow-900">
                  The Lounge
                </h1>
                <p className="text-xs md:text-sm text-[#5C4A33] max-w-xl">
                  A soft landing spot for the day. Share a small joy, ask for a
                  pick-me-up or gently rant about life without needing a perfect
                  takeaway.
                </p>
              </div>

              {/* NEW SEARCH BAR */}
              <div className="flex items-center gap-2 bg-white border border-yellow-100 rounded-full px-3 py-1 shadow-sm">
                <span>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Lounge posts (e.g. job hunt, burnout, tiny wins)"
                  className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:text-[#C0A987]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <button className="px-3 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-sm">
                Share a small joy
              </button>
              <button
                onClick={() => setShowPickForm((s) => !s)}
                className="px-3 py-2 rounded-full border border-yellow-200 bg-white hover:bg-yellow-50 text-[#5C4A33]"
              >
                {showPickForm ? "Close pick-me-up form" : "Ask for a pick-me-up"}
              </button>
            </div>
          </section>

          {/* PICK-ME-UP SUBMISSION FORM */}
          {showPickForm && (
            <section className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3 text-xs md:text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-yellow-900">
                  Ask for a pick-me-up 💛
                </p>
                <p className="text-[10px] text-[#A08960]">
                  You don&apos;t have to explain everything perfectly to be cared
                  for.
                </p>
              </div>

              <form className="space-y-3" onSubmit={handlePickSubmit}>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#5C4A33]">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={pickForm.title}
                    onChange={(e) =>
                      setPickForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder='e.g. "Feeling behind on everything and a bit lost"'
                    className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#5C4A33]">
                    What would you like to share?
                  </label>
                  <textarea
                    value={pickForm.body}
                    onChange={(e) =>
                      setPickForm((f) => ({ ...f, body: e.target.value }))
                    }
                    rows={3}
                    placeholder="You can say as little or as much as you want. No pressure to give all the context."
                    className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3 items-start">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      value={pickForm.authorName}
                      onChange={(e) =>
                        setPickForm((f) => ({
                          ...f,
                          authorName: e.target.value,
                        }))
                      }
                      placeholder="Leave blank or use an initial if you prefer."
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                    <label className="inline-flex items-center gap-2 mt-1 text-[11px] text-[#7A674C]">
                      <input
                        type="checkbox"
                        checked={pickForm.isAnon}
                        onChange={(e) =>
                          setPickForm((f) => ({ ...f, isAnon: e.target.checked }))
                        }
                        className="rounded border-yellow-300"
                      />
                      <span>Post as anonymous</span>
                    </label>
                  </div>

                  <div className="space-y-1 text-[11px] text-[#7A674C]">
                    <p className="font-medium text-yellow-900">Gentle boundaries</p>
                    <ul className="space-y-1">
                      <li>• No graphic detail or explicit harm.</li>
                      <li>• Don&apos;t name other people or organisations directly.</li>
                      <li>
                        • This isn&apos;t a crisis line – please seek local support if
                        you&apos;re unsafe.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || !pickForm.body.trim()}
                    className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
                  >
                    {submitting ? "Posting..." : "Post to Lounge"}
                  </button>
                  <p className="text-[10px] text-[#A08960]">
                    Your post may be gently moderated for safety and tone.
                  </p>
                </div>
              </form>
            </section>
          )}

          {/* MAIN LAYOUT */}
          <section className="grid lg:grid-cols-3 gap-6 text-xs">
            {/* LEFT / CENTER: FEED */}
            <div className="lg:col-span-2 space-y-4">
              {/* FILTERS */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-full border text-[11px] ${
                        activeFilter === filter
                          ? "bg-yellow-100 border-yellow-200 text-[#5C4A33] font-medium"
                          : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#A08960]">
                  Posts with no replies are gently bumped so no-one feels ignored.
                </p>
              </div>

              {/* FEED CARDS */}
              <div className="space-y-3">
                {visiblePosts.length === 0 && (
                  <div className="bg-white border border-yellow-100 rounded-2xl p-4 text-[11px] text-[#7A674C]">
                    <p className="font-semibold text-yellow-900 mb-1">
                      No posts match that yet.
                    </p>
                    <p>
                      You can try a different word… or maybe post the thing you were
                      searching for. Someone else probably needs it too. 🌻
                    </p>
                  </div>
                )}

                {visiblePosts.map((post) => {
                  const postReactions =
                    reactions[post.id] || {
                      warmth: false,
                      support: false,
                      here: false,
                    };

                  return (
                    <article
                      key={post.id}
                      className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 hover:border-yellow-200 transition"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                        <span
                          className={`px-2 py-[2px] rounded-full border ${
                            post.type === "joy"
                              ? "bg-yellow-50 border-yellow-100 text-[#5C4A33]"
                              : post.type === "pickmeup"
                              ? "bg-[#FDF5FF] border-[#E7D3FF] text-[#5B4377]"
                              : "bg-[#FDF4EC] border-[#F3C9A3] text-[#6C4A33]"
                          }`}
                        >
                          {post.type === "joy"
                            ? "Small joy"
                            : post.type === "pickmeup"
                            ? "Pick-me-up"
                            : "Soft rant"}
                        </span>
                        <span>{post.timeAgo}</span>
                      </div>

                      <h2 className="text-sm font-semibold text-yellow-900">
                        {post.title}
                      </h2>
                      <p className="text-[#5C4A33] whitespace-pre-line">
                        {post.body}
                      </p>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
                          <span>By {post.author}</span>
                          <Link
                            href={`/lounge/${post.id}`}
                            className="flex items-center gap-1 hover:text-yellow-900"
                          >
                            <span>💬</span>
                            <span>{post.replies} replies</span>
                          </Link>
                        </div>

                        {/* REACTIONS ROW */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => toggleReaction(post.id, "warmth")}
                              className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                                postReactions.warmth
                                  ? "bg-yellow-200 border-yellow-300 text-[#3A2E1F]"
                                  : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                              }`}
                            >
                              <span>🌻</span>
                              <span>Send warmth</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                toggleReaction(post.id, "support")
                              }
                              className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                                postReactions.support
                                  ? "bg-[#F5F3FF] border-[#D9D2FF] text-[#40325F]"
                                  : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                              }`}
                            >
                              <span>🤍</span>
                              <span>Gentle support</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleReaction(post.id, "here")}
                              className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                                postReactions.here
                                  ? "bg-[#FEF3C7] border-[#FACC15] text-[#3A2E1F]"
                                  : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
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

            {/* RIGHT: PROMPTS & BOUNDARIES */}
            <aside className="space-y-4">
              <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  What belongs here
                </p>
                <ul className="space-y-1 text-[#7A674C]">
                  <li>• One-line joys and tiny wins</li>
                  <li>• “I&apos;m finding today hard” check-ins</li>
                  <li>• Soft rants that don&apos;t attack specific people</li>
                  <li>• Gentle encouragement and validation</li>
                </ul>
              </div>

              <div className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  Need ideas?
                </p>
                <ul className="space-y-1 text-[#7A674C]">
                  <li>• “Today I&apos;m grateful for…”</li>
                  <li>• “One kind thing that happened recently was…”</li>
                  <li>• “Something I&apos;m proud of but haven&apos;t said out loud is…”</li>
                  <li>• “If you&apos;re reading this and struggling, here&apos;s a reminder…”</li>
                </ul>
              </div>

              <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  Gentle boundaries
                </p>
                <p className="text-[#7A674C]">
                  It&apos;s okay to be honest and messy here. Just keep details
                  non-graphic, avoid call-outs, and remember this isn&apos;t a crisis
                  line. Reach out to offline support if you&apos;re feeling unsafe.
                </p>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
