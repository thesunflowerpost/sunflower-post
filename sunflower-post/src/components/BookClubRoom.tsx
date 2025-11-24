"use client";

import React, { useState, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";
import { ReactionBar } from "./ui";
import type { ReactionId } from "@/config/reactions";

type BookStatus = "Reading" | "Finished" | "To read";
type BookMood = string;

type StatusFilter = "All statuses" | BookStatus;
type MoodFilter = "All moods" | BookMood;

type BookItem = {
  id: number;
  title: string;
  author: string;
  status: BookStatus;
  mood: BookMood;
  theme?: string;
  format?: string;
  sharedBy: string;
  note?: string;
  timeAgo: string;
  coverUrl?: string;
  link?: string;
  discussionCount: number;
};

type BookTopicIndex = {
  bookId: number;
  title: string;
  body: string;
};

// Simple index of discussion topics so Book Club search can “see” them
const DISCUSSION_INDEX: BookTopicIndex[] = [
  {
    bookId: 1,
    title: "Opening chapter – redefining love (no spoilers)",
    body: "The way she breaks down the difference between care, affection and love made me realise how low my bar has been.",
  },
  {
    bookId: 1,
    title: "Strict households & this book",
    body: "Curious how people with religious / strict upbringings received this – freeing or confronting?",
  },
  {
    bookId: 2,
    title: "Spoiler: the ending + ‘personal legend’",
    body: "Did the way it wrapped up feel satisfying or a bit too neat?",
  },
];

const BASE_MOODS: BookMood[] = [
  "Soft self-help",
  "Fiction escape",
  "Heavy but healing",
  "Slow & thoughtful",
  "Short & snackable",
  "Other",
];

const INITIAL_BOOKS: BookItem[] = [
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
    discussionCount: 2,
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
    discussionCount: 1,
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
    discussionCount: 0,
  },
];

