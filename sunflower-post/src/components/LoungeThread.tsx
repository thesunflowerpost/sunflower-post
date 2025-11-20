"use client";

import Link from "next/link";
import { useState, useRef, type FormEvent } from "react";

type LoungePostType = "joy" | "pickmeup" | "softrant";

type ThreadPost = {
  id: number;
  type: LoungePostType;
  title: string;
  body: string;
  author: string;
  timeAgo: string;
  imageUrl?: string;
};

type Reply = {
  id: number;
  author: string;
  body: string;
  timeAgo: string;
  isOp: boolean;
  imageUrl?: string; // optional image / GIF URL (upload preview or external)
};

const THREAD_POSTS: ThreadPost[] = [
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

const INITIAL_REPLIES: Reply[] = [
  {
    id: 1,
    author: "S.",
    body: "You’re not behind — you’re moving at your own pace in a really weird era. That alone is a win.",
    timeAgo: "1 hour ago",
    isOp: false,
  },
  {
    id: 2,
    author: "OP",
    body: "Thank you — hearing that from a stranger really does help.",
    timeAgo: "58 minutes ago",
    isOp: true,
  },
  {
    id: 3,
    author: "Maya",
    body: "Saving this because I feel the same. You’re definitely not alone in this feeling.",
    timeAgo: "30 minutes ago",
    isOp: false,
  },
];

type Props = {
  postId: number | null;
};

export default function LoungeThread({ postId }: Props) {
  const post =
    THREAD_POSTS.find((p) => p.id === postId) ?? THREAD_POSTS[1]; // default to id 2

  const [replies, setReplies] = useState<Reply[]>(INITIAL_REPLIES);
  const [replyBody, setReplyBody] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyMediaUrl, setReplyMediaUrl] = useState(""); // external URL (Giphy, etc.)
  const [replyFilePreviewUrl, setReplyFilePreviewUrl] = useState<string | null>(
    null
  ); // local upload preview
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isAnon, setIsAnon] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleReplySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!replyBody.trim()) return;

    setSubmitting(true);

    const trimmedExternal = replyMediaUrl.trim();
    const finalMediaUrl = replyFilePreviewUrl || (trimmedExternal || undefined);

    const newReply: Reply = {
      id: replies.length + 1,
      author:
        isAnon || !replyName.trim() ? "Someone in the Lounge" : replyName.trim(),
      body: replyBody.trim(),
      timeAgo: "Just now",
      isOp: false,
      imageUrl: finalMediaUrl,
    };

    setReplies([...replies, newReply]);
    setReplyBody("");
    setReplyName("");
    setReplyMediaUrl("");
    setReplyFilePreviewUrl(null);
    setIsAnon(true);
    setSubmitting(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setReplyFilePreviewUrl(url);
    // If they upload a file, clear the external URL to avoid confusion
    setReplyMediaUrl("");
  }

  const typeLabel =
    post.type === "joy"
      ? "Small joy"
      : post.type === "pickmeup"
      ? "Pick-me-up"
      : "Soft rant";

  const typeBadgeClasses =
    post.type === "joy"
      ? "bg-yellow-50 border-yellow-100 text-[#5C4A33]"
      : post.type === "pickmeup"
      ? "bg-[#FDF5FF] border-[#E7D3FF] text-[#5B4377]"
      : "bg-[#FDF4EC] border-[#F3C9A3] text-[#6C4A33]";

  const hasPreview = replyFilePreviewUrl || replyMediaUrl.trim();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-10 space-y-6">
      {/* BREADCRUMB */}
      <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
        <Link
          href="/lounge"
          className="inline-flex items-center gap-1 hover:text-yellow-900"
        >
          <span>←</span>
          <span>Back to The Lounge</span>
        </Link>
        <span className="hidden sm:inline">
          Replies are for care, not debate.
        </span>
      </div>

      {/* ORIGINAL POST */}
      <section className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between text-[10px] text-[#A08960]">
          <span
            className={`px-2 py-[2px] rounded-full border ${typeBadgeClasses}`}
          >
            {typeLabel}
          </span>
          <span>{post.timeAgo}</span>
        </div>

        <h1 className="text-base md:text-lg font-semibold text-yellow-900">
          {post.title}
        </h1>
        <p className="text-xs md:text-sm text-[#5C4A33] whitespace-pre-line">
          {post.body}
        </p>

        {/* POST IMAGE */}
        {post.imageUrl && (
          <div className="mt-2">
            <img
              src={post.imageUrl}
              alt="Post image"
              className="w-full max-w-sm h-auto rounded-xl object-cover border border-yellow-100 shadow-sm"
            />
          </div>
        )}

        <p className="text-[11px] text-[#7A674C]">By {post.author}</p>
      </section>

      {/* REPLY FORM - Above existing replies */}
      <section className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3 text-xs md:text-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-yellow-900">Write a reply 💬</p>
          <p className="text-[10px] text-[#A08960]">
            One or two sentences is plenty.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleReplySubmit}>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#5C4A33]">
              Your reply
            </label>
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={3}
              placeholder="You can validate, encourage or gently share something that helped you. No advice-dumping needed."
              className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* ATTACHMENTS AREA */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full border border-yellow-200 bg-white text-[11px] text-[#5C4A33] hover:bg-yellow-50 inline-flex items-center gap-1"
              >
                <span>📷</span>
                <span>Upload image</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput((s) => !s)}
                className="px-3 py-1.5 rounded-full border border-yellow-200 bg-white text-[11px] text-[#5C4A33] hover:bg-yellow-50 inline-flex items-center gap-1"
              >
                <span>🎞️</span>
                <span>Add from Giphy / link</span>
              </button>

              <span className="text-[10px] text-[#A08960]">
                Optional: one gentle image or GIF to add warmth.
              </span>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* URL input (for Giphy / image links) */}
            {showUrlInput && (
              <div className="space-y-1">
                <input
                  type="url"
                  value={replyMediaUrl}
                  onChange={(e) => {
                    setReplyMediaUrl(e.target.value);
                    // If they start typing a URL, clear local file preview
                    if (replyFilePreviewUrl) {
                      setReplyFilePreviewUrl(null);
                    }
                  }}
                  placeholder="Paste a link to a GIF or image (e.g. from Giphy, Tenor, Imgur)."
                  className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
                <p className="text-[10px] text-[#A08960]">
                  Tip: open giphy.com in a new tab, search a feeling (e.g.
                  &quot;soft encouragement&quot;), copy the GIF link and paste
                  it here.
                </p>
              </div>
            )}

            {/* PREVIEW */}
            {hasPreview && (
              <div className="mt-2 bg-white border border-yellow-100 rounded-2xl p-2 flex items-start gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FFF7E6] flex items-center justify-center text-[24px]">
                  {replyFilePreviewUrl || replyMediaUrl.trim() ? (
                    <img
                      src={replyFilePreviewUrl || replyMediaUrl.trim()}
                      alt="Attachment preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>🌻</span>
                  )}
                </div>
                <div className="flex-1 text-[11px] text-[#7A674C] space-y-1">
                  <p className="font-medium text-yellow-900">Attachment preview</p>
                  <p>
                    This will show under your reply. If it doesn&apos;t look
                    right, you can change the image or clear the field before
                    sending.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-3 items-start">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#5C4A33]">
                Name (optional)
              </label>
              <input
                type="text"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
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
                <li>
                  • Keep images kind, non-graphic and safe for a soft community
                  space.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting || !replyBody.trim()}
              className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
            >
              {submitting ? "Sending..." : "Send reply"}
            </button>
            <p className="text-[10px] text-[#A08960]">
              Replies and images can be lightly moderated to keep this room
              feeling safe.
            </p>
          </div>
        </form>
      </section>

      {/* EXISTING REPLIES - Below form */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
          <p className="font-semibold text-yellow-900">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </p>
          <p className="text-[10px] text-[#A08960]">
            No pressure to fix, just respond with care.
          </p>
        </div>

        <div className="space-y-3">
          {replies.map((reply) => (
            <article
              key={reply.id}
              className="bg-white border border-yellow-100 rounded-2xl p-3 md:p-4 space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#5C4A33]">
                    {reply.author}
                  </span>
                  {reply.isOp && (
                    <span className="px-2 py-[1px] rounded-full bg-yellow-50 border border-yellow-100">
                      OP
                    </span>
                  )}
                </div>
                <span>{reply.timeAgo}</span>
              </div>
              <p className="text-xs md:text-sm text-[#5C4A33] whitespace-pre-line">
                {reply.body}
              </p>

              {reply.imageUrl && (
                <div className="mt-2">
                  <img
                    src={reply.imageUrl}
                    alt="Reply attachment"
                    className="rounded-xl max-h-56 w-auto object-cover border border-yellow-50"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
