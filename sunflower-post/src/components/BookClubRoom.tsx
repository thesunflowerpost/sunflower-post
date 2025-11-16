"use client";

import React, { useState, type FormEvent } from "react";
import { matchesSearch } from "@/lib/search";
import CommunitySidebar from "./CommunitySidebar";

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

  // local-only “My shelf”
  const [myShelf, setMyShelf] = useState<Record<number, boolean>>({});

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: BOOK CLUB CONTENT */}
        <div className="md:col-span-3 space-y-8">
          {/* HEADER */}
          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 md:max-w-xl">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960]">
                  Room
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-yellow-900">
                  Book Club
                </h1>
                <p className="text-xs md:text-sm text-[#5C4A33] max-w-xl">
                  A gentle book club for people who read slowly, re-read
                  favourite lines and sometimes just want to listen to others
                  talk about the book. No pressure to be ‘well read’.
                </p>
              </div>

              {/* SEARCH BAR – now sees books *and* discussion topics */}
              <div className="flex items-center gap-2 bg-white border border-yellow-100 rounded-full px-3 py-1 shadow-sm">
                <span>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, author, theme or discussion topic…"
                  className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:text-[#C0A987]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                onClick={() => {
                  setShowAddForm((s) => !s);
                  setAddError(null);
                }}
                className="px-3 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-sm"
              >
                {showAddForm ? "Close add book form" : "Add a book"}
              </button>
            </div>
          </section>

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

          {/* MAIN LAYOUT */}
          <section className="grid lg:grid-cols-3 gap-6 text-xs">
            {/* BOOK LIST */}
            <div className="lg:col-span-2 space-y-4">
              {/* FILTERS */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded-full border text-[11px] ${
                        statusFilter === status
                          ? "bg-yellow-100 border-yellow-200 text-[#5C4A33] font-medium"
                          : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <select
                  value={moodFilter}
                  onChange={(e) =>
                    setMoodFilter(e.target.value as MoodFilter)
                  }
                  className="border border-yellow-100 rounded-full px-2 py-1 bg-[#FFFEFA] text-[11px] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  {moodFilters.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </div>

              {/* BOOK CARDS */}
              <div className="space-y-3">
                {filteredBooks.length === 0 && (
                  <div className="bg-white border border-yellow-100 rounded-2xl p-4 text-[11px] text-[#7A674C]">
                    <p className="font-semibold text-yellow-900 mb-1">
                      No books or discussions match that (yet).
                    </p>
                    <p>
                      Try a different word or status… or add the book / topic you
                      were hoping to find. Someone else will probably be glad it&apos;s
                      here. 🌻
                    </p>
                  </div>
                )}

                {filteredBooks.map((book) => {
                  const shelf = !!myShelf[book.id];

                  return (
                    <article
                      key={book.id}
                      className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-3 hover:border-yellow-200 transition"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#A08960]">
                        <span
                          className={`px-2 py-[2px] rounded-full border ${statusBadge(
                            book.status
                          )}`}
                        >
                          {book.status}
                        </span>
                        <span>{book.timeAgo}</span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <div className="flex gap-3">
                          {/* COVER THUMBNAIL */}
                          <div className="w-14 h-20 md:w-16 md:h-24 rounded-lg overflow-hidden bg-[#FFF7D6] border border-yellow-100 flex items-center justify-center text-[10px] text-[#A08960]">
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

                          <div>
                            <h2 className="text-sm font-semibold text-yellow-900">
                              {book.title}
                            </h2>
                            <p className="text-[11px] text-[#7A674C]">
                              {book.author}
                            </p>
                            <p className="text-[11px] text-[#5C4A33] mt-1">
                              {book.mood}
                              {book.theme && <span> · {book.theme}</span>}
                              {book.format && <span> · {book.format}</span>}
                            </p>
                            {book.note && (
                              <p className="text-[11px] text-[#5C4A33] mt-1">
                                {book.note}
                              </p>
                            )}
                            {book.link && (
                              <a
                                href={book.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-[11px] text-[#7A674C] underline hover:text-yellow-900"
                              >
                                <span>View book</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleShelf(book.id)}
                          className={`px-3 py-1 h-fit rounded-full border text-[10px] flex items-center gap-1 ${
                            shelf
                              ? "bg-[#E0F2FE] border-[#BFDBFE] text-[#1D4ED8]"
                              : "bg-white border-yellow-100 text-[#7A674C] hover:bg-yellow-50"
                          }`}
                        >
                          <span>📖</span>
                          <span>
                            {shelf ? "On your shelf" : "Save to your shelf"}
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#7A674C]">
                        <span>
                          Shared by{" "}
                          {book.sharedBy ? (
                            <span>{book.sharedBy}</span>
                          ) : (
                            <span>Anon</span>
                          )}
                        </span>
                        <a
                          href={`/book-club/${book.id}`}
                          className="flex items-center gap-1 hover:text-yellow-900"
                        >
                          <span>💬</span>
                          <span>
                            {book.discussionCount === 0
                              ? "Start a discussion"
                              : `${book.discussionCount} discussion${
                                  book.discussionCount === 1 ? "" : "s"
                                }`}
                          </span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* SIDEBAR INFO */}
            <aside className="space-y-4">
              <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  How this Book Club works
                </p>
                <ul className="space-y-1 text-[#7A674C]">
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
                <p className="text-[#7A674C]">
                  You&apos;re welcome to disagree with a book or author, as long
                  as it&apos;s done with care. No shaming people for what they do or
                  don&apos;t read – this is a soft space.
                </p>
              </div>

              <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-yellow-900">
                  Stuck on what to add?
                </p>
                <ul className="space-y-1 text-[#7A674C]">
                  <li>• “A book I wish I had at 18…”</li>
                  <li>• “The book that made me feel less alone about X…”</li>
                  <li>• “A cosy, low-stakes read when your brain is tired…”</li>
                </ul>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
