"use client";

import { useState, type FormEvent } from "react";
import CommunitySidebar from "@/components/CommunitySidebar";
import { BouncyButton, Sunburst } from "@/components/ui";
import Link from "next/link";

type LoungePostType = "joy" | "pickmeup" | "softrant";

type LoungePost = {
  id: number;
  type: LoungePostType;
  title: string;
  body: string;
  author: string;
  timeAgo: string;
};

type LoungeReply = {
  id: number;
  author: string;
  timeAgo: string;
  body: string;
};

type UserReactions = {
  warmth: boolean;
  support: boolean;
  here: boolean;
};

const POSTS: LoungePost[] = [
  {
    id: 1,
    type: "joy",
    title: "Tiny win: I actually folded my laundry the same day",
    body: "It’s been staring at me for 4 days and today I just did it while on a call. 10/10 recommend low-stakes multitasking.",
    author: "Dani",
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    type: "pickmeup",
    title: "Soft pick-me-up for job hunting",
    body: "Interviews keep falling through and I’m trying not to take it personally. Could use a gentle reminder that it’s not over for me.",
    author: "Anon",
    timeAgo: "5 hours ago",
  },
  {
    id: 3,
    type: "softrant",
    title: "Everyone else seems to be ‘thriving’ online",
    body: "Logically I know it’s curated, but lately social media has felt loud, performative and exhausting. Grateful this space exists tbh.",
    author: "Leah",
    timeAgo: "Yesterday",
  },
];

const INITIAL_REPLIES_BY_POST: Record<number, LoungeReply[]> = {
  1: [
    {
      id: 1,
      author: "N.",
      timeAgo: "1 hour ago",
      body: "Honestly this is peak adulthood joy. Freshly folded stack >>> big life milestones sometimes 😂",
    },
    {
      id: 2,
      author: "J.",
      timeAgo: "45 min ago",
      body: "Love this reminder that ‘done-ish’ counts. I needed that today.",
    },
  ],
  2: [
    {
      id: 1,
      author: "L.",
      timeAgo: "3 hours ago",
      body: "You are not behind. The market is wild, not you. Something aligned with you is still on the way.",
    },
    {
      id: 2,
      author: "S.",
      timeAgo: "2 hours ago",
      body: "I had five rejections in a month and then got an offer I would never have applied for if someone hadn’t sent it. You’re allowed to rest and still be worthy.",
    },
  ],
  3: [
    {
      id: 1,
      author: "Anon",
      timeAgo: "20 hours ago",
      body: "Same. I’ve started muting half my feed and suddenly feel more human again.",
    },
  ],
};

