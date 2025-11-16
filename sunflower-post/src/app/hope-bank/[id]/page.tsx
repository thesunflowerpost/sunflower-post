"use client";

import { useState, type FormEvent } from "react";
import CommunitySidebar from "@/components/CommunitySidebar";
import Link from "next/link";

type HopeStory = {
  id: number;
  title: string;
  summary: string;
  fullStory: string;
  category: "Career" | "Health" | "Family" | "Money" | "Faith" | "Other";
  turningPoint: string;
  author: string;
  isAnon: boolean;
  timeAgo: string;
};

type HopeReply = {
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

const STORIES: HopeStory[] = [
  {
    id: 1,
    title: "I got rejected from 12 roles… and then landed the one that actually fit",
    summary:
      "I was convinced I’d missed my moment. The role I finally got didn’t even exist when I started applying.",
    fullStory:
      "For about eight months I lived in a loop of interviews, rejections and long silences. Every “we went with another candidate” felt like proof that I’d peaked already.\n\nThe turning point was a friend forwarding me a role I felt underqualified for and making me apply anyway. The job description read like it was written for a future version of me, not the current one.\n\nI almost didn’t send the application. I wrote it from bed, half convinced it was a waste of time. Two interviews later I realised: they weren’t looking for a perfectly linear CV, they were looking for the way I think.\n\nThe role I’m in now didn’t even exist when I sent my first applications. That helped me stop treating every “no” as the final word. Sometimes the thing that fits you is still being built.",
    category: "Career",
    turningPoint: "A friend made me apply for a role I felt underqualified for.",
    author: "S.",
    isAnon: true,
    timeAgo: "3 days ago",
  },
  {
    id: 2,
    title: "The scary health letter that turned out to be a second chance",
    summary:
      "I ignored symptoms for months. The diagnosis was early enough to change everything.",
    fullStory:
      "When the letter came through I left it on the kitchen table for three days. I’d been ignoring small symptoms for months because I didn’t want to be “dramatic”.\n\nThe nurse who did my tests looked me in the eye and said, “I’m glad you came in today.” That sentence sits in the back of my mind now.\n\nThe diagnosis wasn’t nothing, but it also wasn’t the worst-case scenario my brain had been rehearsing at 3am. We caught it early. There were options. There was a plan.\n\nMy life is slower now. I cancel things. I go to my check-ups. And every time I do, I feel like I’m quietly choosing myself again.",
    category: "Health",
    turningPoint: "A nurse quietly told me, “I’m glad you came in today.”",
    author: "Leah",
    isAnon: false,
    timeAgo: "1 week ago",
  },
  {
    id: 3,
    title: "We were sure we’d never get out of overdraft",
    summary:
      "It felt impossible to imagine a month without dread. It took longer than we hoped, but it did shift.",
    fullStory:
      "For a long time, our bank balance felt like background noise – always humming just below zero. We weren’t being reckless; we were just always one invoice or one emergency away from the edge.\n\nThe turning point wasn’t one huge windfall. It was one unexpected grant that stopped the immediate free-fall, plus a painfully honest call with the bank where we showed them everything.\n\nWe made a boring spreadsheet. We made small rules. It took eighteen months to feel any different. But the first month we weren’t in overdraft on the 15th? I cried in the supermarket aisle.\n\nWe’re not suddenly rich. Things still happen. But the story in my head changed from “we’re terrible with money” to “we survived a really tight chapter and we’re slowly writing a different one.”",
    category: "Money",
    turningPoint:
      "One unexpected grant and a very honest conversation with our bank.",
    author: "Anon",
    isAnon: true,
    timeAgo: "2 weeks ago",
  },
];

const INITIAL_REPLIES_BY_STORY: Record<number, HopeReply[]> = {
  1: [
    {
      id: 1,
      author: "K.",
      timeAgo: "1 day ago",
      body: "I really needed to hear that the right role might not even exist yet. Thank you for sharing this.",
    },
  ],
  2: [
    {
      id: 1,
      author: "M.",
      timeAgo: "3 days ago",
      body: "That line from the nurse made me cry a bit ngl. Booking my check-up this week.",
    },
  ],
  3: [
    {
      id: 1,
      author: "R.",
      timeAgo: "5 days ago",
      body: "The supermarket aisle bit got me. We’re in the spreadsheet chapter now too. This gave me hope.",
    },
  ],
};

type PageProps = {
  params: { id: string };
};

export default function HopeBankStoryPage({ params }: PageProps) {
  const id = Number(params.id);
  const story = STORIES.find((s) => s.id === id) ?? STORIES[0];

  const initialReplies = INITIAL_REPLIES_BY_STORY[id] ?? [];
  const [replies, setReplies] = useState<HopeReply[]>(initialReplies);
  const [replyText, setReplyText] = useState("");

  // per-story reactions for THIS viewer only
  const [reactions, setReactions] = useState<UserReactions>({
    warmth: false,
    support: false,
    here: false,
  });

  function handleReplySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: HopeReply = {
      id: replies.length + 1,
      author: "You",
      timeAgo: "Just now",
      body: replyText.trim(),
    };

    setReplies([...replies, newReply]);
    setReplyText("");
  }

  function toggleReaction(key: keyof UserReactions) {
    setReactions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: STORY CONTENT */}
        <div className="md:col-span-3 space-y-6">
          {/* BREADCRUMB */}
          <div className="text-[11px] text-[#A08960] flex items-center gap-2">
            <Link href="/hope-bank" className="hover:underline">
              Hope Bank
            </Link>
            <span>/</span>
            <span className="text-[#7A674C] truncate">
              {story.title || "Story"}
            </span>
          </div>

          {/* HERO CARD */}
          <section className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#A08960]">
              <span className="px-2 py-[2px] rounded-full bg-yellow-50 border border-yellow-100 text-[#5C4A33]">
                {story.category}
              </span>
              <span>{story.timeAgo}</span>
            </div>

            <h1 className="text-base md:text-lg font-semibold text-yellow-900">
              {story.title}
            </h1>

            <p className="text-xs md:text-sm text-[#7A674C]">
              Turning point:{" "}
              <span className="italic">{story.turningPoint}</span>
            </p>

            <p className="text-xs md:text-sm text-[#5C4A33] whitespace-pre-line leading-relaxed">
              {story.fullStory}
            </p>

            {/* AUTHOR + SAVE + REACTIONS */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#7A674C]">
                <span>
                  By{" "}
                  {story.isAnon ? (
                    <span>Anon</span>
                  ) : (
                    <span>{story.author}</span>
                  )}
                </span>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <button className="px-3 py-1 rounded-full border border-yellow-200 bg-yellow-50 flex items-center gap-1">
                    <span>📎</span>
                    <span>Save story</span>
                  </button>
                  <button className="px-3 py-1 rounded-full border border-yellow-100 bg-white hover:bg-yellow-50">
                    Share (coming soon)
                  </button>
                </div>
              </div>

              {/* REACTIONS ROW – same vibe as Lounge & Hope Bank list */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleReaction("warmth")}
                    className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                      reactions.warmth
                        ? "bg-yellow-200 border-yellow-300 text-[#3A2E1F]"
                        : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                    }`}
                  >
                    <span>🌻</span>
                    <span>Send warmth</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleReaction("support")}
                    className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                      reactions.support
                        ? "bg-[#F5F3FF] border-[#D9D2FF] text-[#40325F]"
                        : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                    }`}
                  >
                    <span>🤍</span>
                    <span>Gentle support</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleReaction("here")}
                    className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 ${
                      reactions.here
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
          </section>

          {/* HOPE-FRAME */}
          <section className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 space-y-2 text-xs">
            <p className="font-semibold text-yellow-900">
              For whoever needed this today
            </p>
            <p className="text-[#5C4A33]">
              You don&apos;t have to know how your story resolves yet. It&apos;s
              enough that you&apos;re still here, still curious whether things can
              shift. Hope Bank is proof that “stuck” can be a chapter, not the
              whole book.
            </p>
          </section>

          {/* REPLIES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-yellow-900">
                Reflections ({replies.length})
              </p>
              <p className="text-[10px] text-[#A08960]">
                Share how this story landed for you – without turning it into
                advice.
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
                    No reflections yet.
                  </p>
                  <p>
                    If this story gave you even a tiny bit of hope, you can
                    leave a note for the next person who lands here.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* REPLY COMPOSER */}
          <section className="bg-[#FFFDF6] border border-yellow-100 rounded-2xl p-4 space-y-3 text-xs">
            <p className="font-semibold text-yellow-900">
              Add a reflection 🌿
            </p>
            <p className="text-[11px] text-[#7A674C]">
              You can share what part resonated, a similar moment from your own
              life, or a sentence you want future-you to remember.
            </p>

            <form onSubmit={handleReplySubmit} className="space-y-3">
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder='e.g. “This reminded me that my story isn’t over either.”'
                className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
                >
                  Post reflection
                </button>
                <p className="text-[10px] text-[#A08960]">
                  In the future, some reflections may be included (with consent)
                  in Sunflower Reports.
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
