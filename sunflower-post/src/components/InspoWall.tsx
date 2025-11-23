"use client";

import Link from "next/link";
import { useState, useRef, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";
import { BouncyButton, ReactionBar } from "./ui";
import type { ReactionId } from "@/config/reactions";

type InspoCategory = string;
type CategoryFilter = "All" | InspoCategory;
type SortOption = "newest" | "most_saved" | "random";

type InspoPost = {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  quote?: string;
  category: InspoCategory;
  tags?: string[];
  source?: string; // Link to source
  sharedBy: string;
  timeAgo: string;
  saves?: number; // How many people saved this
  replies?: number;
  timestamp?: number;
  height?: number; // For masonry layout
};

type InspoReactions = Record<ReactionId, boolean>;

const CATEGORIES: InspoCategory[] = [
  "Art & Design",
  "Photography",
  "Fashion & Style",
  "Home & Spaces",
  "Nature",
  "Quotes & Words",
  "Recipes & Food",
  "Travel",
  "Other",
];

const INITIAL_POSTS: InspoPost[] = [
  {
    id: 1,
    title: "Golden hour in the mountains",
    description: "Saved this for those days when I need to remember there's beauty waiting",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    category: "Nature",
    tags: ["mountains", "sunset", "peaceful"],
    sharedBy: "S.",
    timeAgo: "2 hours ago",
    saves: 24,
    replies: 3,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    height: 400,
  },
  {
    id: 2,
    quote: "You're allowed to rest. You're allowed to take up space. You're allowed to be.",
    category: "Quotes & Words",
    sharedBy: "Anon",
    timeAgo: "5 hours ago",
    saves: 18,
    replies: 7,
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    height: 250,
  },
  {
    id: 3,
    title: "Cozy reading nook",
    description: "Dream corner for rainy afternoons",
    imageUrl: "https://images.unsplash.com/photo-1484581842645-42b8612c8f0d?w=600&h=900&fit=crop",
    category: "Home & Spaces",
    tags: ["cozy", "reading", "interior"],
    sharedBy: "M.",
    timeAgo: "1 day ago",
    saves: 31,
    replies: 2,
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    height: 500,
  },
  {
    id: 4,
    title: "Minimalist ceramics",
    description: "Something about simple shapes that just feels right",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop",
    category: "Art & Design",
    tags: ["ceramics", "minimalist", "art"],
    sharedBy: "K.",
    timeAgo: "2 days ago",
    saves: 15,
    replies: 1,
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    height: 350,
  },
  {
    id: 5,
    quote: "Small steps still get you somewhere. Progress is progress, even when it's quiet.",
    category: "Quotes & Words",
    sharedBy: "J.",
    timeAgo: "3 days ago",
    saves: 42,
    replies: 12,
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    height: 280,
  },
  {
    id: 6,
    title: "Wildflower meadow",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=700&fit=crop",
    category: "Nature",
    tags: ["wildflowers", "spring", "meadow"],
    sharedBy: "E.",
    timeAgo: "4 days ago",
    saves: 27,
    replies: 5,
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    height: 450,
  },
];

export default function InspoWall() {
  const [posts, setPosts] = useState<InspoPost[]>(INITIAL_POSTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    imageUrl: "",
    quote: "",
    category: "Other" as InspoCategory,
    tags: "",
    source: "",
  });

  const [userReactions, setUserReactions] = useState<Record<number, InspoReactions>>({});
  const [userSaves, setUserSaves] = useState<Record<number, boolean>>({});

  // Filter & sort
  let filteredPosts = posts;

  if (search.trim()) {
    filteredPosts = filteredPosts.filter((post) => {
      const searchableText = [
        post.title || "",
        post.description || "",
        post.quote || "",
        post.category,
        ...(post.tags || []),
      ].join(" ");
      return matchesSearch(searchableText, search);
    });
  }

  if (categoryFilter !== "All") {
    filteredPosts = filteredPosts.filter((post) => post.category === categoryFilter);
  }

  // Sort
  if (sortOption === "newest") {
    filteredPosts = [...filteredPosts].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } else if (sortOption === "most_saved") {
    filteredPosts = [...filteredPosts].sort((a, b) => (b.saves || 0) - (a.saves || 0));
  } else if (sortOption === "random") {
    filteredPosts = [...filteredPosts].sort(() => Math.random() - 0.5);
  }

  const handleAddPost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPost.imageUrl && !newPost.quote) return;

    setSubmitting(true);

    const post: InspoPost = {
      id: Date.now(),
      title: newPost.title || undefined,
      description: newPost.description || undefined,
      imageUrl: newPost.imageUrl || undefined,
      quote: newPost.quote || undefined,
      category: newPost.category,
      tags: newPost.tags ? newPost.tags.split(",").map((t) => t.trim()) : undefined,
      source: newPost.source || undefined,
      sharedBy: "You",
      timeAgo: "Just now",
      saves: 0,
      replies: 0,
      timestamp: Date.now(),
      height: Math.floor(Math.random() * 200) + 250,
    };

    setPosts([post, ...posts]);
    setNewPost({
      title: "",
      description: "",
      imageUrl: "",
      quote: "",
      category: "Other",
      tags: "",
      source: "",
    });
    setShowAddForm(false);
    setSubmitting(false);
  };

  const handleToggleSave = (postId: number) => {
    setUserSaves((prev) => {
      const newSaves = { ...prev, [postId]: !prev[postId] };

      // Update save count
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? { ...post, saves: (post.saves || 0) + (newSaves[postId] ? 1 : -1) }
            : post
        )
      );

      return newSaves;
    });
  };

  const handleReaction = (postId: number, reactionId: ReactionId) => {
    setUserReactions((prev) => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        [reactionId]: !(prev[postId]?.[reactionId] ?? false),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white border-b border-[color:var(--border-medium)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
                <span>✨</span>
                <span>Inspo Wall</span>
              </h1>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                Visual inspiration & saved sunshine
              </p>
            </div>
            <BouncyButton
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] text-[color:var(--text-primary)] px-4 py-2 rounded-lg font-medium text-sm shadow-[var(--shadow-soft)] transition-colors"
            >
              {showAddForm ? "Cancel" : "+ Add Inspo"}
            </BouncyButton>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="lg:w-64 flex-shrink-0">
            <CommunitySidebar
              filters={[
                {
                  title: "Category",
                  options: [
                    { label: "All", value: "All" },
                    ...CATEGORIES.map((cat) => ({ label: cat, value: cat })),
                  ],
                  activeValue: categoryFilter,
                  onChange: (value) => setCategoryFilter(value as CategoryFilter),
                },
              ]}
            />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* ADD POST FORM */}
            {showAddForm && (
              <div className="bg-white border border-[color:var(--border-medium)] rounded-xl p-6 mb-6 shadow-[var(--shadow-medium)]">
                <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mb-4">
                  Add New Inspiration
                </h3>
                <form onSubmit={handleAddPost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                      Title (optional)
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Give it a name..."
                      className="w-full px-3 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={newPost.imageUrl}
                        onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                        Category
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value as InspoCategory })}
                        className="w-full px-3 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)]"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                      Or share a quote
                    </label>
                    <textarea
                      value={newPost.quote}
                      onChange={(e) => setNewPost({ ...newPost, quote: e.target.value })}
                      placeholder="A quote that inspires you..."
                      rows={3}
                      className="w-full px-3 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      value={newPost.description}
                      onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                      placeholder="Why does this inspire you?"
                      rows={2}
                      className="w-full px-3 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                      Tags (comma separated, optional)
                    </label>
                    <input
                      type="text"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                      placeholder="cozy, peaceful, minimal"
                      className="w-full px-3 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (!newPost.imageUrl && !newPost.quote)}
                    className="w-full bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] disabled:bg-gray-200 disabled:text-gray-400 text-[color:var(--text-primary)] px-4 py-2.5 rounded-lg font-medium shadow-[var(--shadow-soft)] transition-colors"
                  >
                    {submitting ? "Adding..." : "Add to Inspo Wall"}
                  </button>
                </form>
              </div>
            )}

            {/* SEARCH & SORT BAR */}
            <div className="bg-white border border-[color:var(--border-medium)] rounded-xl p-4 mb-6 shadow-[var(--shadow-soft)]">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search inspiration..."
                  className="flex-1 px-4 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)]"
                />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="px-4 py-2 border border-[color:var(--border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)]"
                >
                  <option value="newest">Newest first</option>
                  <option value="most_saved">Most saved</option>
                  <option value="random">Surprise me</option>
                </select>
              </div>
            </div>

            {/* UNIFORM GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col bg-white border border-[color:var(--border-medium)] rounded-xl overflow-hidden shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)] transition-shadow group"
                >
                  {/* IMAGE */}
                  {post.imageUrl && (
                    <Link href={`/inspo-wall/${post.id}`} className="block">
                      <div className="aspect-square w-full overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title || "Inspiration"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  )}

                  {/* QUOTE */}
                  {post.quote && !post.imageUrl && (
                    <Link href={`/inspo-wall/${post.id}`} className="block aspect-square w-full bg-gradient-to-br from-[color:var(--sun-glow)] to-white flex items-center justify-center p-8">
                      <p className="text-lg font-serif italic text-[color:var(--text-primary)] leading-relaxed text-center">
                        "{post.quote}"
                      </p>
                    </Link>
                  )}

                  {/* CONTENT */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* TOP SECTION - Variable content */}
                    <div className="flex-1">
                      {post.title && (
                        <Link href={`/inspo-wall/${post.id}`}>
                          <h3 className="font-semibold text-[color:var(--text-primary)] mb-1 hover:text-[color:var(--honey-gold)] transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                      )}

                      {post.description && (
                        <p className="text-sm text-[color:var(--text-secondary)] mb-3 line-clamp-2">
                          {post.description}
                        </p>
                      )}

                      {/* TAGS */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gray-100 text-[color:var(--text-tertiary)] rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* BOTTOM SECTION - Fixed at bottom */}
                    <div className="mt-auto space-y-3">
                      {/* CATEGORY */}
                      <div className="flex items-center justify-between text-xs text-[color:var(--text-tertiary)]">
                      <span className="px-2 py-1 bg-[color:var(--sun-glow)] text-[color:var(--text-primary)] rounded-md font-medium">
                        {post.category}
                      </span>
                      <span>{post.timeAgo}</span>
                    </div>

                      {/* ACTIONS */}
                      <div className="flex items-center justify-between border-t border-[color:var(--border-soft)] pt-3">
                        <button
                          onClick={() => handleToggleSave(post.id)}
                          className={[
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            userSaves[post.id]
                              ? "bg-[color:var(--sunflower-gold)] text-[color:var(--text-primary)]"
                              : "bg-gray-100 text-[color:var(--text-secondary)] hover:bg-gray-200",
                          ].join(" ")}
                        >
                          <span>{userSaves[post.id] ? "✓" : "📌"}</span>
                          <span>{userSaves[post.id] ? "Saved" : "Save"}</span>
                          {(post.saves || 0) > 0 && (
                            <span className="text-xs opacity-75">({post.saves})</span>
                          )}
                        </button>

                        <Link
                          href={`/inspo-wall/${post.id}`}
                          className="text-sm text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors"
                        >
                          💬 {post.replies || 0}
                        </Link>
                      </div>

                      {/* REACTIONS */}
                      <div className="border-t border-[color:var(--border-soft)] pt-3">
                        <ReactionBar
                          availableReactions={["sunburst", "heart", "beautiful", "inspired", "savedThis"]}
                          userReactions={userReactions[post.id] || {}}
                          onReact={(reactionId) => handleReaction(post.id, reactionId)}
                        />
                      </div>

                      {/* SHARED BY */}
                      <div className="text-xs text-[color:var(--text-tertiary)]">
                        Shared by <span className="font-medium">{post.sharedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12 px-4">
                <p className="text-lg text-[color:var(--text-secondary)] mb-2">
                  No inspiration found
                </p>
                <p className="text-sm text-[color:var(--text-tertiary)]">
                  Try adjusting your filters or add something new
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