function getBadgeStyles(type: LoungePostType) {
  switch (type) {
    case "joy":
      return "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-900";
    case "pickmeup":
      return "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-900";
    case "softrant":
      return "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-900";
  }
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

type PageProps = {
  params: { id: string };
};

export default function LoungeThreadPage({ params }: PageProps) {
  const id = Number(params.id);
  const post = POSTS.find((p) => p.id === id) ?? POSTS[0];
  const initialReplies = INITIAL_REPLIES_BY_POST[id] ?? [];

  const [replies, setReplies] = useState<LoungeReply[]>(initialReplies);
  const [replyText, setReplyText] = useState("");
  const [reactions, setReactions] = useState<UserReactions>({
    warmth: false,
    support: false,
    here: false,
  });

  // Toggle helper for reactions
  function toggleReaction(key: keyof UserReactions) {
    setReactions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function handleReplySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: LoungeReply = {
      id: replies.length + 1,
      author: "You",
      timeAgo: "Just now",
      body: replyText.trim(),
    };

    setReplies([...replies, newReply]);
    setReplyText("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: THREAD CONTENT */}
        <div className="md:col-span-3 space-y-6">
          {/* BREADCRUMB */}
          <div className="text-[11px] text-[#A08960] flex items-center gap-2">
            <Link
              href="/lounge"
              className="hover:underline hover:text-yellow-900 transition-colors"
            >
              The Lounge
            </Link>
            <span>/</span>
            <span className="text-[#7A674C] truncate">
              {post.title || "Post"}
            </span>
          </div>

          {/* MAIN POST CARD */}
          <article className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-5 md:p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-3">
              {/* Author Avatar */}
              <div
                className={`w-12 h-12 rounded-full ${getAvatarColor(
                  post.author
                )} flex items-center justify-center text-base font-semibold text-[#3A2E1F] shadow-md`}
              >
                {getAuthorInitial(post.author)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#5C4A33]">
                    {post.author}
                  </span>
                  <span className="text-[10px] text-[#A08960]">
                    {post.timeAgo}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${getBadgeStyles(
                    post.type
                  )}`}
                >
                  {post.type === "joy"
                    ? "Small joy"
                    : post.type === "pickmeup"
                    ? "Pick-me-up"
                    : "Soft rant"}
                </span>
              </div>
            </div>

            <h1 className="text-lg md:text-xl font-semibold text-yellow-900 leading-snug">
              {post.title}
            </h1>
            <p className="text-sm md:text-base text-[#5C4A33] whitespace-pre-line leading-relaxed">
              {post.body}
            </p>

            {/* INTERACTIVE REACTIONS */}
            <div className="flex flex-col gap-3 pt-2 border-t border-yellow-200/40">
              <div className="flex flex-wrap gap-2">
                <Sunburst
                  type="sunburst"
                  isActive={reactions.warmth}
                  onToggle={() => toggleReaction("warmth")}
                  showLabel
                  customLabel="Send warmth"
                />
                <Sunburst
                  type="heart"
                  isActive={reactions.support}
                  onToggle={() => toggleReaction("support")}
                  showLabel
                  customLabel="Gentle support"
                />
                <Sunburst
                  type="unity"
                  isActive={reactions.here}
                  onToggle={() => toggleReaction("here")}
                  showLabel
                  customLabel="Here with you"
                />
              </div>
              <p className="text-[9px] text-[#C0A987] italic">
                Reactions are for care, not counts. Only you see what you&apos;ve
                sent.
              </p>
            </div>
          </article>

          {/* REPLIES SECTION */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p className="text-sm font-semibold text-yellow-900">
                Replies ({replies.length})
              </p>
              <p className="text-[10px] text-[#A08960] italic">
                Reply with care. Imagine the version of you who posted this.
              </p>
            </div>

            <div className="space-y-3">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-white border border-yellow-200/60 rounded-2xl p-4 space-y-3 text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* Reply Author Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full ${getAvatarColor(
                        reply.author
                      )} flex items-center justify-center text-xs font-semibold text-[#3A2E1F] shadow-sm`}
                    >
                      {getAuthorInitial(reply.author)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#5C4A33]">
                          {reply.author}
                        </span>
                        <span className="text-[10px] text-[#A08960]">
                          {reply.timeAgo}
                        </span>
                      </div>
                      <p className="text-sm text-[#5C4A33] whitespace-pre-line leading-relaxed">
                        {reply.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {replies.length === 0 && (
                <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-dashed border-yellow-300/60 rounded-2xl p-5 text-sm text-[#7A674C] shadow-sm">
                  <p className="font-semibold text-yellow-900 mb-2">
                    No replies yet.
                  </p>
                  <p>
                    If you have the capacity, you can be the first gentle voice
                    to answer this.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* REPLY COMPOSER */}
          <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-5 md:p-6 space-y-4 shadow-lg">
            <div className="space-y-2">
              <p className="text-base font-semibold text-yellow-900">
                Add a gentle reply 💬
              </p>
              <p className="text-sm text-[#7A674C] leading-relaxed">
                You don&apos;t have to fix anything. A sentence or two of grounded
                kindness is more than enough.
              </p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="What would you say to yourself if you had posted this?"
                className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-none"
              />

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <BouncyButton
                  type="submit"
                  disabled={!replyText.trim()}
                  variant="primary"
                  size="md"
                  className="shadow-md"
                >
                  Post reply
                </BouncyButton>
                <p className="text-[10px] text-[#A08960] italic">
                  In future, you&apos;ll also be able to reply with images or GIFs –
                  always within gentle boundaries.
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
