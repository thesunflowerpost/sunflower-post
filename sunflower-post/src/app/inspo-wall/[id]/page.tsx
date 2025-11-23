"use client";

import { useState, type FormEvent } from "react";
import CommunitySidebar from "@/components/CommunitySidebar";
import { BouncyButton, ReactionBar } from "@/components/ui";
import GiphyPicker from "@/components/GiphyPicker";
import Link from "next/link";
import type { ReactionId } from "@/config/reactions";

type InspoPost = {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  quote?: string;
  category: string;
  tags?: string[];
  source?: string;
  sharedBy: string;
  timeAgo: string;
  saves?: number;
};

type InspoReply = {
  id: number;
  author: string;
  timeAgo: string;
  body: string;
  imageUrl?: string;
};

type UserReactions = Record<ReactionId, boolean>;

// Mock data
const POSTS: InspoPost[] = [
  {
    id: 1,
    title: "Golden hour in the mountains",
    description: "Saved this for those days when I need to remember there's beauty waiting",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
    category: "Nature",
    tags: ["mountains", "sunset", "peaceful"],
    sharedBy: "S.",
    timeAgo: "2 hours ago",
    saves: 24,
  },
  {
    id: 2,
    quote: "You're allowed to rest. You're allowed to take up space. You're allowed to be.",
    category: "Quotes & Words",
    sharedBy: "Anon",
    timeAgo: "5 hours ago",
    saves: 18,
  },
  {
    id: 3,
    title: "Cozy reading nook",
    description: "Dream corner for rainy afternoons",
    imageUrl: "https://images.unsplash.com/photo-1484581842645-42b8612c8f0d?w=800&h=1200&fit=crop",
    category: "Home & Spaces",
    tags: ["cozy", "reading", "interior"],
    sharedBy: "M.",
    timeAgo: "1 day ago",
    saves: 31,
  },
];

const INITIAL_REPLIES_BY_POST: Record<number, InspoReply[]> = {
  1: [
    {
      id: 1,
      author: "K.",
      timeAgo: "1 hour ago",
      body: "This is exactly the vibe I need today. Saving this for my mood board! 🌄",
    },
    {
      id: 2,
      author: "J.",
      timeAgo: "30 mins ago",
      body: "The colors in this are incredible. Where is this?",
    },
  ],
  2: [
    {
      id: 1,
      author: "M.",
      timeAgo: "3 hours ago",
      body: "Needed to hear this today. Thank you for sharing 💛",
    },
  ],
  3: [],
};

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

type PageProps = {
  params: { id: string };
};