export default function BookClubRoom() {
  const [books, setBooks] = useState<BookItem[]>(INITIAL_BOOKS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All statuses");
  const [moodFilter, setMoodFilter] = useState<MoodFilter>("All moods");

  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [currentlyReadingExpanded, setCurrentlyReadingExpanded] = useState(true);
  const [guidelinesExpanded, setGuidelinesExpanded] = useState(true);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    status: "To read" as BookStatus,
    mood: "Fiction escape" as BookMood,
    theme: "",
    format: "",
    note: "",
    sharedBy: "",
    link: "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // local-only "My shelf"
  const [myShelf, setMyShelf] = useState<Record<number, boolean>>({});

  // Reactions state - per-book reactions for this viewer
  const [reactions, setReactions] = useState<Record<number, Record<ReactionId, boolean>>>({});

  const dynamicMoods = Array.from(
    new Set(books.map((b) => b.mood).filter(Boolean))
  ).filter((m) => !BASE_MOODS.includes(m));

  const moodFilters: MoodFilter[] = [
    "All moods",
    ...BASE_MOODS,
    ...dynamicMoods,
  ];

  const statusFilters: StatusFilter[] = [
    "All statuses",
    "Reading",
    "Finished",
    "To read",
  ];

  const filteredBooks = books.filter((book) => {
    const statusMatch =
      statusFilter === "All statuses" || book.status === statusFilter;
    if (!statusMatch) return false;

    const moodMatch =
      moodFilter === "All moods" || book.mood === moodFilter;
    if (!moodMatch) return false;

    if (!search.trim()) {
      return true;
    }

    const discussionTexts = DISCUSSION_INDEX.filter(
      (t) => t.bookId === book.id
    ).flatMap((t) => [t.title, t.body]);

    return matchesSearch(
      [
        book.title,
        book.author,
        book.mood,
        book.theme || "",
        book.format || "",
        book.note || "",
        book.sharedBy,
        book.status,
        ...discussionTexts, // <- this lets search “see” discussions too
      ],
      search
    );
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

  function handleAddBook(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null);

    const title = newBook.title.trim();
    const author = newBook.author.trim();
    if (!title || !author) return;

    const exists = books.some(
      (b) =>
        b.title.trim().toLowerCase() === title.toLowerCase() &&
        b.author.trim().toLowerCase() === author.toLowerCase()
    );

    if (exists) {
      setAddError(
        "This book is already in the room. You can always add your thoughts in the discussion instead. 🌻"
      );
      return;
    }

    setSubmitting(true);

    let generatedCoverUrl: string | undefined;
    if (coverFile) {
      generatedCoverUrl = URL.createObjectURL(coverFile);
    }

    const book: BookItem = {
      id: books.length + 1,
      title,
      author,
      status: newBook.status,
      mood: newBook.mood.trim() || "Other",
      theme: newBook.theme.trim() || undefined,
      format: newBook.format.trim() || undefined,
      note: newBook.note.trim() || undefined,
      sharedBy: newBook.sharedBy.trim() || "Anon",
      timeAgo: "Added just now",
      coverUrl: generatedCoverUrl,
      link: newBook.link.trim() || undefined,
      discussionCount: 0,
    };

    setBooks([book, ...books]);

    setNewBook({
      title: "",
      author: "",
      status: "To read",
      mood: "Fiction escape",
      theme: "",
      format: "",
      note: "",
      sharedBy: "",
      link: "",
    });
    setCoverFile(null);
    setCoverPreview(null);

    setSubmitting(false);
    setShowAddForm(false);
  }

  function toggleShelf(bookId: number) {
    setMyShelf((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setCoverFile(null);
      setCoverPreview(null);
      return;
    }
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  }

  function toggleReaction(bookId: number, reactionId: ReactionId, active: boolean) {
    setReactions((prev) => {
      const current = prev[bookId] || {};
      return {
        ...prev,
        [bookId]: {
          ...current,
          [reactionId]: active,
        },
      };
    });
  }

  function changeBookStatus(bookId: number, newStatus: BookStatus) {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, status: newStatus } : book
      )
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white border-b border-[color:var(--border-medium)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
                <span>📚</span>
                <span>Book Club</span>
              </h1>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                A gentle book club for people who read slowly, re-read favourite lines and sometimes just want to listen to others talk about the book. No pressure to be 'well read'.
              </p>
            </div>
            <button
              onClick={() => {
                setShowAddForm((s) => !s);
                setAddError(null);
              }}
              className="px-5 py-2.5 rounded-full bg-[#FFD52A] text-sm font-medium text-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-[#ffcc00] transition"
            >
              {showAddForm ? "Close" : "+ Add book"}
            </button>
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
                  title: "Status",
                  options: statusFilters.map((status) => ({
                    label: status,
                    value: status,
                  })),
                  activeValue: statusFilter,
                  onChange: (value) => setStatusFilter(value as StatusFilter),
                },
                {
                  title: "Mood / Vibe",
                  options: moodFilters.map((mood) => ({
                    label: mood,
                    value: mood,
                  })),
                  activeValue: moodFilter,
                  onChange: (value) => setMoodFilter(value as MoodFilter),
                },
              ]}
            />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* LEFT: MAIN CONTENT AREA */}
              <div className="flex-1">
            {/* SEARCH BAR */}
            <div className="mb-6">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author, theme..."
                className="w-full rounded-2xl bg-white border border-[#E5E5EA] px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD52A]/60"
              />
            </div>

            {/* HERO: CURRENTLY READING */}
            {books.filter((b) => b.status === "Reading").length > 0 && (
              <div className="bg-white border-2 border-yellow-200 rounded-2xl p-4 shadow-sm mb-6">
                <button
                  onClick={() => setCurrentlyReadingExpanded(!currentlyReadingExpanded)}
                  className="w-full flex items-center justify-between gap-2 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📖</span>
                    <h2 className="text-base font-semibold text-yellow-900">
                      Currently Reading
                    </h2>
                  </div>
                  <span className="text-yellow-900 text-lg">
                    {currentlyReadingExpanded ? "−" : "+"}
                  </span>
                </button>

                {currentlyReadingExpanded && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                    {books
                      .filter((b) => b.status === "Reading")
                      .slice(0, 5)
                      .map((book) => (
                        <a
                          key={book.id}
                          href={`/book-club/${book.id}`}
                          className="group bg-white border-2 border-yellow-100 rounded-2xl overflow-hidden hover:border-yellow-300 hover:shadow-md transition-all duration-200"
                        >
                          <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#FFF7D6] to-[#FFE4B5]">
                            {book.coverUrl ? (
                              <img
                                src={book.coverUrl}
                                alt={`Cover of ${book.title}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#A08960] text-center p-4">
                                Book cover
                              </div>
                            )}
                          </div>
                          <div className="p-2.5">
                            <h3 className="text-xs font-semibold text-yellow-900 mb-0.5 line-clamp-2 leading-tight group-hover:text-yellow-700 transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-[10px] text-[#7A674C] line-clamp-1">
                              {book.author}
                            </p>
                            {book.discussionCount > 0 && (
                              <p className="text-[9px] text-[#A08960] mt-1.5 flex items-center gap-1">
                                <span>💬</span>
                                <span>
                                  {book.discussionCount} discussion
                                  {book.discussionCount === 1 ? "" : "s"}
                                </span>
                              </p>
                            )}
                          </div>
                        </a>
                      ))}
                  </div>
                )}
              </div>
            )}

          {/* ADD BOOK FORM */}
          {showAddForm && (
            <section className="bg-white border border-yellow-100 rounded-2xl p-4 md:p-5 space-y-3 text-xs md:text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-yellow-900">
                  Add a book to the shelf 📚
                </p>
                <p className="text-[10px] text-[#A08960]">
                  No pressure for perfect blurbs – just enough so someone else
                  might think, “Oh, that&apos;s for me.”
                </p>
              </div>

              <form onSubmit={handleAddBook} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newBook.title}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. All About Love"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Author
                    </label>
                    <input
                      type="text"
                      value={newBook.author}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. bell hooks"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Status
                    </label>
                    <select
                      value={newBook.status}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          status: e.target.value as BookStatus,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      <option value="Reading">Reading</option>
                      <option value="Finished">Finished</option>
                      <option value="To read">To read</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Mood / vibe
                    </label>
                    <input
                      type="text"
                      value={newBook.mood}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          mood: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Soft self-help, Heavy but healing"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Theme (optional)
                    </label>
                    <input
                      type="text"
                      value={newBook.theme}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          theme: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="e.g. Love, Grief, Belonging"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Format (optional)
                    </label>
                    <input
                      type="text"
                      value={newBook.format}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          format: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="Physical, Kindle, Audiobook…"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Why this book? (optional)
                    </label>
                    <textarea
                      value={newBook.note}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="A sentence or two about who it might help, or when you’d reach for it."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Book link (optional)
                    </label>
                    <input
                      type="url"
                      value={newBook.link}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          link: e.target.value,
                        }))
                      }
                      className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="Amazon, Waterstones, Goodreads, publisher page…"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5C4A33]">
                      Upload cover image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="w-full text-[11px]"
                    />
                    {coverPreview && (
                      <div className="mt-2 w-16 h-24 rounded-md overflow-hidden border border-yellow-100 bg-[#FFF7D6]">
                        <img
                          src={coverPreview}
                          alt="Selected cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-[10px] text-[#A08960]">
                      Right now covers are stored in your browser only. For real
                      uploads, we&apos;ll plug in storage later.
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#5C4A33]">
                    Your name (or initial)
                  </label>
                  <input
                    type="text"
                    value={newBook.sharedBy}
                    onChange={(e) =>
                      setNewBook((prev) => ({
                        ...prev,
                        sharedBy: e.target.value,
                      }))
                    }
                    className="w-full border border-yellow-100 rounded-xl px-3 py-2 text-xs bg-[#FFFEFA] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    placeholder="Leave blank to show as Anon"
                  />
                </div>

                {addError && (
                  <p className="text-[11px] text-[#B45309] bg-[#FFF7ED] border border-[#FED7AA] rounded-xl px-3 py-2">
                    {addError}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !newBook.title.trim() ||
                      !newBook.author.trim()
                    }
                    className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#3A2E1F] text-xs font-semibold shadow-sm"
                  >
                    {submitting ? "Adding…" : "Add to Book Club"}
                  </button>
                  <p className="text-[10px] text-[#A08960]">
                    If it&apos;s already here, the room will nudge you instead of
                    duplicating it.
                  </p>
                </div>
              </form>
            </section>
          )}

          {/* PINTEREST-STYLE GRID */}
          <section className="space-y-6">
            {/* NO RESULTS */}
            {filteredBooks.length === 0 && (
              <div className="bg-white border border-yellow-100 rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  No books or discussions match that (yet).
                </p>
                <p className="text-xs text-[#7A674C]">
                  Try a different word or status… or add the book / topic you
                  were hoping to find. Someone else will probably be glad it&apos;s
                  here. 🌻
                </p>
              </div>
            )}

            {/* BOOK GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
              {filteredBooks.map((book) => {
                const shelf = !!myShelf[book.id];
                const bookReactions = reactions[book.id] || {};

                return (
                  <div
                    key={book.id}
                    className="flex flex-col bg-white border-2 border-yellow-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-yellow-300 transition-all duration-200 group max-w-[560px] w-full mx-auto"
                  >
                    {/* BOOK COVER */}
                    <a
                      href={`/book-club/${book.id}`}
                      className="block relative"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#FFF7D6] to-[#FFE4B5]">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={`Cover of ${book.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#A08960] text-center p-4">
                            Book cover
                          </div>
                        )}
                      </div>

                      {/* STATUS BADGE OVERLAY */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-1 rounded-full border text-[9px] font-semibold shadow-md ${statusBadge(
                            book.status
                          )}`}
                        >
                          {book.status === "Reading" && "📖 "}
                          {book.status === "Finished" && "✅ "}
                          {book.status === "To read" && "🔖 "}
                          {book.status}
                        </span>
                      </div>
                    </a>

                    {/* CONTENT */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* TOP SECTION */}
                      <div className="flex-1 min-h-0 mb-4">
                        <a href={`/book-club/${book.id}`}>
                          <h3 className="text-base font-bold text-yellow-900 mb-2 hover:text-yellow-700 transition-colors line-clamp-2 leading-snug">
                            {book.title}
                          </h3>
                        </a>
                        <p className="text-sm text-[#7A674C] mb-3 line-clamp-1">
                          {book.author}
                        </p>

                        {/* MOOD BADGE */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="text-xs px-3 py-1 bg-gradient-to-br from-amber-50 to-yellow-50 border border-yellow-200 text-yellow-900 rounded-full font-medium inline-flex items-center">
                            {book.mood}
                          </span>
                        </div>

                        {/* ONE-LINER DESCRIPTION */}
                        {book.note && (
                          <p className="text-xs text-[#5C4A33] leading-relaxed line-clamp-3 mb-3 italic">
                            "{book.note}"
                          </p>
                        )}
                      </div>

                      {/* BOTTOM SECTION - Fixed at bottom */}
                      <div className="mt-auto space-y-3">
                        {/* STATUS CHANGE + SHELF BUTTON */}
                        <div className="flex gap-2">
                          <select
                            value={book.status}
                            onChange={(e) =>
                              changeBookStatus(book.id, e.target.value as BookStatus)
                            }
                            className="flex-1 text-xs px-3 py-2 rounded-lg border border-yellow-200 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                            title="Change reading status"
                          >
                            <option value="To read">🔖 To read</option>
                            <option value="Reading">📖 Reading</option>
                            <option value="Finished">✅ Finished</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => toggleShelf(book.id)}
                            className={`px-3 py-2 rounded-lg border text-xs transition-all ${
                              shelf
                                ? "bg-[#E0F2FE] border-[#BFDBFE] text-[#1D4ED8] shadow-sm"
                                : "bg-white border-yellow-200 text-[#7A674C] hover:bg-yellow-50"
                            }`}
                            title={shelf ? "On your shelf" : "Save to shelf"}
                          >
                            📚
                          </button>
                        </div>

                        {/* REACTIONS */}
                        <div className="pt-2 border-t border-yellow-100">
                          <ReactionBar
                            roomId="bookClub"
                            postId={book.id}
                            reactions={bookReactions}
                            onReactionToggle={(reactionId, active) =>
                              toggleReaction(book.id, reactionId, active)
                            }
                          />
                        </div>

                        {/* DISCUSSION LINK */}
                        <a
                          href={`/book-club/${book.id}`}
                          className="block text-center px-4 py-2.5 bg-[#FFD52A] hover:bg-[#ffcc00] rounded-full text-xs font-medium text-[#111111] transition-all shadow-sm"
                        >
                          {book.discussionCount === 0
                            ? "Start a discussion 💬"
                            : `${book.discussionCount} discussion${
                                book.discussionCount === 1 ? "" : "s"
                              } 💬`}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
              </div>

              {/* RIGHT: GUIDELINES SIDEBAR */}
              <aside className="lg:w-48 flex-shrink-0">
                <div className="space-y-4 sticky top-20">
                  {/* Collapsible Header */}
                  <button
                    onClick={() => setGuidelinesExpanded(!guidelinesExpanded)}
                    className="w-full bg-[#FFD52A] hover:bg-[#ffcc00] rounded-full px-4 py-2.5 flex items-center justify-between transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                  >
                    <span className="text-sm font-medium text-[#111111]">
                      Guidelines
                    </span>
                    <span className="text-[#111111] text-base font-semibold">
                      {guidelinesExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {guidelinesExpanded && (
                    <>
                  <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                    <p className="text-[11px] font-semibold text-yellow-900">
                      How this Book Club works
                    </p>
                    <ul className="space-y-1 text-[10px] text-[#7A674C]">
                      <li>• Add books that genuinely moved you or held you</li>
                      <li>• Tag the mood so people can find what fits their season</li>
                      <li>• Use discussion pages for chapters, quotes &amp; themes</li>
                      <li>• Read at your own pace – lurking is also participation</li>
                    </ul>
                  </div>

                  <div className="bg-[#FFFCF5] border border-yellow-100 rounded-2xl p-4 space-y-2">
                    <p className="text-[11px] font-semibold text-yellow-900">
                      Gentle boundaries
                    </p>
                    <p className="text-[10px] text-[#7A674C]">
                      You&apos;re welcome to disagree with a book or author, as long
                      as it&apos;s done with care. No shaming people for what they do or
                      don&apos;t read – this is a soft space.
                    </p>
                  </div>

                  <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                    <p className="text-[11px] font-semibold text-yellow-900">
                      Stuck on what to add?
                    </p>
                    <ul className="space-y-1 text-[10px] text-[#7A674C]">
                      <li>• "A book I wish I had at 18…"</li>
                      <li>• "The book that made me feel less alone about X…"</li>
                      <li>• "A cosy, low-stakes read when your brain is tired…"</li>
                    </ul>
                  </div>
                    </>
                  )}
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
