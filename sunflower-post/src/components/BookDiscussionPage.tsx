"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import CommunitySidebar from "./CommunitySidebar";
import { ReactionBar } from "./ui";
import type { ReactionId } from "@/config/reactions";

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
  profilePic?: string;
};

type BookTopic = {
  id: number;
  title: string;
  body: string;
  author: string;
  timeAgo: string;
  containsSpoilers: boolean;
  replies: TopicReply[];
  profilePic?: string;
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
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dani",
      replies: [
        {
          id: 1,
          body: "Yes! I had to pause and highlight so many lines in that section.",
          author: "Jay",
          timeAgo: "1 day ago",
          profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jay",
        },
      ],
    },
    {
      id: 2,
      title: "How did this land if you grew up in a strict household?",
      body: "I'm curious how people with very religious / strict upbringings received this – did it feel freeing or confronting?",
      author: "Anon",
      timeAgo: "1 day ago",
      containsSpoilers: false,
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anon",
      replies: [],
    },
  ],
  2: [
    {
      id: 1,
      title: "Spoiler: the ending + 'personal legend'",
      body: "Without going into too much detail here, did the way it wrapped up feel satisfying or a bit too neat? I'm torn between 'needed this' and 'hmmm'.",
      author: "Jay",
      timeAgo: "3 days ago",
      containsSpoilers: true,
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jay",
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
  const [topicReactions, setTopicReactions] = useState<Record<number, Record<ReactionId, boolean>>>({});

  // per-reply reactions (for this viewer only)
  const [replyReactions, setReplyReactions] = useState<Record<number, Record<ReactionId, boolean>>>({});

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

  function toggleTopicReaction(topicId: number, reactionId: ReactionId, active: boolean) {
    setTopicReactions((prev) => {
      const current = prev[topicId] || {};
      return {
        ...prev,
        [topicId]: {
          ...current,
          [reactionId]: active,
        },
      };
    });
  }

  function toggleReplyReaction(replyId: number, reactionId: ReactionId, active: boolean) {
    setReplyReactions((prev) => {
      const current = prev[replyId] || {};
      return {
        ...prev,
        [replyId]: {
          ...current,
          [reactionId]: active,
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
            {/* Beautiful Hero Card */}
            <div className="bg-gradient-to-br from-[#FFF7D6] via-white to-[#FFF7ED] border border-yellow-200 rounded-3xl p-6 md:p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* COVER - Larger and more prominent */}
                <div className="w-32 h-44 md:w-40 md:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-[#FFF7D6] to-[#FFE4B5] border border-yellow-200 flex items-center justify-center text-[11px] text-[#A08960] shadow-xl flex-shrink-0">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-center p-3">Book cover</span>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960] font-semibold">
                      Book discussion
                    </p>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-yellow-900">
                    {book.title}
                  </h1>
                  <p className="text-sm md:text-base text-[#5C4A33] font-medium">
                    by {book.author}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span
                      className={`px-3 py-1.5 rounded-full border font-medium ${statusBadge(
                        book.status
                      )}`}
                    >
                      {book.status}
                    </span>
                    {book.mood && (
                      <span className="px-3 py-1.5 rounded-full bg-[#FFFEFA] border border-yellow-100 text-[#5C4A33] font-medium">
                        {book.mood}
                      </span>
                    )}
                    {book.theme && (
                      <span className="px-3 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#7C2D12] font-medium">
                        {book.theme}
                      </span>
                    )}
                  </div>

                  {book.note && (
                    <p className="text-xs md:text-sm text-[#5C4A33] bg-white/50 rounded-xl p-3 border border-yellow-100">
                      {book.note}
                    </p>
                  )}

                  <p className="text-[11px] text-[#A08960]">
                    Shared by <span className="font-medium">{book.sharedBy || "Anon"}</span> · {book.timeAgo}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 text-xs text-[#7A674C] space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span>💡</span>
                <p className="font-semibold text-yellow-900">
                  How this discussion works
                </p>
              </div>
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
              const currentTopicReactions = topicReactions[topic.id] || {};

              return (
                <article
                  key={topic.id}
                  className="bg-white border border-yellow-100 rounded-2xl p-5 space-y-4 hover:border-yellow-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Profile picture */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-200 flex-shrink-0">
                        {topic.profilePic ? (
                          <img
                            src={topic.profilePic}
                            alt={`${topic.author}'s profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-yellow-600 text-sm font-bold">
                            {topic.author.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-sm md:text-base text-yellow-900">
                          {topic.title}
                        </h3>
                        <p className="text-[11px] text-[#A08960]">
                          <span className="font-medium">{topic.author}</span> · {topic.timeAgo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#A08960] flex-shrink-0">
                      {topic.containsSpoilers && (
                        <span className="px-2.5 py-1 rounded-full bg-[#FEF2F2] border border-[#FCA5A5] text-[#7F1D1D] font-medium">
                          Contains spoilers
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-[#5C4A33] whitespace-pre-line leading-relaxed">
                    {topic.body}
                  </p>

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
                  <div className="border-t border-yellow-100 pt-3">
                    <ReactionBar
                      roomId="bookClub"
                      postId={topic.id}
                      reactions={currentTopicReactions}
                      onReactionToggle={(reactionId, active) =>
                        toggleTopicReaction(topic.id, reactionId, active)
                      }
                      showLabels={true}
                    />
                  </div>

                  {/* ADD REPLY FORM - Above existing replies */}
                  <form
                    onSubmit={(e) => handleReplySubmit(e, topic.id)}
                    className="border-t border-yellow-100 pt-4 space-y-3 bg-gradient-to-br from-[#FFFEF9] to-white rounded-b-xl -mx-5 -mb-5 px-5 pb-4 mt-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌿</span>
                      <label className="text-xs font-semibold text-yellow-900">
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
                      rows={3}
                      className="w-full border border-yellow-100 rounded-xl px-4 py-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all shadow-sm"
                      placeholder="Offer a reflection, a 'same', or a gentle question. No need to be profound."
                    />
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="submit"
                        disabled={isReplySubmitting || !draftText.trim()}
                        className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-[11px] font-semibold shadow-md hover:shadow-lg transition-all disabled:shadow-sm"
                      >
                        {isReplySubmitting ? "Posting…" : "Post reply"}
                      </button>
                      <p className="text-[9px] text-[#C0A987] italic">
                        Keep it kind and specific to the book, not the person.
                      </p>
                    </div>
                  </form>

                  {/* EXISTING REPLIES - Below form */}
                  {topic.replies.length > 0 && (
                    <div className="border-t border-yellow-100 pt-4 space-y-3 -mx-5 px-5 -mb-5 pb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💬</span>
                        <p className="text-[11px] text-[#A08960] font-semibold">
                          {topic.replies.length} {topic.replies.length === 1 ? "reply" : "replies"}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {topic.replies.map((reply) => {
                          const currentReplyReactions = replyReactions[reply.id] || {};

                          return (
                            <div
                              key={reply.id}
                              className="rounded-xl bg-gradient-to-br from-[#FFFCF5] to-white border border-yellow-100 px-4 py-3 hover:border-yellow-200 transition-all shadow-sm space-y-3"
                            >
                              <div className="flex items-start gap-3">
                                {/* Profile picture */}
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-200 flex-shrink-0">
                                  {reply.profilePic ? (
                                    <img
                                      src={reply.profilePic}
                                      alt={`${reply.author}'s profile`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-yellow-600 text-xs font-bold">
                                      {reply.author.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] text-[#A08960] mb-1.5 font-medium">
                                    {reply.author} · {reply.timeAgo}
                                  </p>
                                  <p className="text-xs text-[#5C4A33] whitespace-pre-line leading-relaxed">
                                    {reply.body}
                                  </p>
                                </div>
                              </div>

                              {/* Reply reactions */}
                              <div className="border-t border-yellow-50 pt-2">
                                <ReactionBar
                                  roomId="bookClub"
                                  postId={reply.id}
                                  reactions={currentReplyReactions}
                                  onReactionToggle={(reactionId, active) =>
                                    toggleReplyReaction(reply.id, reactionId, active)
                                  }
                                  showLabels={false}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          {/* START A TOPIC */}
          <section className="bg-gradient-to-br from-[#FFF7D6] via-white to-[#FFF7ED] border border-yellow-200 rounded-3xl p-5 md:p-6 space-y-4 text-xs md:text-sm shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <h2 className="text-base font-bold text-yellow-900">
                  Start a topic about this book
                </h2>
              </div>
              <p className="text-[11px] text-[#A08960] italic">
                It can be one question, one quote, or one feeling – it doesn&apos;t
                need to be deep to matter.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-yellow-900 flex items-center gap-1">
                  <span>✏️</span>
                  <span>Topic title (optional)</span>
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full border border-yellow-100 rounded-xl px-4 py-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 shadow-sm transition-all"
                  placeholder='e.g. "Chapter 3 – mothers & daughters", "That one line about fear"'
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-yellow-900 flex items-center gap-1">
                  <span>📝</span>
                  <span>What would you like to say?</span>
                </label>
                <textarea
                  value={draft.body}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, body: e.target.value }))
                  }
                  rows={4}
                  className="w-full border border-yellow-100 rounded-xl px-4 py-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 shadow-sm transition-all"
                  placeholder="Share a quote that stayed with you, a question you can't shake, or how this book landed in your body."
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <label className="inline-flex items-center gap-2 text-xs text-[#7A674C] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.containsSpoilers}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        containsSpoilers: e.target.checked,
                      }))
                    }
                    className="rounded border-yellow-300 text-yellow-500 focus:ring-yellow-300"
                  />
                  <span>⚠️ This topic contains spoilers</span>
                </label>
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    (!draft.title.trim() && !draft.body.trim())
                  }
                  className="px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:shadow-sm"
                >
                  {submitting ? "Posting…" : "Post topic"}
                </button>
              </div>

              <div className="bg-white/50 border border-yellow-100 rounded-xl p-3">
                <p className="text-[10px] text-[#A08960] italic">
                  💛 Please keep details non-graphic, be kind to other readers, and
                  use the spoiler toggle when you&apos;re talking about later
                  chapters or endings.
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
