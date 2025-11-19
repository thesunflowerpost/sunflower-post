"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
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
};

export default function BookDiscussionPage({ bookId }: Props) {
  const book = useMemo(
    () => SAMPLE_BOOKS.find((b) => b.id === bookId) ?? SAMPLE_BOOKS[0],
    [bookId]
  );

  const [topics, setTopics] = useState<BookTopic[]>(
    SAMPLE_TOPICS[book.id] ?? []
  );
  const [hideSpoilers, setHideSpoilers] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");

  const [draft, setDraft] = useState({
    title: "",
    body: "",
    containsSpoilers: false,
  });
  const [submitting, setSubmitting] = useState(false);

  // per-topic reply drafts
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [replySubmitting, setReplySubmitting] = useState<
    Record<number, boolean>
  >({});

  // per-topic reactions (for this viewer only)
  const [reactions, setReactions] = useState<Record<number, UserReactions>>({});

  const normalizedTopicSearch = topicSearch.trim().toLowerCase();

  const visibleTopics = topics.filter((topic) => {
    if (hideSpoilers && topic.containsSpoilers) return false;
    if (!normalizedTopicSearch) return true;

    const haystack = (
      topic.title +
      " " +
      topic.body +
      " " +
      topic.author
    ).toLowerCase();

    return haystack.includes(normalizedTopicSearch);
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft.title.trim() && !draft.body.trim()) return;

    setSubmitting(true);

    const nextId = topics.length > 0 ? topics[0].id + 1 : 1;

    const newTopic: BookTopic = {
      id: nextId,
      title:
        draft.title.trim() ||
        "A small thought about this book",
      body:
        draft.body.trim() ||
        "This book landed in a way I don’t fully have words for yet, but I wanted to mark that it did.",
      author: "You",
      timeAgo: "Just now",
      containsSpoilers: draft.containsSpoilers,
      replies: [],
    };

    setTopics([newTopic, ...topics]);
    setDraft({
      title: "",
      body: "",
      containsSpoilers: false,
    });
    setSubmitting(false);
  }

  function handleReplySubmit(e: FormEvent<HTMLFormElement>, topicId: number) {
    e.preventDefault();
    const text = (replyDrafts[topicId] || "").trim();
    if (!text) return;

    setReplySubmitting((prev) => ({ ...prev, [topicId]: true }));

    setTopics((prevTopics) =>
      prevTopics.map((topic) => {
        if (topic.id !== topicId) return topic;
        const nextReplyId =
          topic.replies.length > 0
            ? topic.replies[topic.replies.length - 1].id + 1
            : 1;

        const newReply: TopicReply = {
          id: nextReplyId,
          body: text,
          author: "You",
          timeAgo: "Just now",
        };

        return {
          ...topic,
          replies: [...topic.replies, newReply],
        };
      })
    );

    setReplyDrafts((prev) => ({ ...prev, [topicId]: "" }));
    setReplySubmitting((prev) => ({ ...prev, [topicId]: false }));
  }

  function toggleReaction(topicId: number, key: keyof UserReactions) {
    setReactions((prev) => {
      const current = prev[topicId] || {
        warmth: false,
        support: false,
        here: false,
      };
      return {
        ...prev,
        [topicId]: {
          ...current,
          [key]: !current[key],
        },
      };
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: DISCUSSION CONTENT */}
        <div className="md:col-span-3 space-y-8">
          {/* HEADER / BOOK SUMMARY */}
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
                  Book discussion
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-yellow-900">
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

                {book.note && (
                  <p className="text-xs text-[#5C4A33] mt-2">
                    {book.note}
                  </p>
                )}

                <p className="text-[10px] text-[#A08960] mt-1">
                  Shared by {book.sharedBy || "Anon"} · {book.timeAgo}
                </p>
              </div>
            </div>

            <div className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-3 text-[11px] text-[#7A674C] space-y-1">
              <p className="font-semibold text-yellow-900">
                How this discussion works
              </p>
              <p>
                Start a topic for a chapter, theme, quote or feeling this book
                stirred up. You can mark it as containing spoilers so people
                can choose what to see. Each topic has its own thread and can
                also be opened on its own page.
              </p>
            </div>
          </section>

          {/* FILTERS + SPOILER TOGGLE + SEARCH */}
          <section className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="text-[#7A674C]">
                {topics.length === 0
                  ? "No topics yet – yours will be the first."
                  : `${topics.length} topic${
                      topics.length === 1 ? "" : "s"
                    } in this room`}
              </p>
              <div className="flex items-center gap-2 bg-white border border-yellow-100 rounded-full px-3 py-1 shadow-sm">
                <span>🔍</span>
                <input
                  type="text"
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  placeholder="Search topics (e.g. chapter, quote, theme…)"
                  className="bg-transparent text-[11px] focus:outline-none placeholder:text-[#C0A987]"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-[#7A674C]">
              <input
                type="checkbox"
                checked={hideSpoilers}
                onChange={(e) => setHideSpoilers(e.target.checked)}
                className="rounded border-yellow-300"
              />
              <span>Hide spoiler-marked topics</span>
            </label>
          </section>

          {/* TOPICS LIST */}
          <section className="space-y-3 text-xs">
            {visibleTopics.length === 0 && (
              <div className="bg-white border border-yellow-100 rounded-2xl p-4 text-[#7A674C]">
                <p className="font-semibold text-yellow-900 mb-1">
                  No visible topics yet.
                </p>
                <p>
                  Either no one&apos;s started a discussion yet, your search
                  is too specific, or you&apos;re hiding spoiler-marked ones.
                  You can always start with a spoiler-free thought or question. 🌻
                </p>
              </div>
            )}

            {visibleTopics.map((topic) => {
              const draftText = replyDrafts[topic.id] || "";
              const isReplySubmitting = !!replySubmitting[topic.id];
              const topicReactions =
                reactions[topic.id] || {
                  warmth: false,
                  support: false,
                  here: false,
                };

              return (
                <article
                  key={topic.id}
                  className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-[#A08960]">
                    <p className="font-semibold text-[#5C4A33]">
                      {topic.title}
                    </p>
                    <div className="flex items-center gap-2">
                      {topic.containsSpoilers && (
                        <span className="px-2 py-[2px] rounded-full bg-[#FEF2F2] border border-[#FCA5A5] text-[#7F1D1D] text-[9px]">
                          Contains spoilers
                        </span>
                      )}
                      <span>{topic.timeAgo}</span>
                    </div>
                  </div>

                  <p className="text-[#5C4A33] whitespace-pre-line">
                    {topic.body}
                  </p>
                  <p className="text-[10px] text-[#A08960]">{topic.author}</p>

                  {/* META: counts + open full topic */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#7A674C] border-t border-yellow-50 pt-2">
                    <span>
                      {topic.replies.length === 0
                        ? "No replies yet"
                        : `${topic.replies.length} repl${
                            topic.replies.length === 1 ? "y" : "ies"
                          }`}
                    </span>
                    <Link
                      href={`/book-club/${book.id}/topic/${topic.id}`}
                      className="inline-flex items-center gap-1 text-[#7A674C] hover:text-yellow-900"
                    >
                      <span>↗</span>
                      <span>Open full topic</span>
                    </Link>
                  </div>

                  {/* REACTIONS ROW */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] border-t border-yellow-50 pt-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleReaction(topic.id, "warmth")}
                        className={`px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                          topicReactions.warmth
                            ? "bg-yellow-200 border-yellow-300 text-[#3A2E1F]"
                            : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                        }`}
                      >
                        <span>🌻</span>
                        <span>Send warmth</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleReaction(topic.id, "support")}
                        className={`px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                          topicReactions.support
                            ? "bg-[#F5F3FF] border-[#D9D2FF] text-[#40325F]"
                            : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                        }`}
                      >
                        <span>🤍</span>
                        <span>Gentle support</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleReaction(topic.id, "here")}
                        className={`px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                          topicReactions.here
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

                  {/* ADD REPLY FORM - Above existing replies */}
                  <form
                    onSubmit={(e) => handleReplySubmit(e, topic.id)}
                    className="border-t border-yellow-50 pt-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🌿</span>
                      <label className="text-[11px] font-medium text-[#5C4A33]">
                        Add a reflection
                      </label>
                    </div>
                    <textarea
                      value={draftText}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [topic.id]: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="Offer a reflection, a 'same', or a gentle question. No need to be profound."
                    />
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="submit"
                        disabled={isReplySubmitting || !draftText.trim()}
                        className="px-3 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-[11px] font-semibold shadow-sm"
                      >
                        {isReplySubmitting ? "Posting…" : "Post reply"}
                      </button>
                      <p className="text-[9px] text-[#C0A987]">
                        Keep it kind and specific to the book, not the person.
                      </p>
                    </div>
                  </form>

                  {/* EXISTING REPLIES - Below form */}
                  {topic.replies.length > 0 && (
                    <div className="border-t border-yellow-50 pt-3 space-y-2">
                      <p className="text-[10px] text-[#A08960] font-medium">
                        {topic.replies.length} {topic.replies.length === 1 ? "reply" : "replies"}
                      </p>
                      <div className="space-y-1.5">
                        {topic.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="rounded-xl bg-[#FFFCF5] border border-yellow-100 px-3 py-2"
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
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          {/* START A TOPIC */}
          <section className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3 text-xs md:text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-yellow-900">
                Start a topic about this book 💬
              </p>
              <p className="text-[10px] text-[#A08960]">
                It can be one question, one quote, or one feeling – it doesn&apos;t
                need to be deep to matter.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#5C4A33]">
                  Topic title (optional)
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  placeholder='e.g. "Chapter 3 – mothers & daughters", "That one line about fear"'
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#5C4A33]">
                  What would you like to say?
                </label>
                <textarea
                  value={draft.body}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, body: e.target.value }))
                  }
                  rows={3}
                  className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  placeholder="Share a quote that stayed with you, a question you can’t shake, or how this book landed in your body."
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-[11px] text-[#7A674C]">
                  <input
                    type="checkbox"
                    checked={draft.containsSpoilers}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        containsSpoilers: e.target.checked,
                      }))
                    }
                    className="rounded border-yellow-300"
                  />
                  <span>This topic contains spoilers</span>
                </label>
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    (!draft.title.trim() && !draft.body.trim())
                  }
                  className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
                >
                  {submitting ? "Posting…" : "Post topic"}
                </button>
              </div>

              <p className="text-[10px] text-[#A08960]">
                Please keep details non-graphic, be kind to other readers, and
                use the spoiler toggle when you&apos;re talking about later
                chapters or endings.
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
