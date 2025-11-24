"use client";

import { useState, useRef, type FormEvent } from "react";
import CommunitySidebar from "@/components/CommunitySidebar";
import { BouncyButton, ReactionBar } from "@/components/ui";
import Link from "next/link";
import type { ReactionId } from "@/config/reactions";

type MusicMood = string;

type TrackItem = {
  id: number;
  title: string;
  artist: string;
  mood: MusicMood;
  era?: string;
  genre?: string;
  source?: string;
  link?: string;
  sharedBy: string;
  note?: string;
  timeAgo: string;
  imageUrl?: string;
};

type TrackReply = {
  id: number;
  author: string;
  timeAgo: string;
  body: string;
  imageUrl?: string; // For GIF support
};

type UserReactions = Record<ReactionId, boolean>;

// Mock data - in real app this would come from database
const TRACKS: TrackItem[] = [
  {
    id: 1,
    title: "Say My Name",
    artist: "Destiny's Child",
    mood: "Nostalgia",
    era: "90s / 2000s",
    genre: "R&B / Pop",
    source: "Everywhere tbh",
    sharedBy: "S.",
    note: "Instant throwback energy. Great for cleaning or getting ready.",
    timeAgo: "Shared 3 days ago",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Ordinary People",
    artist: "John Legend",
    mood: "Cry then feel better",
    era: "2000s",
    genre: "Soul",
    source: "Spotify / YouTube",
    sharedBy: "Anon",
    note: "For when you're processing feelings and need a good reflective cry.",
    timeAgo: "Shared 1 week ago",
  },
  {
    id: 3,
    title: "Just Fine",
    artist: "Mary J. Blige",
    mood: "Feel-good",
    era: "2000s",
    genre: "R&B",
    source: "Spotify / Apple Music",
    sharedBy: "Jay",
    note: "Instant mood lift. Walking anthem when you need to remember you're actually that girl.",
    timeAgo: "Shared 2 weeks ago",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
  },
];

const INITIAL_REPLIES_BY_TRACK: Record<number, TrackReply[]> = {
  1: [
    {
      id: 1,
      author: "L.",
      timeAgo: "2 days ago",
      body: "As soon as the beat drops I'm back in my childhood kitchen 😂",
    },
    {
      id: 2,
      author: "M.",
      timeAgo: "1 day ago",
      body: "This song lives rent-free in my head. Perfect for when you need that main character energy.",
    },
  ],
  2: [
    {
      id: 1,
      author: "S.",
      timeAgo: "5 days ago",
      body: "This one hits different late at night. Such a beautiful, grounding song.",
    },
  ],
  3: [],
};

function moodEmoji(mood: MusicMood) {
  const lower = mood.toLowerCase();
  if (lower.includes("nostalgia")) return "📼";
  if (lower.includes("feel-good") || lower.includes("feel good")) return "🌞";
  if (lower.includes("soft background")) return "☁️";
  if (lower.includes("main character")) return "✨";
  if (lower.includes("cry")) return "😭";
  return "🎵";
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

// Helper to get embed URL from music links
function getEmbedUrl(link: string): { type: 'spotify' | 'youtube' | 'apple' | null; embedUrl: string | null } {
  if (!link) return { type: null, embedUrl: null };

  // Spotify
  const spotifyMatch = link.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return {
      type: 'spotify',
      embedUrl: `https://open.spotify.com/embed/track/${spotifyMatch[1]}?utm_source=generator&theme=0`,
    };
  }

  // YouTube
  const youtubeMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  // Apple Music
  if (link.includes('music.apple.com')) {
    return { type: 'apple', embedUrl: link };
  }

  return { type: null, embedUrl: null };
}

type PageProps = {
  params: { id: string };
};

