"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CommunitySidebar from "@/components/CommunitySidebar";
import AnonymousToggle from "@/components/AnonymousToggle";
import { BouncyButton, ReactionBar } from "@/components/ui";
import GiphyPicker from "@/components/GiphyPicker";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";
import type { ReactionId } from "@/config/reactions";
import type { TVMovie, TVMovieDiscussion, TVMovieReply, TVMovieStatus } from "@/lib/db/schema";

type UserReactions = Record<ReactionId, boolean>;
type DiscussionReactions = Record<string, UserReactions>;
type ReplyReactions = Record<string, UserReactions>;

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

// Mood emoji helper
function moodEmoji(mood: string) {
  const lower = mood.toLowerCase();
  if (lower.includes("comfort")) return "🛋️";
  if (lower.includes("drama")) return "🎭";
  if (lower.includes("cosy") || lower.includes("cozy")) return "☕";
  if (lower.includes("coming-of-age")) return "🌱";
  if (lower.includes("chaos")) return "✨";
  return "📺";
}

// Extract YouTube video ID from various YouTube URL formats
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function TVMovieDetailPage({ params }: PageProps) {
  const { user } = useAuth();
  const [id, setId] = useState<string>("");
  const [tvMovie, setTVMovie] = useState<TVMovie | null>(null);
  const [discussions, setDiscussions] = useState<TVMovieDiscussion[]>([]);
  const [repliesByDiscussion, setRepliesByDiscussion] = useState<Record<string, TVMovieReply[]>>({});
  const [reactions, setReactions] = useState<UserReactions>({} as UserReactions);
  const [discussionReactions, setDiscussionReactions] = useState<DiscussionReactions>({});
  const [replyReactions, setReplyReactions] = useState<ReplyReactions>({});
  const [userStatus, setUserStatus] = useState<TVMovieStatus | null>(null);
  const [showSpoilers, setShowSpoilers] = useState(false);

  // Discussion creation form
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionBody, setDiscussionBody] = useState("");
  const [discussionIsSpoiler, setDiscussionIsSpoiler] = useState(false);
  const [discussionIsAnon, setDiscussionIsAnon] = useState(true);
  const [discussionGifUrl, setDiscussionGifUrl] = useState<string>("");
  const [discussionImageUrl, setDiscussionImageUrl] = useState<string>("");
  const [showDiscussionGiphyPicker, setShowDiscussionGiphyPicker] = useState(false);
  const [showDiscussionImageUpload, setShowDiscussionImageUpload] = useState(false);

  // Reply form
  const [replyText, setReplyText] = useState("");
  const [replyIsAnon, setReplyIsAnon] = useState(true);
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);
  const [replyGifUrl, setReplyGifUrl] = useState<string>("");
  const [replyImageUrl, setReplyImageUrl] = useState<string>("");
  const [showReplyGiphyPicker, setShowReplyGiphyPicker] = useState(false);
  const [showReplyImageUpload, setShowReplyImageUpload] = useState(false);

  // Load params
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Fetch TV show/movie data
  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        // Fetch TV show/movie
        const res = await fetch(`/api/tv-movies/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTVMovie(data.tvMovie);
        }

        // Fetch discussions
        const discussionsRes = await fetch(`/api/tv-movies/${id}/discussions`);
        if (discussionsRes.ok) {
          const data = await discussionsRes.json();
          setDiscussions(data.discussions || []);

          // Fetch replies for each discussion
          for (const disc of data.discussions || []) {
            const repliesRes = await fetch(`/api/tv-movies/${id}/discussions/${disc.id}/replies`);
            if (repliesRes.ok) {
              const repliesData = await repliesRes.json();
              setRepliesByDiscussion(prev => ({
                ...prev,
                [disc.id]: repliesData.replies || []
              }));
            }
          }
        }

        // Fetch user reactions
        const reactionsRes = await fetch(`/api/tv-movies/reactions?userId=current-user`);
        if (reactionsRes.ok) {
          const data = await reactionsRes.json();
          setReactions(data.reactions[id] || {});
        }

        // Fetch user status
        const statusRes = await fetch(`/api/tv-movies/${id}/status?userId=current-user`);
        if (statusRes.ok) {
          const data = await statusRes.json();
          setUserStatus(data.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [id]);

  // Toggle reaction
  async function toggleReaction(reactionId: ReactionId, active: boolean) {
    setReactions((prev) => ({
      ...prev,
      [reactionId]: active,
    }));

    try {
      await fetch(`/api/tv-movies/${id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionId, active, userId: "current-user" }),
      });
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  }

  // Update status
  async function updateStatus(newStatus: TVMovieStatus) {
    setUserStatus(newStatus);

    try {
      await fetch(`/api/tv-movies/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, userId: "current-user" }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  // Create discussion
  async function handleDiscussionSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!discussionTitle.trim() || !discussionBody.trim()) return;

    // Use user's alias if anonymous, real name if not
    const displayName = user
      ? (discussionIsAnon ? user.alias : user.name)
      : "Someone in TV & Movies";

    try {
      const res = await fetch(`/api/tv-movies/${id}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: discussionTitle,
          body: discussionBody,
          author: displayName,
          isSpoiler: discussionIsSpoiler,
          gifUrl: discussionGifUrl || undefined,
          imageUrl: discussionImageUrl || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDiscussions([data.discussion, ...discussions]);
        setDiscussionTitle("");
        setDiscussionBody("");
        setDiscussionIsSpoiler(false);
        setDiscussionIsAnon(true); // Reset to anonymous
        setDiscussionGifUrl("");
        setDiscussionImageUrl("");
        setShowDiscussionForm(false);
      }
    } catch (error) {
      console.error("Error creating discussion:", error);
    }
  }

  // Create reply
  async function handleReplySubmit(discussionId: string, e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Use user's alias if anonymous, real name if not
    const displayName = user
      ? (replyIsAnon ? user.alias : user.name)
      : "Someone in TV & Movies";

    try {
      const res = await fetch(`/api/tv-movies/${id}/discussions/${discussionId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: displayName,
          body: replyText,
          isSpoiler: false,
          gifUrl: replyGifUrl || undefined,
          imageUrl: replyImageUrl || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRepliesByDiscussion(prev => ({
          ...prev,
          [discussionId]: [...(prev[discussionId] || []), data.reply]
        }));
        setReplyText("");
        setReplyIsAnon(true); // Reset to anonymous
        setReplyGifUrl("");
        setReplyImageUrl("");
        setActiveDiscussionId(null);

        // Update discussion reply count
        setDiscussions(prev => prev.map(d =>
          d.id === discussionId ? { ...d, replyCount: d.replyCount + 1 } : d
        ));
      }
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  }

  // Toggle reactions for discussions
  function toggleDiscussionReaction(discussionId: string, reactionId: ReactionId, active: boolean) {
    setDiscussionReactions((prev) => ({
      ...prev,
      [discussionId]: {
        ...prev[discussionId],
        [reactionId]: active,
      },
    }));

    // Send to API
    fetch(`/api/tv-movies/${id}/discussions/${discussionId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reactionId, active, userId: "current-user" }),
    }).catch((error) => {
      console.error("Error toggling discussion reaction:", error);
    });
  }

  // Toggle reactions for replies
  function toggleReplyReaction(discussionId: string, replyId: string, reactionId: ReactionId, active: boolean) {
    setReplyReactions((prev) => ({
      ...prev,
      [replyId]: {
        ...prev[replyId],
        [reactionId]: active,
      },
    }));

    // Send to API
    fetch(`/api/tv-movies/${id}/discussions/${discussionId}/replies/${replyId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reactionId, active, userId: "current-user" }),
    }).catch((error) => {
      console.error("Error toggling reply reaction:", error);
    });
  }

  if (!tvMovie) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-center text-[#7A674C]">Loading...</p>
      </div>
    );
  }

  const filteredDiscussions = showSpoilers
    ? discussions
    : discussions.filter(d => !d.isSpoiler);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: CONTENT */}
        <div className="md:col-span-3 space-y-6">
          {/* BREADCRUMB */}
          <div className="text-[11px] text-[#A08960] flex items-center gap-2">
            <Link
              href="/tv-movies"
              className="hover:underline hover:text-yellow-900 transition-colors"
            >
              TV & Movies Room
            </Link>
            <span>/</span>
            <span className="text-[#7A674C] truncate">{tvMovie.title}</span>
          </div>

          {/* MAIN CARD */}
          <article className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start gap-4">
              {/* Author Avatar */}
              <div
                className={`w-14 h-14 rounded-full ${getAvatarColor(
                  tvMovie.sharedBy
                )} flex items-center justify-center text-lg font-bold text-[#3A2E1F] shadow-lg ring-2 ring-white`}
              >
                {getAuthorInitial(tvMovie.sharedBy)}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-[#5C4A33]">
                    {tvMovie.sharedBy}
                  </span>
                  <span className="text-[11px] text-[#A08960]">
                    {new Date(tvMovie.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-200 text-[11px] font-semibold text-yellow-900 shadow-sm">
                    <span>{moodEmoji(tvMovie.mood)}</span>
                    <span>{tvMovie.mood}</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full border border-yellow-200 bg-yellow-50 text-[#5C4A33] text-[11px] font-medium">
                    {tvMovie.type}
                  </span>
                  {tvMovie.era && (
                    <span className="px-3 py-1.5 rounded-full border border-yellow-200 bg-yellow-50 text-[#5C4A33] text-[11px] font-medium">
                      {tvMovie.era}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Cover Image */}
              {tvMovie.coverUrl && (
                <div className="w-32 h-48 md:w-40 md:h-60 rounded-xl overflow-hidden bg-yellow-50 border-2 border-yellow-200 flex-shrink-0 shadow-lg">
                  <img
                    src={tvMovie.coverUrl}
                    alt={`Cover for ${tvMovie.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-yellow-900 leading-tight">
                    {tvMovie.title}
                  </h1>
                  {tvMovie.genre && (
                    <p className="text-sm text-[#A08960] mt-1">{tvMovie.genre}</p>
                  )}
                  {tvMovie.platform && (
                    <p className="text-sm text-[#7A674C] mt-1">
                      Available on {tvMovie.platform}
                    </p>
                  )}
                </div>

                {tvMovie.note && (
                  <p className="text-sm md:text-base text-[#5C4A33] whitespace-pre-line leading-relaxed">
                    {tvMovie.note}
                  </p>
                )}

                {/* Status Selector */}
                <div className="flex flex-wrap gap-2">
                  {(["Want to watch", "Watching", "Watched"] as TVMovieStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(status)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                        userStatus === status
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-[#3A2E1F] shadow-md"
                          : "bg-yellow-50 border border-yellow-200 text-[#7A674C] hover:bg-yellow-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {tvMovie.link && (
                  <a
                    href={tvMovie.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sm font-semibold text-[#3A2E1F] shadow-md hover:shadow-lg transition-all"
                  >
                    <span>🔗</span>
                    <span>View details</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>

            {/* Trailer Embed */}
            {tvMovie.trailerUrl && getYouTubeVideoId(tvMovie.trailerUrl) && (
              <div className="rounded-xl overflow-hidden border-2 border-yellow-200 shadow-lg">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(tvMovie.trailerUrl)}`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* REACTIONS */}
            <div className="flex flex-col gap-3 pt-2 border-t border-yellow-200/40">
              <ReactionBar
                roomId="tvMovies"
                postId={tvMovie.id}
                reactions={reactions}
                onReactionToggle={toggleReaction}
                showLabels={true}
              />
              <p className="text-[9px] text-[#C0A987] italic">
                Reactions are for care, not counts. Only you see what you&apos;ve sent.
              </p>
            </div>
          </article>

          {/* DISCUSSIONS SECTION */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-yellow-900">
                  Discussions ({discussions.length})
                </p>
                <label className="flex items-center gap-2 text-xs text-[#7A674C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSpoilers}
                    onChange={(e) => setShowSpoilers(e.target.checked)}
                    className="rounded border-yellow-300 text-yellow-500 focus:ring-yellow-400"
                  />
                  Show spoilers
                </label>
              </div>
              <BouncyButton
                onClick={() => setShowDiscussionForm(!showDiscussionForm)}
                variant="primary"
                size="sm"
              >
                {showDiscussionForm ? "Cancel" : "Start discussion"}
              </BouncyButton>
            </div>

            {/* Discussion Form */}
            {showDiscussionForm && (
              <form
                onSubmit={handleDiscussionSubmit}
                className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-5 md:p-6 space-y-4 shadow-lg"
              >
                <div className="space-y-2">
                  <p className="text-base font-semibold text-yellow-900">
                    Start a new discussion 💬
                  </p>
                  <p className="text-sm text-[#7A674C] leading-relaxed">
                    Share your thoughts, theories, or ask questions about this {tvMovie.type.toLowerCase()}.
                  </p>
                </div>

                <input
                  type="text"
                  value={discussionTitle}
                  onChange={(e) => setDiscussionTitle(e.target.value)}
                  placeholder="Discussion title (e.g., 'That ending though...')"
                  className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                  required
                />

                <textarea
                  rows={4}
                  value={discussionBody}
                  onChange={(e) => setDiscussionBody(e.target.value)}
                  placeholder="What do you want to discuss?"
                  className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-none"
                  required
                />

                {/* Image/GIF Preview */}
                {(discussionImageUrl || discussionGifUrl) && (
                  <div className="relative rounded-xl overflow-hidden border-2 border-yellow-200">
                    <img
                      src={discussionImageUrl || discussionGifUrl}
                      alt="Preview"
                      className="w-full max-h-96 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDiscussionImageUrl("");
                        setDiscussionGifUrl("");
                      }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 text-[#7A674C] hover:text-yellow-900 transition-colors shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Media Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDiscussionGiphyPicker(true)}
                    className="px-3 py-2 rounded-xl border border-yellow-200 bg-white hover:bg-yellow-50 text-[#5C4A33] text-sm font-medium transition-all flex items-center gap-1.5"
                  >
                    <span>📹</span>
                    <span>Add GIF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDiscussionImageUpload(true)}
                    className="px-3 py-2 rounded-xl border border-yellow-200 bg-white hover:bg-yellow-50 text-[#5C4A33] text-sm font-medium transition-all flex items-center gap-1.5"
                  >
                    <span>📷</span>
                    <span>Add Image</span>
                  </button>
                </div>

                <label className="flex items-center gap-2 text-sm text-[#7A674C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={discussionIsSpoiler}
                    onChange={(e) => setDiscussionIsSpoiler(e.target.checked)}
                    className="rounded border-yellow-300 text-yellow-500 focus:ring-yellow-400"
                  />
                  This contains spoilers
                </label>

                <div className="space-y-3">
                  {user && (
                    <div className="space-y-1 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
                      <p className="text-[10px] text-[#A08960]">Posting as:</p>
                      <p className="text-xs font-medium text-[#5C4A33]">
                        {discussionIsAnon ? user.alias : user.name}
                      </p>
                    </div>
                  )}

                  <AnonymousToggle
                    isAnonymous={discussionIsAnon}
                    onChange={setDiscussionIsAnon}
                    userAlias={user?.alias}
                  />
                </div>

                <BouncyButton
                  type="submit"
                  disabled={!discussionTitle.trim() || !discussionBody.trim()}
                  variant="primary"
                  size="md"
                >
                  Post discussion
                </BouncyButton>
              </form>
            )}

            {/* Discussions List */}
            <div className="space-y-3">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="bg-gradient-to-br from-white to-yellow-50/10 border border-yellow-200/60 rounded-2xl p-5 space-y-3 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Discussion Header */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${getAvatarColor(
                        discussion.author
                      )} flex items-center justify-center text-sm font-bold text-[#3A2E1F] shadow-md ring-2 ring-white`}
                    >
                      {getAuthorInitial(discussion.author)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#5C4A33]">
                          {discussion.author}
                        </span>
                        <span className="text-[10px] text-[#A08960]">
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </span>
                        {discussion.isSpoiler && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-200 text-[10px] font-semibold text-red-700">
                            ⚠️ Spoiler
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-yellow-900">
                        {discussion.title}
                      </h3>
                      <p className="text-sm text-[#5C4A33] whitespace-pre-line leading-relaxed">
                        {discussion.body}
                      </p>

                      {/* Display GIF or Image */}
                      {(discussion.gifUrl || discussion.imageUrl) && (
                        <div className="mt-3 rounded-xl overflow-hidden border-2 border-yellow-200">
                          <img
                            src={discussion.gifUrl || discussion.imageUrl}
                            alt="Discussion media"
                            className="w-full max-h-96 object-contain"
                          />
                        </div>
                      )}

                      {/* Reaction Bar for Discussion */}
                      <div className="mt-3 pt-2 border-t border-yellow-200/40">
                        <ReactionBar
                          roomId="tvMovies"
                          postId={discussion.id}
                          reactions={discussionReactions[discussion.id] || {}}
                          onReactionToggle={(reactionId, active) =>
                            toggleDiscussionReaction(discussion.id, reactionId, active)
                          }
                          showLabels={true}
                        />
                      </div>

                      {/* Replies */}
                      {repliesByDiscussion[discussion.id]?.length > 0 && (
                        <div className="mt-3 space-y-3 pl-4 border-l-2 border-yellow-200">
                          {repliesByDiscussion[discussion.id].map((reply) => (
                            <div key={reply.id} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#5C4A33]">
                                  {reply.author}
                                </span>
                                <span className="text-[9px] text-[#A08960]">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-[#5C4A33]">{reply.body}</p>

                              {/* Display GIF or Image in Reply */}
                              {(reply.gifUrl || reply.imageUrl) && (
                                <div className="rounded-xl overflow-hidden border-2 border-yellow-200">
                                  <img
                                    src={reply.gifUrl || reply.imageUrl}
                                    alt="Reply media"
                                    className="w-full max-h-64 object-contain"
                                  />
                                </div>
                              )}

                              {/* Reaction Bar for Reply */}
                              <div className="pt-1 border-t border-yellow-200/40">
                                <ReactionBar
                                  roomId="tvMovies"
                                  postId={reply.id}
                                  reactions={replyReactions[reply.id] || {}}
                                  onReactionToggle={(reactionId, active) =>
                                    toggleReplyReaction(discussion.id, reply.id, reactionId, active)
                                  }
                                  showLabels={false}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {activeDiscussionId === discussion.id ? (
                        <form
                          onSubmit={(e) => handleReplySubmit(discussion.id, e)}
                          className="mt-3 space-y-2"
                        >
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Add your thoughts..."
                            className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-none"
                            autoFocus
                          />

                          {/* Image/GIF Preview for Reply */}
                          {(replyImageUrl || replyGifUrl) && (
                            <div className="relative rounded-xl overflow-hidden border-2 border-yellow-200">
                              <img
                                src={replyImageUrl || replyGifUrl}
                                alt="Preview"
                                className="w-full max-h-64 object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyImageUrl("");
                                  setReplyGifUrl("");
                                }}
                                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 text-[#7A674C] hover:text-yellow-900 transition-colors shadow-lg text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          )}

                          {/* Media Buttons for Reply */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowReplyGiphyPicker(true)}
                              className="px-2 py-1.5 rounded-lg border border-yellow-200 bg-white hover:bg-yellow-50 text-[#5C4A33] text-xs font-medium transition-all flex items-center gap-1"
                            >
                              <span>📹</span>
                              <span>GIF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowReplyImageUpload(true)}
                              className="px-2 py-1.5 rounded-lg border border-yellow-200 bg-white hover:bg-yellow-50 text-[#5C4A33] text-xs font-medium transition-all flex items-center gap-1"
                            >
                              <span>📷</span>
                              <span>Image</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {user && (
                              <div className="space-y-1 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
                                <p className="text-[10px] text-[#A08960]">Posting as:</p>
                                <p className="text-xs font-medium text-[#5C4A33]">
                                  {replyIsAnon ? user.alias : user.name}
                                </p>
                              </div>
                            )}

                            <AnonymousToggle
                              isAnonymous={replyIsAnon}
                              onChange={setReplyIsAnon}
                              userAlias={user?.alias}
                            />
                          </div>

                          <div className="flex gap-2">
                            <BouncyButton
                              type="submit"
                              disabled={!replyText.trim()}
                              variant="primary"
                              size="sm"
                            >
                              Reply
                            </BouncyButton>
                            <BouncyButton
                              type="button"
                              onClick={() => {
                                setActiveDiscussionId(null);
                                setReplyText("");
                                setReplyGifUrl("");
                                setReplyImageUrl("");
                              }}
                              variant="secondary"
                              size="sm"
                            >
                              Cancel
                            </BouncyButton>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setActiveDiscussionId(discussion.id)}
                          className="text-xs text-yellow-700 hover:text-yellow-900 font-semibold mt-2"
                        >
                          💬 Reply ({discussion.replyCount})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredDiscussions.length === 0 && (
                <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-dashed border-yellow-300/60 rounded-2xl p-5 text-sm text-[#7A674C] shadow-sm">
                  <p className="font-semibold text-yellow-900 mb-2">
                    No discussions yet.
                  </p>
                  <p>
                    Be the first to start a conversation about this {tvMovie.type.toLowerCase()}.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Giphy Picker for Discussion */}
      {showDiscussionGiphyPicker && (
        <GiphyPicker
          onSelect={(gifUrl) => {
            setDiscussionGifUrl(gifUrl);
            setDiscussionImageUrl(""); // Clear image if GIF is selected
            setShowDiscussionGiphyPicker(false);
          }}
          onClose={() => setShowDiscussionGiphyPicker(false)}
        />
      )}

      {/* Image Upload for Discussion */}
      {showDiscussionImageUpload && (
        <ImageUpload
          onUpload={(imageUrl) => {
            setDiscussionImageUrl(imageUrl);
            setDiscussionGifUrl(""); // Clear GIF if image is selected
            setShowDiscussionImageUpload(false);
          }}
          onClose={() => setShowDiscussionImageUpload(false)}
        />
      )}

      {/* Giphy Picker for Reply */}
      {showReplyGiphyPicker && (
        <GiphyPicker
          onSelect={(gifUrl) => {
            setReplyGifUrl(gifUrl);
            setReplyImageUrl(""); // Clear image if GIF is selected
            setShowReplyGiphyPicker(false);
          }}
          onClose={() => setShowReplyGiphyPicker(false)}
        />
      )}

      {/* Image Upload for Reply */}
      {showReplyImageUpload && (
        <ImageUpload
          onUpload={(imageUrl) => {
            setReplyImageUrl(imageUrl);
            setReplyGifUrl(""); // Clear GIF if image is selected
            setShowReplyImageUpload(false);
          }}
          onClose={() => setShowReplyImageUpload(false)}
        />
      )}
    </div>
  );
}
