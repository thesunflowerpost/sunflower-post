"use client";

import { useMemo, useState, type FormEvent } from "react";
import CommunitySidebar from "./CommunitySidebar";

type BookStatus = "Reading" | "Finished" | "To read";

type Book = {
  id: number;
  title: string;
  author: string;
  status: BookStatus;
  mood: string;
  theme?: string;
  format?: string;
  sharedBy: string;
  note?: string;
  coverUrl?: string;
  timeAgo: string;
};

type TopicReply = {
  id: number;
  body: string;
  author: string;
  timeAgo: string;
};

type BookTopic = {
  id: number;
  title: string;
  body: string;
  author: string;
  timeAgo: string;
  containsSpoilers: boolean;
  replies: TopicReply[];
};

type UserReactions = {
  warmth: boolean;
  support: boolean;
  here: boolean;
};

const SAMPLE_BOOKS: Book[] = [
  {
    id: 1,
    title: "All About Love",
    author: "bell hooks",
    status: "Reading",
    mood: "Soft self-help",
    theme: "Love · Healing · Community",
    format: "Physical",
    sharedBy: "S.",
    note: "Good for unlearning old ideas about love without feeling attacked.",
    timeAgo: "Added 4 days ago",
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    status: "Finished",
    mood: "Slow & thoughtful",
    theme: "Purpose · Spirituality",
    format: "Audiobook",
    sharedBy: "Anon",
    note: "Great for when you feel lost or like you’ve ‘missed your moment’.",
    timeAgo: "Added 1 week ago",
  },
  {
    id: 3,
    title: "Homegoing",
    author: "Yaa Gyasi",
    status: "To read",
    mood: "Heavy but healing",
    theme: "Ancestry · Diaspora · Generations",
    format: "Kindle",
    sharedBy: "Jay",
    note: "Everyone says it’s intense but beautifully written.",
    timeAgo: "Added 2 weeks ago",
  },
];

const SAMPLE_TOPICS: Record<number, BookTopic[]> = {
  1: [
    {
      id: 1,
      title: "Opening chapter – redefining love (no spoilers)",
      body: "The way she breaks down the difference between care, affection and love made me realise how low my bar has been. Anyone else feel gently dragged?",
      author: "Dani",
      timeAgo: "2 days ago",
      containsSpoilers: false,
      replies: [
        {
          id: 1,
          body: "Yes! I had to pause and highlight so many lines in that section.",
          author: "Jay",
          timeAgo: "1 day ago",
        },
      ],
    },
    {
      id: 2,
      title: "How did this land if you grew up in a strict household?",
      body: "I’m curious how people with very religious / strict upbringings received this – did it feel freeing or confronting?",
      author: "Anon",
      timeAgo: "1 day ago",
      containsSpoilers: false,
      replies: [],
    },
  ],
  2: [
    {
      id: 1,
      title: "Spoiler: the ending + ‘personal legend’",
      body: "Without going into too much detail here, did the way it wrapped up feel satisfying or a bit too neat? I’m torn between ‘needed this’ and ‘hmmm’.",
      author: "Jay",
      timeAgo: "3 days ago",
      containsSpoilers: true,
      replies: [],
    },
  ],
  3: [],
};

type Props = {
  bookId: number;
  topicId: number;
};