export default function MusicRoomThreadPage({ params }: PageProps) {
  const id = Number(params.id);
  const track = TRACKS.find((t) => t.id === id) ?? TRACKS[0];
  const initialReplies = INITIAL_REPLIES_BY_TRACK[id] ?? [];

  const [replies, setReplies] = useState<TrackReply[]>(initialReplies);
  const [replyText, setReplyText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [reactions, setReactions] = useState<UserReactions>({} as UserReactions);

  // Toggle helper for reactions
  function toggleReaction(reactionId: ReactionId, active: boolean) {
    setReactions((prev) => ({
      ...prev,
      [reactionId]: active,
    }));
  }

  function handleReplySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: TrackReply = {
      id: replies.length + 1,
      author: "You",
      timeAgo: "Just now",
      body: replyText.trim(),
      ...(mediaUrl.trim() && { imageUrl: mediaUrl.trim() }),
    };

    setReplies([...replies, newReply]);
    setReplyText("");
    setMediaUrl("");
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
              href="/music-room"
              className="hover:underline hover:text-yellow-900 transition-colors"
            >
              Music Room
            </Link>
            <span>/</span>
            <span className="text-[#7A674C] truncate">
              {track.title} by {track.artist}
            </span>
          </div>

          {/* MAIN TRACK CARD */}
          <article className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start gap-4">
              {/* Author Avatar */}
              <div
                className={`w-14 h-14 rounded-full ${getAvatarColor(
                  track.sharedBy
                )} flex items-center justify-center text-lg font-bold text-[#3A2E1F] shadow-lg ring-2 ring-white`}
              >
                {getAuthorInitial(track.sharedBy)}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-[#5C4A33]">
                    {track.sharedBy}
                  </span>
                  <span className="text-[11px] text-[#A08960]">
                    {track.timeAgo}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-200 text-[11px] font-semibold text-yellow-900 shadow-sm">
                    <span>{moodEmoji(track.mood)}</span>
                    <span>{track.mood}</span>
                  </span>
                  {track.era && (
                    <span className="px-3 py-1.5 rounded-full border border-yellow-200 bg-yellow-50 text-[#5C4A33] text-[11px] font-medium">
                      {track.era}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Album art */}
              {track.imageUrl && (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden bg-yellow-50 border-2 border-yellow-200 flex-shrink-0 shadow-lg">
                  <img
                    src={track.imageUrl}
                    alt={`Album art for ${track.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-yellow-900 leading-tight">
                  {track.title}
                </h1>
                <p className="text-base md:text-lg text-[#7A674C] mt-1">
                  {track.artist}
                </p>
                <p className="text-sm text-[#A08960] mt-1">
                  {track.genre && <span>{track.genre}</span>}
                  {track.source && (
                    <span>
                      {track.genre && " · "}
                      <span className="italic">{track.source}</span>
                    </span>
                  )}
                </p>
                {track.note && (
                  <p className="text-sm md:text-base text-[#5C4A33] whitespace-pre-line leading-relaxed mt-3">
                    {track.note}
                  </p>
                )}
              </div>
            </div>

            {/* EMBEDDED MUSIC PLAYER */}
            {track.link && (() => {
              const { type, embedUrl } = getEmbedUrl(track.link);

              if (type === 'spotify' && embedUrl) {
                return (
                  <div className="mt-5 pt-5 border-t border-yellow-200/40">
                    <p className="text-xs font-semibold text-yellow-900 mb-3">🎵 Listen now</p>
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-xl border border-yellow-200 shadow-md"
                    />
                  </div>
                );
              } else if (type === 'youtube' && embedUrl) {
                return (
                  <div className="mt-5 pt-5 border-t border-yellow-200/40">
                    <p className="text-xs font-semibold text-yellow-900 mb-3">🎵 Listen now</p>
                    <div className="aspect-video rounded-xl overflow-hidden border border-yellow-200 shadow-md">
                      <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              } else if (type === 'apple' && embedUrl) {
                return (
                  <div className="mt-5 pt-5 border-t border-yellow-200/40">
                    <a
                      href={embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sm font-semibold text-[#3A2E1F] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>🎵</span>
                      <span>Listen on Apple Music</span>
                      <span>↗</span>
                    </a>
                  </div>
                );
              } else if (track.link) {
                return (
                  <div className="mt-5 pt-5 border-t border-yellow-200/40">
                    <a
                      href={track.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sm font-semibold text-[#3A2E1F] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>🎵</span>
                      <span>Listen to song</span>
                      <span>↗</span>
                    </a>
                  </div>
                );
              }
              return null;
            })()}

            {/* INTERACTIVE REACTIONS */}
            <div className="flex flex-col gap-3 pt-2 border-t border-yellow-200/40">
              <ReactionBar
                roomId="musicRoom"
                postId={track.id}
                reactions={reactions}
                onReactionToggle={toggleReaction}
                showLabels={true}
              />
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
                Comments ({replies.length})
              </p>
              <p className="text-[10px] text-[#A08960] italic">
                Share memories, vibes, or where this song takes you.
              </p>
            </div>

            <div className="space-y-3">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-gradient-to-br from-white to-yellow-50/10 border border-yellow-200/60 rounded-2xl p-5 space-y-3 text-sm shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    {/* Reply Author Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full ${getAvatarColor(
                        reply.author
                      )} flex items-center justify-center text-sm font-bold text-[#3A2E1F] shadow-md ring-2 ring-white`}
                    >
                      {getAuthorInitial(reply.author)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#5C4A33]">
                          {reply.author}
                        </span>
                        <span className="text-[10px] text-[#A08960]">
                          {reply.timeAgo}
                        </span>
                      </div>
                      <p className="text-sm text-[#5C4A33] whitespace-pre-line leading-relaxed font-medium">
                        {reply.body}
                      </p>
                      {reply.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={reply.imageUrl}
                            alt="Reply attachment"
                            className="max-w-xs rounded-xl border border-yellow-200 shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {replies.length === 0 && (
                <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-dashed border-yellow-300/60 rounded-2xl p-5 text-sm text-[#7A674C] shadow-sm">
                  <p className="font-semibold text-yellow-900 mb-2">
                    No comments yet.
                  </p>
                  <p>
                    Be the first to share what this song means to you, or where you first heard it.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* REPLY COMPOSER */}
          <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-5 md:p-6 space-y-4 shadow-lg">
            <div className="space-y-2">
              <p className="text-base font-semibold text-yellow-900">
                Add a comment 💬
              </p>
              <p className="text-sm text-[#7A674C] leading-relaxed">
                Share the memory it reminds you of, how you found it, or what mood it fits.
                No music snobbery here – your guilty pleasures are safe. 🎶
              </p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="What does this song mean to you? Where does it take you?"
                className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-none"
              />

              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#7A674C] flex items-center gap-1.5">
                    <span>📎</span>
                    <span>Add a GIF or image (optional)</span>
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Paste image or GIF URL (e.g., from Giphy, Tenor, Imgur)"
                    className="w-full border border-yellow-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                  />
                  {mediaUrl.trim() && (
                    <div className="mt-2 p-2 bg-yellow-50/50 border border-yellow-200 rounded-xl">
                      <p className="text-[10px] text-[#7A674C] mb-2 font-medium">Preview:</p>
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="max-w-xs max-h-40 rounded-lg border border-yellow-200 shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <BouncyButton
                  type="submit"
                  disabled={!replyText.trim()}
                  variant="primary"
                  size="md"
                  className="shadow-md"
                >
                  Post comment
                </BouncyButton>
                <p className="text-[10px] text-[#A08960] italic">
                  Share stories, memories, and visuals – always within gentle boundaries. 🌻
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
