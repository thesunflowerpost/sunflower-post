"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CommunitySidebar from "@/components/CommunitySidebar";
import AnonymousToggle from "@/components/AnonymousToggle";
import PostActions from "@/components/PostActions";
import Link from "next/link";
import { BouncyButton, ShimmerIcon, ReactionBar } from "@/components/ui";
import type { ReactionId } from "@/config/reactions";

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

// User reactions are now stored as Record<ReactionId, boolean>
type UserReactions = Record<ReactionId, boolean>;

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
  const { user } = useAuth();
  const id = Number(params.id);
  const story = STORIES.find((s) => s.id === id) ?? STORIES[0];

  const initialReplies = INITIAL_REPLIES_BY_STORY[id] ?? [];
  const [replies, setReplies] = useState<HopeReply[]>(initialReplies);
  const [replyText, setReplyText] = useState("");
  const [isAnon, setIsAnon] = useState(true);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // per-story reactions for THIS viewer only
  const [reactions, setReactions] = useState<UserReactions>({} as UserReactions);

  function handleReplySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Use user's alias if anonymous, real name if not
    const displayName = user
      ? (isAnon ? user.alias : user.name)
      : "Someone reading Hope Bank";

    const newReply: HopeReply = {
      id: replies.length + 1,
      author: displayName,
      timeAgo: "Just now",
      body: replyText.trim(),
    };

    setReplies([...replies, newReply]);
    setReplyText("");
    setIsAnon(true); // Reset to anonymous after posting
  }

  function handleEditReply(reply: HopeReply) {
    setEditingReplyId(reply.id);
    setEditText(reply.body);
  }

  function handleDeleteReply(replyId: number) {
    setReplies(replies.filter((r) => r.id !== replyId));
  }

  function handleSaveEdit(replyId: number) {
    if (!editText.trim()) return;
    setReplies(
      replies.map((r) =>
        r.id === replyId ? { ...r, body: editText.trim() } : r
      )
    );
    setEditingReplyId(null);
    setEditText("");
  }

  function handleCancelEdit() {
    setEditingReplyId(null);
    setEditText("");
  }

  function isOwnReply(replyAuthor: string): boolean {
    if (!user) return false;
    return replyAuthor === user.name || replyAuthor === user.alias;
  }

  // toggle helper for reactions
  function toggleReaction(reactionId: ReactionId, active: boolean) {
    setReactions((prev) => ({
      ...prev,
      [reactionId]: active,
    }));
  }

  // Helper to get author initials
  function getAuthorInitial(author: string): string {
    return author.charAt(0).toUpperCase();
  }

  // Helper to get avatar color based on author name
  function getAvatarColor(author: string): string {
    const colors = [
      "bg-gradient-to-br from-yellow-200 to-amber-300",
      "bg-gradient-to-br from-orange-200 to-orange-300",
      "bg-gradient-to-br from-rose-200 to-pink-300",
      "bg-gradient-to-br from-purple-200 to-violet-300",
      "bg-gradient-to-br from-teal-200 to-emerald-300",
    ];
    const index = author.length % colors.length;
    return colors[index];
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
          <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
            <Link
              href="/hope-bank"
              className="inline-flex items-center gap-1 hover:text-yellow-900"
            >
              <span>←</span>
              <span>Back to Hope Bank</span>
            </Link>
            <span className="hidden sm:inline text-[#A08960]">
              Reflections are for care, not debate.
            </span>
          </div>

          {/* HERO CARD */}
          <section className="bg-white border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 shadow-sm">
            <div className="flex items-start gap-2">
              {/* Author Avatar */}
              <div
                className={`w-10 h-10 rounded-full ${getAvatarColor(
                  story.author
                )} flex items-center justify-center text-sm font-semibold text-[#3A2E1F] shadow-sm flex-shrink-0`}
              >
                {getAuthorInitial(story.author)}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-[#5C4A33]">
                    {story.isAnon ? "Anon" : story.author}
                  </span>
                  <span className="text-[10px] text-[#A08960]">
                    {story.timeAgo}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-200/60 text-[#3A2E1F] font-medium shadow-sm text-[9px]">
                    {story.category}
                  </span>
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

                {/* SAVE + REACTIONS */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200/60 hover:shadow-sm transition-all">
                      <ShimmerIcon>
                        <span>📎</span>
                      </ShimmerIcon>
                      <span className="font-medium">Save story</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-full border border-yellow-200/60 bg-white hover:bg-yellow-50 hover:shadow-sm transition-all">
                      Share (coming soon)
                    </button>
                  </div>

                  {/* REACTIONS ROW – Using new ReactionBar with room-specific config */}
                  <div className="pt-1">
                    <ReactionBar
                      roomId="hopeBank"
                      postId={story.id}
                      reactions={reactions}
                      onReactionToggle={toggleReaction}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HOPE-FRAME */}
          <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-2 text-xs shadow-md">
            <p className="font-semibold text-yellow-900">
              For whoever needed this today
            </p>
            <p className="text-[#5C4A33] leading-relaxed">
              You don&apos;t have to know how your story resolves yet. It&apos;s
              enough that you&apos;re still here, still curious whether things can
              shift. Hope Bank is proof that "stuck" can be a chapter, not the
              whole book.
            </p>
          </section>

          {/* REPLY COMPOSER */}
          <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 text-xs shadow-md">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-yellow-900">
                Add a reflection 🌿
              </p>
              <p className="text-[10px] text-[#A08960]">
                One or two sentences is plenty.
              </p>
            </div>
            <p className="text-[11px] text-[#7A674C]">
              You can share what part resonated, a similar moment from your own
              life, or a sentence you want future-you to remember.
            </p>

            <form onSubmit={handleReplySubmit} className="space-y-3">
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="e.g. &quot;This reminded me that my story isn't over either.&quot;"
                className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
              />

              <div className="space-y-3">
                {user && (
                  <div className="space-y-1 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-[#A08960]">Posting as:</p>
                    <p className="text-xs font-medium text-[#5C4A33]">
                      {isAnon ? user.alias : user.name}
                    </p>
                  </div>
                )}

                <AnonymousToggle
                  isAnonymous={isAnon}
                  onChange={setIsAnon}
                  userAlias={user?.alias}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <BouncyButton
                  type="submit"
                  disabled={!replyText.trim()}
                  variant="primary"
                  size="sm"
                  className="shadow-sm"
                >
                  Post reflection
                </BouncyButton>
                <p className="text-[10px] text-[#A08960]">
                  In the future, some reflections may be included (with consent)
                  in Sunflower Reports.
                </p>
              </div>
            </form>
          </section>

          {/* REPLIES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-yellow-900">
                Reflections ({replies.length})
              </p>
              <p className="text-[10px] text-[#A08960]">
                Share how this story landed for you – without turning it into
                advice.
              </p>
            </div>

            <div className="space-y-3">
              {replies.map((reply) => {
                const replyAuthor = reply.author === "You" ? "You" : reply.author;
                return (
                  <div
                    key={reply.id}
                    className="bg-white border border-yellow-200/60 rounded-2xl p-3 space-y-2 text-xs shadow-sm"
                  >
                    <div className="flex items-start gap-2">
                      {/* Reply Author Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full ${getAvatarColor(
                          replyAuthor
                        )} flex items-center justify-center text-[11px] font-semibold text-[#3A2E1F] shadow-sm flex-shrink-0`}
                      >
                        {getAuthorInitial(replyAuthor)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#5C4A33]">
                              {replyAuthor}
                            </span>
                            <span>{reply.timeAgo}</span>
                          </div>
                          {isOwnReply(replyAuthor) && editingReplyId !== reply.id && (
                            <PostActions
                              onEdit={() => handleEditReply(reply)}
                              onDelete={() => handleDeleteReply(reply.id)}
                            />
                          )}
                        </div>
                        {editingReplyId === reply.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-none"
                              rows={3}
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveEdit(reply.id)}
                                disabled={!editText.trim()}
                                className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[#5C4A33] whitespace-pre-line leading-relaxed">
                            {reply.body}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

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
        </div>
      </div>
    </div>
  );
}
