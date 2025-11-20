"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";
import { BouncyButton, ShimmerIcon, LoadingState, ReactionBar } from "./ui";
import type { ReactionId } from "@/config/reactions";

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
    body: "It's been staring at me for 4 days and today I just did it while on a call. 10/10 recommend low-stakes multitasking.",
    author: "Dani",
    timeAgo: "2 hours ago",
    replies: 3,
  },
  {
    id: 2,
    type: "pickmeup",
    title: "Soft pick-me-up for job hunting",
    body: "Interviews keep falling through and I'm trying not to take it personally. Could use a gentle reminder that it's not over for me.",
    author: "Anon",
    timeAgo: "5 hours ago",
    replies: 7,
  },
  {
    id: 3,
    type: "softrant",
    title: "Everyone else seems to be 'thriving' online",
    body: "Logically I know it's curated, but lately social media has felt loud, performative and exhausting. Grateful this space exists tbh.",
    author: "Leah",
    timeAgo: "Yesterday",
    replies: 5,
  },
];

// User reactions are now stored as Record<ReactionId, boolean>
type UserReactions = Record<ReactionId, boolean>;

export default function LoungeRoom() {
  const [posts, setPosts] = useState<LoungePost[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("Today");
  const [showPickForm, setShowPickForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // per-post reactions for *this* viewer only
  const [reactions, setReactions] = useState<Record<number, UserReactions>>({});

  // track which posts are expanded
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  const [pickForm, setPickForm] = useState({
    title: "",
    body: "",
    authorName: "",
    isAnon: false,
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
        pickForm.isAnon
          ? "Anon"
          : pickForm.authorName.trim() || "You",
      timeAgo: "Just now",
      replies: 0,
    };

    setPosts([newPost, ...posts]);
    setPickForm({
      title: "",
      body: "",
      authorName: "",
      isAnon: false,
    });
    setSubmitting(false);
    setShowPickForm(false);
  }

  // toggle helper for reactions
  function toggleReaction(postId: number, reactionId: ReactionId, active: boolean) {
    setReactions((prev) => {
      const current = prev[postId] || {};
      return {
        ...prev,
        [postId]: {
          ...current,
          [reactionId]: active,
        },
      };
    });
  }

  // derive visible posts with search applied (using shared helper)
  const visiblePosts = posts.filter((post) =>
    matchesSearch([post.title, post.body, post.author], search)
  );

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

  // Toggle post expansion
  function togglePostExpansion(postId: number) {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }

  // Check if post body is long (more than ~280 characters, roughly 3-4 lines)
  function shouldTruncate(text: string): boolean {
    return text.length > 280;
  }

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
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960] font-medium">
                  Room
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-yellow-900">
                  The Lounge
                </h1>
                <p className="text-sm text-[#5C4A33] max-w-xl leading-relaxed">
                  A soft landing spot for the day. Share a small joy, ask for a
                  pick-me-up or gently rant about life without needing a perfect
                  takeaway.
                </p>
              </div>

              {/* SEARCH BAR - Modernized */}
              <div className="flex items-center gap-2 bg-white border border-yellow-200/60 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-yellow-300/50 focus-within:border-yellow-300">
                <span className="text-base">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Lounge posts (e.g. job hunt, burnout, tiny wins)"
                  className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-[#C0A987]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <BouncyButton variant="primary" size="sm" className="shadow-md">
                Share a small joy
              </BouncyButton>
              <BouncyButton
                onClick={() => setShowPickForm((s) => !s)}
                variant="secondary"
                size="sm"
              >
                {showPickForm ? "Close pick-me-up form" : "Ask for a pick-me-up"}
              </BouncyButton>
            </div>
          </section>

          {/* PICK-ME-UP SUBMISSION FORM - Modernized */}
          {showPickForm && (
            <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-5 md:p-6 space-y-4 text-xs md:text-sm shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <p className="text-base font-semibold text-yellow-900">
                  Ask for a pick-me-up 💛
                </p>
                <p className="text-[10px] text-[#A08960]">
                  You don&apos;t have to explain everything perfectly to be cared
                  for.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handlePickSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={pickForm.title}
                    onChange={(e) =>
                      setPickForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder='e.g. "Feeling behind on everything and a bit lost"'
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#5C4A33]">
                    What would you like to share?
                  </label>
                  <textarea
                    value={pickForm.body}
                    onChange={(e) =>
                      setPickForm((f) => ({ ...f, body: e.target.value }))
                    }
                    rows={3}
                    placeholder="You can say as little or as much as you want. No pressure to give all the context."
                    className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#5C4A33]">
                      Your name (or initials)
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
                      required={!pickForm.isAnon}
                      disabled={pickForm.isAnon}
                      placeholder='e.g. "Sarah" or "S."'
                      className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all disabled:bg-gray-50 disabled:text-gray-400"
                    />
                    <label className="inline-flex items-center gap-2 mt-2 text-xs text-[#7A674C]">
                      <input
                        type="checkbox"
                        checked={pickForm.isAnon}
                        onChange={(e) =>
                          setPickForm((f) => ({ ...f, isAnon: e.target.checked }))
                        }
                        className="rounded border-yellow-300 text-yellow-500 focus:ring-yellow-300"
                      />
                      <span>Post anonymously (still linked to your account)</span>
                    </label>
                  </div>

                  <div className="space-y-2 text-xs text-[#7A674C] bg-yellow-50/50 rounded-xl p-4 border border-yellow-100">
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

                <div className="flex items-center justify-between gap-3 pt-2">
                  <BouncyButton
                    type="submit"
                    disabled={submitting || !pickForm.body.trim()}
                    variant="primary"
                    size="sm"
                    className="shadow-md"
                  >
                    {submitting ? "Posting..." : "Post to Lounge"}
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
            {/* LEFT / CENTER: FEED */}
            <div className="lg:col-span-2 space-y-5">
              {/* FILTERS - Modern Segmented Control */}
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center bg-white border border-yellow-200/60 rounded-2xl p-1.5 shadow-sm w-fit">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                        activeFilter === filter
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-[#3A2E1F] shadow-md"
                          : "text-[#7A674C] hover:text-[#5C4A33] hover:bg-yellow-50/50"
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

              {/* FEED CARDS - Modernized */}
              <div className="space-y-4">
                {visiblePosts.length === 0 && (
                  <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-5 text-xs text-[#7A674C] shadow-sm">
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
                  const postReactions = reactions[post.id] || {};
                  const isExpanded = expandedPosts.has(post.id);
                  const needsTruncation = shouldTruncate(post.body);

                  return (
                    <article
                      key={post.id}
                      className="bg-white border border-yellow-200/60 rounded-xl p-3 space-y-2 shadow-sm hover:shadow-md hover:border-yellow-300/60 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        {/* Author Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full ${getAvatarColor(
                            post.author
                          )} flex items-center justify-center text-xs font-semibold text-[#3A2E1F] shadow-sm flex-shrink-0`}
                        >
                          {getAuthorInitial(post.author)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-[#5C4A33]">
                              {post.author}
                            </span>
                            <span className="text-[10px] text-[#A08960]">
                              {post.timeAgo}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                                post.type === "joy"
                                  ? "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-900"
                                  : post.type === "pickmeup"
                                  ? "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-900"
                                  : "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-900"
                              }`}
                            >
                              {post.type === "joy"
                                ? "Small joy"
                                : post.type === "pickmeup"
                                ? "Pick-me-up"
                                : "Soft rant"}
                            </span>
                          </div>

                          <h2 className="text-sm font-semibold text-yellow-900 leading-snug">
                            {post.title}
                          </h2>
                          <div>
                            <p className={`text-xs text-[#5C4A33] whitespace-pre-line leading-relaxed ${
                              needsTruncation && !isExpanded ? 'line-clamp-4' : ''
                            }`}>
                              {post.body}
                            </p>
                            {needsTruncation && (
                              <button
                                onClick={() => togglePostExpansion(post.id)}
                                className="text-[10px] text-yellow-700 hover:text-yellow-900 font-medium mt-1 hover:underline"
                              >
                                {isExpanded ? '...show less' : '...read full post'}
                              </button>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1">
                            {/* REACTIONS - Using new ReactionBar with room-specific config */}
                            <div className="flex-1">
                              <ReactionBar
                                roomId="lounge"
                                postId={post.id}
                                reactions={postReactions}
                                onReactionToggle={(reactionId, active) =>
                                  toggleReaction(post.id, reactionId, active)
                                }
                              />
                            </div>

                            <Link
                              href={`/lounge/${post.id}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-xs font-medium text-yellow-900 hover:text-yellow-950 transition-all hover:shadow-sm"
                            >
                              <ShimmerIcon>
                                <span className="text-sm">💬</span>
                              </ShimmerIcon>
                              <span>{post.replies} {post.replies === 1 ? 'reply' : 'replies'}</span>
                              <span>→</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: PROMPTS & BOUNDARIES - Modernized */}
            <aside className="space-y-4">
              <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-5 space-y-3 shadow-md">
                <p className="text-xs font-semibold text-yellow-900">
                  What belongs here
                </p>
                <ul className="space-y-2 text-xs text-[#7A674C]">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>One-line joys and tiny wins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>"I&apos;m finding today hard" check-ins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Soft rants that don&apos;t attack specific people</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Gentle encouragement and validation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 border border-orange-200/60 rounded-2xl p-5 space-y-3 shadow-md">
                <p className="text-xs font-semibold text-orange-900">
                  Need ideas?
                </p>
                <ul className="space-y-2 text-xs text-[#6C4A33]">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">💭</span>
                    <span>"Today I&apos;m grateful for…"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">💭</span>
                    <span>"One kind thing that happened recently was…"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">💭</span>
                    <span>"Something I&apos;m proud of but haven&apos;t said out loud is…"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">💭</span>
                    <span>"If you&apos;re reading this and struggling, here&apos;s a reminder…"</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-yellow-200/60 rounded-2xl p-5 space-y-2 shadow-md">
                <p className="text-xs font-semibold text-yellow-900">
                  Gentle boundaries
                </p>
                <p className="text-xs text-[#7A674C] leading-relaxed">
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
