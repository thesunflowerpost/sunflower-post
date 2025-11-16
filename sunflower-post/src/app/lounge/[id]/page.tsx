"use client";

import { useState, type FormEvent } from "react";
import CommunitySidebar from "@/components/CommunitySidebar";
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
      return "bg-yellow-50 border-yellow-100 text-[#5C4A33]";
    case "pickmeup":
      return "bg-[#FDF5FF] border-[#E7D3FF] text-[#5B4377]";
    case "softrant":
      return "bg-[#FDF4EC] border-[#F3C9A3] text-[#6C4A33]";
  }
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
            <Link href="/lounge" className="hover:underline">
              The Lounge
            </Link>
            <span>/</span>
            <span className="text-[#7A674C] truncate">
              {post.title || "Post"}
            </span>
          </div>

          {/* MAIN POST CARD */}
          <article className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between text-[10px] text-[#A08960]">
              <span
                className={`px-2 py-[2px] rounded-full border ${getBadgeStyles(
                  post.type
                )}`}
              >
                {post.type === "joy"
                  ? "Small joy"
                  : post.type === "pickmeup"
                  ? "Pick-me-up"
                  : "Soft rant"}
              </span>
              <span>{post.timeAgo}</span>
            </div>

            <h1 className="text-base md:text-lg font-semibold text-yellow-900">
              {post.title}
            </h1>
            <p className="text-xs md:text-sm text-[#5C4A33] whitespace-pre-line">
              {post.body}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#7A674C] pt-1">
              <span>By {post.author}</span>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <span className="px-2.5 py-1 rounded-full border border-yellow-100 bg-yellow-50 flex items-center gap-1">
                  <span>🌻</span>
                  <span>People sent warmth</span>
                </span>
                <span className="px-2.5 py-1 rounded-full border border-yellow-100 bg-[#F5F3FF] flex items-center gap-1">
                  <span>🤍</span>
                  <span>Gentle support</span>
                </span>
                <span className="px-2.5 py-1 rounded-full border border-yellow-100 bg-[#FEF3C7] flex items-center gap-1">
                  <span>💛</span>
                  <span>Here with you</span>
                </span>
              </div>
            </div>
          </article>

          {/* REPLIES SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-yellow-900">
                Replies ({replies.length})
              </p>
              <p className="text-[10px] text-[#A08960]">
                Reply with care. Imagine the version of you who posted this.
              </p>
            </div>

            <div className="space-y-3">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                    <span>By {reply.author}</span>
                    <span>{reply.timeAgo}</span>
                  </div>
                  <p className="text-[#5C4A33] whitespace-pre-line">
                    {reply.body}
                  </p>
                </div>
              ))}

              {replies.length === 0 && (
                <div className="bg-white border border-dashed border-yellow-200 rounded-2xl p-4 text-[11px] text-[#7A674C]">
                  <p className="font-semibold text-yellow-900 mb-1">
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
          <section className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 space-y-3 text-xs">
            <p className="font-semibold text-yellow-900">
              Add a gentle reply 💬
            </p>
            <p className="text-[11px] text-[#7A674C]">
              You don&apos;t have to fix anything. A sentence or two of grounded
              kindness is more than enough.
            </p>

            <form onSubmit={handleReplySubmit} className="space-y-3">
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="What would you say to yourself if you had posted this?"
                className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
                >
                  Post reply
                </button>
                <p className="text-[10px] text-[#A08960]">
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
