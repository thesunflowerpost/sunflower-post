"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CommunitySidebar from "@/components/CommunitySidebar";
import AnonymousToggle from "@/components/AnonymousToggle";
import { BouncyButton, ReactionBar } from "@/components/ui";
import Link from "next/link";
import type { ReactionId } from "@/config/reactions";

type DilemmaCategory = "Work & Money" | "Dating & Relationships" | "Family & Boundaries" | "Health & Burnout" | "Friendships" | "Life";
type Urgency = "low" | "medium" | "high";

type Dilemma = {
  id: number;
  title: string;
  body: string;
  category: DilemmaCategory;
  urgency?: Urgency;
  author: string;
  isAnonymous: boolean;
  timeAgo: string;
  sameBoat: number;
};

type Perspective = {
  id: number;
  author: string;
  timeAgo: string;
  body: string;
  isHelpful: boolean;
};

type UserReactions = Record<ReactionId, boolean>;

// Mock data
const DILEMMAS: Dilemma[] = [
  {
    id: 1,
    title: "Should I quit my job without another one lined up?",
    body: "I've been at my current job for 3 years and I'm completely burned out. The work environment is toxic, but I don't have another offer yet. I have 6 months savings. Is it reckless to just... leave?",
    category: "Work & Money",
    urgency: "high",
    author: "Anon",
    isAnonymous: true,
    timeAgo: "2 hours ago",
    sameBoat: 8,
  },
  {
    id: 2,
    title: "How do I tell my friend her boyfriend is not it?",
    body: "My best friend has been dating this guy for 6 months and he's... not great. Nothing abusive, just subtly dismissive and kind of mean. She seems happy but I see her making herself smaller. Do I say something or stay out of it?",
    category: "Friendships",
    urgency: "medium",
    author: "M.",
    isAnonymous: false,
    timeAgo: "5 hours ago",
    sameBoat: 15,
  },
];

const INITIAL_PERSPECTIVES: Record<number, Perspective[]> = {
  1: [
    {
      id: 1,
      author: "S.",
      timeAgo: "1 hour ago",
      body: "I did this exact thing 2 years ago and honestly? Best decision I ever made. 6 months savings is solid. Your mental health is worth more than job security in a toxic place. Give yourself permission to breathe.",
      isHelpful: true,
    },
    {
      id: 2,
      author: "Anon",
      timeAgo: "45 mins ago",
      body: "Counterpoint: I left a toxic job without something lined up and the job search took 9 months. The financial stress was worse than the job stress. Maybe start actively applying first, even if you're burned out?",
      isHelpful: true,
    },
  ],
  2: [
    {
      id: 1,
      author: "K.",
      timeAgo: "3 hours ago",
      body: "This is so hard. I've been on both sides. If you say something, you risk her pulling away. If you don't, you watch her dim. Maybe try the 'I noticed...' approach? Like 'I noticed you seem quieter around him' instead of 'he's bad for you.'",
      isHelpful: true,
    },
  ],
};

function getCategoryColor(category: DilemmaCategory): string {
  const colors: Record<DilemmaCategory, string> = {
    "Work & Money": "bg-blue-50 text-blue-700 border-blue-200",
    "Dating & Relationships": "bg-pink-50 text-pink-700 border-pink-200",
    "Family & Boundaries": "bg-purple-50 text-purple-700 border-purple-200",
    "Health & Burnout": "bg-green-50 text-green-700 border-green-200",
    "Friendships": "bg-orange-50 text-orange-700 border-orange-200",
    "Life": "bg-gray-50 text-gray-700 border-gray-200",
  };
  return colors[category];
}