export default function InspoWallThreadPage({ params }: PageProps) {
  const id = Number(params.id);
  const post = POSTS.find((p) => p.id === id) ?? POSTS[0];
  const initialReplies = INITIAL_REPLIES_BY_POST[id] ?? [];

  const [replies, setReplies] = useState<InspoReply[]>(initialReplies);
  const [replyText, setReplyText] = useState("");
  const [reactions, setReactions] = useState<UserReactions>({} as UserReactions);
  const [isSaved, setIsSaved] = useState(false);
  const [showGiphyPicker, setShowGiphyPicker] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  function toggleReaction(reactionId: ReactionId, active: boolean) {
    setReactions((prev) => ({
      ...prev,
      [reactionId]: active,
    }));
  }

  const handleGifSelect = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setShowGiphyPicker(false);
  };

  const handleSubmitReply = (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !selectedGif) return;

    const newReply: InspoReply = {
      id: Date.now(),
      author: "You",
      timeAgo: "Just now",
      body: replyText,
      imageUrl: selectedGif || undefined,
    };

    setReplies([...replies, newReply]);
    setReplyText("");
    setSelectedGif(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white border-b border-[color:var(--border-medium)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/inspo-wall"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
            >
              ← Back to Inspo Wall
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="lg:w-64 flex-shrink-0">
            <CommunitySidebar />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {/* POST CARD */}
            <div className="bg-white border border-[color:var(--border-medium)] rounded-xl overflow-hidden shadow-[var(--shadow-medium)] mb-6">
              {/* IMAGE */}
              {post.imageUrl && (
                <div className="relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title || "Inspiration"}
                    className="w-full h-auto max-h-[600px] object-cover"
                  />
                </div>
              )}

              {/* QUOTE */}
              {post.quote && !post.imageUrl && (
                <div className="p-12 bg-gradient-to-br from-[color:var(--sun-glow)] to-white">
                  <p className="text-2xl font-serif italic text-[color:var(--text-primary)] leading-relaxed text-center">
                    "{post.quote}"
                  </p>
                </div>
              )}

              {/* CONTENT */}
              <div className="p-6">
                {/* HEADER */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {post.title && (
                      <h1 className="text-2xl font-semibold text-[color:var(--text-primary)] mb-2">
                        {post.title}
                      </h1>
                    )}
                    {post.description && (
                      <p className="text-[color:var(--text-secondary)] leading-relaxed">
                        {post.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={[
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                      isSaved
                        ? "bg-[color:var(--sunflower-gold)] text-[color:var(--text-primary)]"
                        : "bg-gray-100 text-[color:var(--text-secondary)] hover:bg-gray-200",
                    ].join(" ")}
                  >
                    <span>{isSaved ? "✓" : "📌"}</span>
                    <span>{isSaved ? "Saved" : "Save"}</span>
                  </button>
                </div>

                {/* TAGS */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-sm px-3 py-1 bg-gray-100 text-[color:var(--text-tertiary)] rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* META */}
                <div className="flex items-center gap-3 text-sm text-[color:var(--text-tertiary)] mb-4 pb-4 border-b border-[color:var(--border-soft)]">
                  <span className="px-3 py-1 bg-[color:var(--sun-glow)] text-[color:var(--text-primary)] rounded-md font-medium">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span>Shared by {post.sharedBy}</span>
                  <span>•</span>
                  <span>{post.timeAgo}</span>
                  {post.saves && post.saves > 0 && (
                    <>
                      <span>•</span>
                      <span>{post.saves} saves</span>
                    </>
                  )}
                </div>

                {/* REACTIONS */}
                <div className="mb-4">
                  <ReactionBar
                    roomId="inspo-wall"
                    postId={post.id}
                    reactions={reactions}
                    onReactionToggle={toggleReaction}
                  />
                </div>
              </div>
            </div>

            {/* REPLIES SECTION */}
            <div className="bg-white border border-[color:var(--border-medium)] rounded-xl p-6 shadow-[var(--shadow-medium)]">
              <h2 className="text-xl font-semibold text-[color:var(--text-primary)] mb-4">
                Comments {replies.length > 0 && `(${replies.length})`}
              </h2>

              {/* REPLY FORM */}
              <form onSubmit={handleSubmitReply} className="mb-6">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full px-4 py-3 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)] resize-none"
                />

                {/* GIF PREVIEW */}
                {selectedGif && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={selectedGif}
                      alt="Selected GIF"
                      className="rounded-lg max-w-xs max-h-48 border border-[color:var(--border-medium)]"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedGif(null)}
                      className="absolute -top-2 -right-2 bg-[color:var(--text-primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-[color:var(--text-secondary)] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={() => setShowGiphyPicker(true)}
                    className="text-sm px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors font-medium"
                  >
                    🎬 Add GIF
                  </button>
                  <BouncyButton
                    type="submit"
                    disabled={!replyText.trim() && !selectedGif}
                    className="bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] disabled:bg-gray-200 disabled:text-gray-400 text-[color:var(--text-primary)] px-6 py-2 rounded-lg font-medium shadow-[var(--shadow-soft)] transition-colors"
                  >
                    Post Comment
                  </BouncyButton>
                </div>
              </form>

              {/* REPLIES LIST */}
              <div className="space-y-4">
                {replies.length === 0 ? (
                  <p className="text-center text-[color:var(--text-tertiary)] py-8">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="flex gap-3 p-4 rounded-lg bg-gray-50 border border-[color:var(--border-soft)]"
                    >
                      {/* AVATAR */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getAvatarColor(
                          reply.author
                        )}`}
                      >
                        {getAuthorInitial(reply.author)}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-[color:var(--text-primary)]">
                            {reply.author}
                          </span>
                          <span className="text-xs text-[color:var(--text-tertiary)]">
                            {reply.timeAgo}
                          </span>
                        </div>
                        <p className="text-[color:var(--text-secondary)] leading-relaxed">
                          {reply.body}
                        </p>
                        {reply.imageUrl && (
                          <img
                            src={reply.imageUrl}
                            alt="Reply attachment"
                            className="mt-2 rounded-lg max-w-xs"
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* GIPHY PICKER MODAL */}
      {showGiphyPicker && (
        <GiphyPicker onSelect={handleGifSelect} onClose={() => setShowGiphyPicker(false)} />
      )}
    </div>
  );
}