export default function BookTopicPage({ bookId, topicId }: Props) {
  const book = useMemo(
    () => SAMPLE_BOOKS.find((b) => b.id === bookId) ?? SAMPLE_BOOKS[0],
    [bookId]
  );

  const initialTopic =
    SAMPLE_TOPICS[book.id]?.find((t) => t.id === topicId) ??
    SAMPLE_TOPICS[book.id]?.[0] ??
    {
      id: topicId,
      title: "Topic not found yet",
      body: "This topic doesn’t exist in the sample data yet, but the page is wired. Once topics are stored in a real database, this will load properly.",
      author: "System",
      timeAgo: "Just now",
      containsSpoilers: false,
      replies: [],
    };

  const [topic, setTopic] = useState<BookTopic>(initialTopic);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [reactions, setReactions] = useState<UserReactions>({
    warmth: false,
    support: false,
    here: false,
  });

  function statusBadge(status: BookStatus) {
    if (status === "Reading") {
      return "bg-[#ECFEFF] border-[#A5F3FC] text-[#155E75]";
    }
    if (status === "Finished") {
      return "bg-[#ECFDF3] border-[#BBF7D0] text-[#166534]";
    }
    return "bg-[#FEF9C3] border-[#FEF08A] text-[#92400E]";
  }

  function handleReplySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = replyText.trim();
    if (!text) return;

    setSubmitting(true);

    const nextId =
      topic.replies.length > 0
        ? topic.replies[topic.replies.length - 1].id + 1
        : 1;

    const newReply: TopicReply = {
      id: nextId,
      body: text,
      author: "You",
      timeAgo: "Just now",
    };

    setTopic((prev) => ({
      ...prev,
      replies: [...prev.replies, newReply],
    }));
    setReplyText("");
    setSubmitting(false);
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

        {/* RIGHT: TOPIC CONTENT */}
        <div className="md:col-span-3 space-y-8">
          {/* BOOK + TOPIC HEADER */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* COVER */}
              <div className="w-24 h-32 md:w-28 md:h-40 rounded-xl overflow-hidden bg-[#FFF7D6] border border-yellow-100 flex items-center justify-center text-[11px] text-[#A08960]">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>Book cover</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960]">
                  Book topic
                </p>
                <h1 className="text-lg md:text-xl font-semibold text-yellow-900">
                  {book.title}
                </h1>
                <p className="text-xs md:text-sm text-[#5C4A33]">
                  {book.author}
                </p>

                <div className="flex flex-wrap gap-2 text-[10px] mt-1">
                  <span
                    className={`px-2 py-[2px] rounded-full border ${statusBadge(
                      book.status
                    )}`}
                  >
                    {book.status}
                  </span>
                  {book.mood && (
                    <span className="px-2 py-[2px] rounded-full bg-[#FFFEFA] border border-yellow-100 text-[#5C4A33]">
                      {book.mood}
                    </span>
                  )}
                  {book.theme && (
                    <span className="px-2 py-[2px] rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#7C2D12]">
                      {book.theme}
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-[#A08960] mt-1">
                  Shared by {book.sharedBy || "Anon"} · {book.timeAgo}
                </p>
              </div>
            </div>

            <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-yellow-900">
                  {topic.title}
                </p>
                {topic.containsSpoilers && (
                  <span className="px-2 py-[2px] rounded-full bg-[#FEF2F2] border border-[#FCA5A5] text-[#7F1D1D] text-[9px]">
                    Contains spoilers
                  </span>
                )}
              </div>
              <p className="text-[#5C4A33] whitespace-pre-line">
                {topic.body}
              </p>
              <p className="text-[10px] text-[#A08960]">
                {topic.author} · {topic.timeAgo}
              </p>
            </div>

            {/* TOPIC REACTIONS */}
            <div className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-[10px]">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleReaction("warmth")}
                  className={`px-2.5 py-1 rounded-full border flex items-center gap-1 ${
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
                  className={`px-2.5 py-1 rounded-full border flex items-center gap-1 ${
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
                  className={`px-2.5 py-1 rounded-full border flex items-center gap-1 ${
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
                Reactions are just for you and the person who posted – no public
                counts, no leaderboards.
              </p>
            </div>
          </section>

          {/* REPLIES THREAD */}
          <section className="space-y-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold text-yellow-900">
                Replies
              </p>
              <p className="text-[10px] text-[#A08960]">
                {topic.replies.length === 0
                  ? "No replies yet – you can be the first."
                  : `${topic.replies.length} repl${
                      topic.replies.length === 1 ? "y" : "ies"
                    } so far`}
              </p>
            </div>

            {topic.replies.length > 0 && (
              <div className="space-y-2">
                {topic.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-white border border-yellow-100 rounded-2xl px-3 py-2"
                  >
                    <p className="text-[#5C4A33] whitespace-pre-line">
                      {reply.body}
                    </p>
                    <p className="text-[9px] text-[#A08960] mt-1">
                      {reply.author} · {reply.timeAgo}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ADD REPLY */}
            <form
              onSubmit={handleReplySubmit}
              className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-2"
            >
              <label className="text-[11px] font-medium text-[#5C4A33]">
                Add your response
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                placeholder="You can share how this landed, a gentle disagreement, or a ‘same’. No need to write an essay."
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="submit"
                  disabled={submitting || !replyText.trim()}
                  className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-[11px] font-semibold shadow-sm"
                >
                  {submitting ? "Posting…" : "Post reply"}
                </button>
                <p className="text-[9px] text-[#C0A987]">
                  Keep it kind, specific and grounded in the book – not the
                  person reading it.
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