function getUrgencyLabel(urgency?: Urgency): { label: string; color: string } | null {
  if (!urgency || urgency === "low") return null;
  if (urgency === "high") {
    return { label: "Urgent", color: "bg-red-100 text-red-700 border-red-200" };
  }
  return { label: "Soon-ish", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
}

function getAuthorInitial(author: string): string {
  return author.charAt(0).toUpperCase();
}

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

type PageProps = {
  params: { id: string };
};

export default function DilemmaThreadPage({ params }: PageProps) {
  const { user } = useAuth();
  const id = Number(params.id);
  const dilemma = DILEMMAS.find((d) => d.id === id) ?? DILEMMAS[0];
  const initialPerspectives = INITIAL_PERSPECTIVES[id] ?? [];

  const [perspectives, setPerspectives] = useState<Perspective[]>(initialPerspectives);
  const [perspectiveText, setPerspectiveText] = useState("");
  const [isAnon, setIsAnon] = useState(true);
  const [reactions, setReactions] = useState<UserReactions>({} as UserReactions);
  const [sameBoat, setSameBoat] = useState(false);

  const urgencyBadge = getUrgencyLabel(dilemma.urgency);

  function toggleReaction(reactionId: ReactionId, active: boolean) {
    setReactions((prev) => ({
      ...prev,
      [reactionId]: active,
    }));
  }

  const handleSubmitPerspective = (e: FormEvent) => {
    e.preventDefault();
    if (!perspectiveText.trim()) return;

    // Use user's alias if anonymous, real name if not
    const displayName = user
      ? (isAnon ? user.alias : user.name)
      : "Someone in Dilemmas";

    const newPerspective: Perspective = {
      id: Date.now(),
      author: displayName,
      timeAgo: "Just now",
      body: perspectiveText,
      isHelpful: false,
    };

    setPerspectives([...perspectives, newPerspective]);
    setPerspectiveText("");
    setIsAnon(true); // Reset to anonymous after posting
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white border-b border-[color:var(--border-medium)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dilemmas"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
            >
              ← Back to Dilemmas
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="lg:w-64 flex-shrink-0">
            <CommunitySidebar />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {/* DILEMMA CARD */}
            <div className="bg-white border border-[color:var(--border-medium)] rounded-xl p-6 shadow-[var(--shadow-medium)] mb-6">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getAvatarColor(
                    dilemma.author
                  )}`}
                >
                  {getAuthorInitial(dilemma.author)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[color:var(--text-primary)]">
                      {dilemma.author}
                    </span>
                    <span className="text-xs text-[color:var(--text-tertiary)]">•</span>
                    <span className="text-xs text-[color:var(--text-tertiary)]">{dilemma.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(dilemma.category)}`}>
                      {dilemma.category}
                    </span>
                    {urgencyBadge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${urgencyBadge.color}`}>
                        {urgencyBadge.label}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSameBoat(!sameBoat)}
                  className={[
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    sameBoat
                      ? "bg-[color:var(--sunflower-gold)] text-[color:var(--text-primary)]"
                      : "bg-gray-50 text-[color:var(--text-secondary)] hover:bg-gray-100",
                  ].join(" ")}
                >
                  <span>🚣</span>
                  <span>Same boat</span>
                </button>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h1 className="text-2xl font-semibold text-[color:var(--text-primary)] mb-3">
                  {dilemma.title}
                </h1>
                <p className="text-[color:var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {dilemma.body}
                </p>
              </div>

              {/* Stats & Reactions */}
              <div className="pt-4 border-t border-[color:var(--border-soft)] space-y-3">
                <div className="text-sm text-[color:var(--text-tertiary)]">
                  {dilemma.sameBoat} {dilemma.sameBoat === 1 ? "person" : "people"} in the same boat
                </div>

                <ReactionBar
                  roomId="dilemmas"
                  postId={dilemma.id}
                  reactions={reactions}
                  onReactionToggle={toggleReaction}
                />
              </div>
            </div>

            {/* PERSPECTIVES SECTION */}
            <div className="bg-white border border-[color:var(--border-medium)] rounded-xl p-6 shadow-[var(--shadow-medium)]">
              <h2 className="text-xl font-semibold text-[color:var(--text-primary)] mb-1">
                Perspectives
              </h2>
              <p className="text-sm text-[color:var(--text-tertiary)] mb-4">
                {perspectives.length} {perspectives.length === 1 ? "perspective" : "perspectives"} shared
              </p>

              {/* PERSPECTIVE FORM */}
              <form onSubmit={handleSubmitPerspective} className="mb-6 space-y-4">
                <textarea
                  value={perspectiveText}
                  onChange={(e) => setPerspectiveText(e.target.value)}
                  placeholder="Share your perspective... What would you do? What's worked for you? What feels true here?"
                  rows={4}
                  className="w-full px-4 py-3 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)] resize-none"
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

                <div className="flex justify-end">
                  <BouncyButton
                    type="submit"
                    disabled={!perspectiveText.trim()}
                    className="bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] disabled:bg-gray-200 disabled:text-gray-400 text-[color:var(--text-primary)] px-6 py-2 rounded-lg font-medium shadow-[var(--shadow-soft)] transition-colors"
                  >
                    Share perspective
                  </BouncyButton>
                </div>
              </form>

              {/* PERSPECTIVES LIST */}
              <div className="space-y-4">
                {perspectives.length === 0 ? (
                  <p className="text-center text-[color:var(--text-tertiary)] py-8">
                    No perspectives yet. Be the first to share your thoughts.
                  </p>
                ) : (
                  perspectives.map((perspective) => (
                    <div
                      key={perspective.id}
                      className="flex gap-3 p-4 rounded-lg bg-gray-50 border border-[color:var(--border-soft)]"
                    >
                      {/* AVATAR */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getAvatarColor(
                          perspective.author
                        )}`}
                      >
                        {getAuthorInitial(perspective.author)}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-[color:var(--text-primary)]">
                            {perspective.author}
                          </span>
                          <span className="text-xs text-[color:var(--text-tertiary)]">
                            {perspective.timeAgo}
                          </span>
                        </div>
                        <p className="text-[color:var(--text-secondary)] leading-relaxed mb-2">
                          {perspective.body}
                        </p>
                        {perspective.isHelpful && (
                          <span className="inline-flex items-center gap-1 text-xs text-[color:var(--text-tertiary)] bg-white px-2 py-1 rounded-full border border-[color:var(--border-soft)]">
                            💡 Marked helpful by OP
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white border border-[color:var(--border-medium)] rounded-xl p-5 shadow-[var(--shadow-soft)]">
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mb-3">
                Remember
              </h3>
              <ul className="space-y-2.5 text-sm text-[color:var(--text-secondary)]">
                <li className="flex gap-2">
                  <span className="text-[color:var(--sunflower-gold)] flex-shrink-0">→</span>
                  <span>Everyone's situation is different. Take what resonates, leave what doesn't.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[color:var(--sunflower-gold)] flex-shrink-0">→</span>
                  <span>It's okay to feel conflicted. That's usually a sign you care.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[color:var(--sunflower-gold)] flex-shrink-0">→</span>
                  <span>You don't have to have all the answers right now.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
