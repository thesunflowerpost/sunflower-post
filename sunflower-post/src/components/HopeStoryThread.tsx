"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type HopeCategory = "Career" | "Health" | "Family" | "Money" | "Faith" | "Other";

type HopeStory = {
  id: number;
  title: string;
  summary: string;
  category: HopeCategory;
  turningPoint: string;
  author: string;
  isAnon: boolean;
  timeAgo: string;
  saves: number;
  fullStory?: string;
};

type HopeReply = {
  id: number;
  author: string;
  body: string;
  timeAgo: string;
  isAnon: boolean;
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
    fullStory:
      "For months it felt like every ‘no’ was proof that I’d messed up my life. I was applying to anything that vaguely matched my CV and shrinking my expectations every week.\n\nThe turning point wasn’t magical – a friend literally sat next to me and made me apply for a role I felt sure I’d never get. It was in a sector I cared about but didn’t feel qualified for on paper.\n\nThat’s the role I ended up getting. It wasn’t instant, but when it came through, it made every ‘no’ make more sense. I realised I’d been trying to force myself into jobs that weren’t actually aligned with the life I wanted.\n\nIf you’re here, drowning in rejections, this is your reminder that the door that opens might be one that doesn’t even exist yet on your horizon.",
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
    fullStory:
      "I’d been tired for so long that it started to feel like part of my personality. Every time I thought of booking an appointment, I convinced myself I was overreacting.\n\nWhen the letter came, I felt my stomach drop. Tests, referrals, long waiting rooms. I spiralled.\n\nBut the actual diagnosis, as scary as it sounded at first, came early enough that treatment was simple and effective. The nurse who did my bloods quietly said, ‘I’m glad you came in today.’ I don’t think she realised how much that sentence anchored me.\n\nIf you’ve been delaying a check-up because you’re scared of what they’ll say: this is me gently nudging you to go. Sometimes the scary letter is actually a second chance disguised as bad news.",
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
    fullStory:
      "The overdraft became so normal that we stopped seeing it as debt and started seeing it as part of our income. Which meant we were constantly anxious, always one unexpected cost away from panic.\n\nWhat helped wasn’t a lottery win. It was one unexpected grant we nearly didn’t apply for, and one brutally honest conversation with the bank where we asked for a temporary freeze and support plan.\n\nIt took more than a year to feel ‘safe’ again. But there was a day, in the middle of all of that, where I realised I hadn’t checked my balance in a panic all week. That was my real turning point.\n\nIf you’re staring at numbers that don’t feel real anymore, please know that one step – one email, one phone call, one application – can shift you onto a different path, even if the numbers don’t change overnight.",
  },
];

type Props = {
  storyId: number | null;
};

export default function HopeStoryThread({ storyId }: Props) {
  const story =
    STORIES.find((s) => s.id === storyId) ?? STORIES[0];

  const [replies, setReplies] = useState<HopeReply[]>([]);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [isAnon, setIsAnon] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function handleReplySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);

    const newReply: HopeReply = {
      id: replies.length + 1,
      author:
        isAnon || !name.trim() ? "Someone reading Hope Bank" : name.trim(),
      body: body.trim(),
      timeAgo: "Just now",
      isAnon,
    };

    setReplies([...replies, newReply]);
    setBody("");
    setName("");
    setIsAnon(true);
    setSubmitting(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-10 space-y-6">
      {/* BREADCRUMB */}
      <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
        <Link
          href="/hope-bank"
          className="inline-flex items-center gap-1 hover:text-yellow-900"
        >
          <span>←</span>
          <span>Back to Hope Bank</span>
        </Link>
        <span className="hidden sm:inline">
          This room is for &quot;it got a bit better&quot; stories.
        </span>
      </div>

      {/* MAIN STORY */}
      <section className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between text-[10px] text-[#A08960]">
          <span className="px-2 py-[2px] rounded-full bg-yellow-50 border border-yellow-100 text-[#5C4A33]">
            {story.category}
          </span>
          <span>{story.timeAgo}</span>
        </div>

        <h1 className="text-base md:text-lg font-semibold text-yellow-900">
          {story.title}
        </h1>

        <p className="text-xs md:text-sm text-[#5C4A33] whitespace-pre-line">
          {story.fullStory || story.summary}
        </p>

        <p className="text-[11px] text-[#7A674C] mt-2">
          <span className="font-medium">Turning point:</span>{" "}
          {story.turningPoint}
        </p>

        <p className="text-[11px] text-[#7A674C] mt-1">
          By{" "}
          {story.isAnon ? (
            <span>Anon</span>
          ) : (
            <span>{story.author}</span>
          )}
        </p>
      </section>

      {/* REPLY FORM */}
      <section className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3 text-xs md:text-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-yellow-900">Add a gentle note 💌</p>
          <p className="text-[10px] text-[#A08960]">
            Think: &quot;If someone in this situation was reading this, what would I want them to hear?&quot;
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleReplySubmit}>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#5C4A33]">
              Your message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="A few sentences of validation, hope, or something that helped you when you were in a similar place."
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leave blank if you’d like to stay a bit anonymous."
                className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <label className="inline-flex items-center gap-2 mt-1 text-[11px] text-[#7A674C]">
                <input
                  type="checkbox"
                  checked={isAnon}
                  onChange={(e) => setIsAnon(e.target.checked)}
                  className="rounded border-yellow-300"
                />
                <span>Post without my name</span>
              </label>
            </div>

            <div className="space-y-1 text-[11px] text-[#7A674C]">
              <p className="font-medium text-yellow-900">Gentle boundaries</p>
              <ul className="space-y-1">
                <li>• No graphic detail or explicit harm.</li>
                <li>• Validate first; advice only if invited.</li>
                <li>• Remember there&apos;s a human behind every story here.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
            >
              {submitting ? "Sending..." : "Post message"}
            </button>
            <p className="text-[10px] text-[#A08960]">
              Reflections can be lightly moderated to keep this room feeling safe.
            </p>
          </div>
        </form>
      </section>

      {/* REPLIES / REFLECTIONS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
          <p className="font-semibold text-yellow-900">
            Reflections &amp; encouragement ({replies.length})
          </p>
          <p className="text-[10px] text-[#A08960]">
            You don&apos;t need to have all the answers — a few kind sentences is enough.
          </p>
        </div>

        <div className="space-y-3">
          {replies.length === 0 && (
            <div className="bg-white border border-yellow-100 rounded-2xl p-3 text-[11px] text-[#7A674C]">
              <p className="font-semibold text-yellow-900 mb-1">
                Be the first to respond 🌻
              </p>
              <p>
                You can share how this story landed for you, or offer a sentence of encouragement
                to anyone reading from a similar place.
              </p>
            </div>
          )}

          {replies.map((reply) => (
            <article
              key={reply.id}
              className="bg-white border border-yellow-100 rounded-2xl p-3 md:p-4 space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                <span className="font-medium text-[#5C4A33]">
                  {reply.author}
                </span>
                <span>{reply.timeAgo}</span>
              </div>
              <p className="text-xs md:text-sm text-[#5C4A33] whitespace-pre-line">
                {reply.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
