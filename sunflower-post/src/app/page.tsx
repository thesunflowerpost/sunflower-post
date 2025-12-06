import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* HERO SECTION - Clean & Modern */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <span className="text-2xl">🌻</span>
                <span>A softer corner of the internet</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Good news still exists.
                <br />
                You just needed a room to find it.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                The Sunflower Post is a joy-first community and journal space where
                people share small joys, kind ideas and real solutions for a kinder world.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-base font-semibold text-gray-900 transition-colors"
              >
                Get started
              </Link>
              <Link
                href="/journal"
                className="px-6 py-3 rounded-lg bg-white border border-gray-300 hover:border-gray-400 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Read the journal
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              No algorithms. No doomscrolling. Just letters, laughter and light.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
          {/* THIS WEEK'S SUNFLOWER POST */}
          <section>
            <div className="bg-white rounded-xl p-8 md:p-10 space-y-6 border border-gray-200 max-w-3xl">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xl">💌</span>
                <span className="font-medium">This Week's Post</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Twelve tiny joys that don&apos;t depend on your productivity levels
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                A gentle list of everyday moments you&apos;re still allowed to enjoy,
                even when you&apos;re tired, behind or figuring things out.
              </p>
              <button className="px-6 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-sm font-semibold text-white transition-colors">
                Read more →
              </button>
            </div>
          </section>

        {/* WHAT'S BLOOMING THIS WEEK - Featured Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              What&apos;s Blooming This Week
            </h2>
            <p className="text-base text-gray-600">
              Highlights from across the community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Journal */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all group">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&h=400&fit=crop"
                  alt="Journal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                    Long Read
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Emma R.</span>
                  <span>·</span>
                  <span>12 min read</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                  On feeling invisible in a loud world
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  A gentle piece on being present, even when you don&apos;t feel seen.
                </p>
                <div className="pt-2 text-sm text-gray-500">
                  💬 24 comments
                </div>
              </div>
            </div>

            {/* Featured Book Club */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all group">
              {/* Book Cover Image */}
              <div className="relative h-40 bg-gradient-to-br from-sky-50 to-blue-50 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop"
                  alt="Book"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-sky-600 text-white shadow-md">
                    Now Reading
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center text-[10px] font-semibold text-[color:var(--text-warm-dark)] ring-2 ring-white shadow-sm">
                    S
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Sofia</span>
                    <span>•</span>
                    <span>Chapter 5</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                  The Power of Now
                </h3>
                <p className="text-[11px] text-[color:var(--text-warm-light)] leading-relaxed">
                  Join the discussion on presence and mindfulness.
                </p>
                <div className="pt-1 text-[10px] text-[color:var(--text-warm-lighter)]">
                  💬 15 members discussing
                </div>
              </div>
            </div>

            {/* Featured Music */}
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02] group">
              {/* Album Art Image */}
              <div className="relative h-40 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=400&fit=crop"
                  alt="Music"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-purple-900 text-purple-50 shadow-md">
                    Playlist
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-200 to-violet-300 flex items-center justify-center text-[10px] font-semibold text-[color:var(--text-warm-dark)] ring-2 ring-white shadow-sm">
                    M
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Maya</span>
                    <span>•</span>
                    <span>8 tracks</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                  Diaspora Sounds
                </h3>
                <p className="text-[11px] text-[color:var(--text-warm-light)] leading-relaxed">
                  Songs that connect us to our roots and journeys.
                </p>
                <div className="pt-1 text-[10px] text-[color:var(--text-warm-lighter)]">
                  🎧 12 listens this week
                </div>
              </div>
            </div>

            {/* Featured Guide */}
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02] group">
              {/* Guide Image */}
              <div className="relative h-40 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop"
                  alt="Guide"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-green-900 text-green-50 shadow-md">
                    New Resource
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center text-[10px] font-semibold text-[color:var(--text-warm-dark)] ring-2 ring-white shadow-sm">
                    A
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Aisha</span>
                    <span>•</span>
                    <span>Toolkit</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                  Mental Health Kit for Parents
                </h3>
                <p className="text-[11px] text-[color:var(--text-warm-light)] leading-relaxed">
                  Practical resources for supporting your child&apos;s wellbeing.
                </p>
                <div className="pt-1 text-[10px] text-[color:var(--text-warm-lighter)]">
                  📚 8 resources
                </div>
              </div>
            </div>

            {/* Featured Lounge Post */}
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02] group md:col-span-2 lg:col-span-1">
              {/* Post Image */}
              <div className="relative h-40 bg-gradient-to-br from-yellow-100 to-amber-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop"
                  alt="Lounge post"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-red-500 text-white shadow-md">
                    🔥 Trending
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-200 to-amber-300 flex items-center justify-center text-[10px] font-semibold text-[color:var(--text-warm-dark)] ring-2 ring-white shadow-sm">
                    D
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Dani</span>
                    <span>•</span>
                    <span>2h ago</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                  My neighbor brought me soup today
                </h3>
                <p className="text-[11px] text-[color:var(--text-warm-light)] leading-relaxed">
                  Small acts of kindness that restore faith in humanity.
                </p>
                <div className="pt-1 text-[10px] text-[color:var(--text-warm-lighter)]">
                  💛 47 reactions • 💬 23 comments
                </div>
              </div>
            </div>
          </div>
        </section>

                {/* THE JOURNAL - Editorial articles and stories */}
        <section id="journal" className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-normal text-[color:var(--deep-soil)]">
              The Journal 📝
            </h2>
            <p className="text-sm md:text-base text-[color:var(--text-warm-medium)] max-w-3xl leading-relaxed">
              Stories, insights, and reflections from our community. The real work of healing, growing, and showing up.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Featured Article 1 */}
            <Link href="/journal/finding-light-in-small-moments" className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02] group">
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=400&fit=crop"
                  alt="Finding Light in Small Moments"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-700 text-green-50 shadow-md">
                    Self-Care • 4 min
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-lg ring-2 ring-white shadow-sm">
                    🌻
                  </div>
                  <div className="text-[10px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">The Sunflower Team</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                  Finding Light in Small Moments
                </h3>
                <p className="text-xs text-[color:var(--text-warm-light)] leading-relaxed">
                  When everything feels heavy, the smallest victories become our greatest teachers.
                </p>
              </div>
            </Link>

            {/* Featured Article 2 */}
            <Link href="/journal/when-healing-isnt-linear" className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02] group">
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop"
                  alt="When Healing Isn't Linear"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-700 text-blue-50 shadow-md">
                    Mental Health • 5 min
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-lg ring-2 ring-white shadow-sm">
                    🌻
                  </div>
                  <div className="text-[10px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">The Sunflower Team</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                  When Healing Isn&apos;t Linear
                </h3>
                <p className="text-xs text-[color:var(--text-warm-light)] leading-relaxed">
                  Progress isn&apos;t always forward. Sometimes it&apos;s sideways, backwards, or just standing still.
                </p>
              </div>
            </Link>

            {/* Featured Article 3 */}
            <Link href="/journal/community-story-sarahs-journey" className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02] group">
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop"
                  alt="Community Story"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-purple-700 text-purple-50 shadow-md">
                    Community Stories • 5 min
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-lg ring-2 ring-white shadow-sm">
                    🌸
                  </div>
                  <div className="text-[10px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Sarah (Community Member)</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                  How I Found My People
                </h3>
                <p className="text-xs text-[color:var(--text-warm-light)] leading-relaxed">
                  A member shares their journey from isolation to connection.
                </p>
              </div>
            </Link>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/journal"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] text-xs font-semibold text-[color:var(--deep-soil)] shadow-[var(--shadow-gentle)] transition-all hover:shadow-[var(--shadow-soft)] hover:scale-105"
            >
              View All Articles →
            </Link>
          </div>
        </section>

        {/* WHAT'S HAPPENING IN THE COMMUNITY */}
        <section className="space-y-6 max-w-3xl">
          <div className="space-y-2">
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-normal text-[color:var(--deep-soil)]">
              What&apos;s Happening in the Community
            </h2>
            <p className="text-sm md:text-base text-[color:var(--text-warm-light)]">
              Real conversations, happening right now
            </p>
          </div>

          <div className="space-y-3">
            {/* Trending Post 1 */}
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl p-4 hover:shadow-[var(--shadow-medium)] transition-all hover:border-[color:var(--border-soft)] group">
              <div className="flex items-start gap-3">
                {/* Author Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-200 to-amber-300 flex items-center justify-center text-xs font-semibold text-[color:var(--text-warm-dark)] shadow-md flex-shrink-0 ring-2 ring-white">
                  D
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Dani</span>
                    <span>•</span>
                    <span>🌻 The Lounge</span>
                    <span>•</span>
                    <span>2 hours ago</span>
                  </div>
                  <h3 className="text-xs font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                    "Small joy: My neighbor brought me soup when I was feeling down"
                  </h3>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-warm-lighter)]">
                      <span>💛 47 reactions</span>
                      <span>•</span>
                      <span>💬 23 comments</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-semibold bg-pink-100 text-pink-700 shadow-sm">
                      ⭐ Most heartwarming
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Post 2 */}
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl p-4 hover:shadow-[var(--shadow-medium)] transition-all hover:border-[color:var(--border-soft)] group">
              <div className="flex items-start gap-3">
                {/* Author Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center text-xs font-semibold text-[color:var(--text-warm-dark)] shadow-md flex-shrink-0 ring-2 ring-white">
                  S
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Sofia</span>
                    <span>•</span>
                    <span>📚 Book Club</span>
                    <span>•</span>
                    <span>5 hours ago</span>
                  </div>
                  <h3 className="text-xs font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                    "Chapter 3 discussion: The comfort zone myth"
                  </h3>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-warm-lighter)]">
                      <span>💛 34 reactions</span>
                      <span>•</span>
                      <span>💬 18 comments</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-semibold bg-blue-100 text-blue-700 shadow-sm">
                      💬 Most discussed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Post 3 */}
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl p-4 hover:shadow-[var(--shadow-medium)] transition-all hover:border-[color:var(--border-soft)] group">
              <div className="flex items-start gap-3">
                {/* Author Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center text-xs font-semibold text-[color:var(--text-warm-dark)] shadow-md flex-shrink-0 ring-2 ring-white">
                  A
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Aisha</span>
                    <span>•</span>
                    <span>🧩 Solution Room</span>
                    <span>•</span>
                    <span>1 day ago</span>
                  </div>
                  <h3 className="text-xs font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                    "New SEND resource collaborative document"
                  </h3>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-warm-lighter)]">
                      <span>💛 28 reactions</span>
                      <span>•</span>
                      <span>💬 12 comments</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-semibold bg-orange-100 text-orange-700 shadow-sm">
                      🚀 Trending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button className="text-xs font-semibold text-[color:var(--deep-soil)] hover:text-[color:var(--deep-soil)]/80 underline decoration-dotted underline-offset-4">
              View all activity →
            </button>
          </div>
        </section>

        {/* INSIDE THE CIRCLE */}
        <section id="inside-circle" className="space-y-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-normal text-[color:var(--deep-soil)]">
            Inside the Circle
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 text-xs">
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl p-5 space-y-2 hover:shadow-[var(--shadow-soft)] transition-shadow">
              <p className="font-[family-name:var(--font-display)] text-sm font-normal text-[color:var(--text-warm-dark)]">🌻 The Lounge</p>
              <p className="text-[color:var(--text-warm-light)] leading-relaxed">
                Daily check-ins, small joys, soft rants and gentle company.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl p-5 space-y-2 hover:shadow-[var(--shadow-soft)] transition-shadow">
              <p className="font-[family-name:var(--font-display)] text-sm font-normal text-[color:var(--text-warm-dark)]">📚 Book Club</p>
              <p className="text-[color:var(--text-warm-light)] leading-relaxed">
                Read together, chapter by chapter. From comfort reads to
                big-thinking.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl p-5 space-y-2 hover:shadow-[var(--shadow-soft)] transition-shadow">
              <p className="font-[family-name:var(--font-display)] text-sm font-normal text-[color:var(--text-warm-dark)]">🎧 Music Room</p>
              <p className="text-[color:var(--text-warm-light)] leading-relaxed">
                Nostalgic tracks, diaspora sounds and songs that carried you.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl p-5 space-y-2 hover:shadow-[var(--shadow-soft)] transition-shadow">
              <p className="font-[family-name:var(--font-display)] text-sm font-normal text-[color:var(--text-warm-dark)]">🧩 Solution Rooms</p>
              <p className="text-[color:var(--text-warm-light)] leading-relaxed">
                Co-create ideas on topics like SEND &amp; AI, mental health and
                diaspora futures.
              </p>
            </div>
          </div>
        </section>

        {/* FOR WHO + WHAT IS IT */}
        <section className="grid md:grid-cols-2 gap-8 md:gap-10 text-xs md:text-sm">
          <div className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-base md:text-lg font-normal text-[color:var(--deep-soil)]">
              For who?
            </h2>
            <p className="text-[color:var(--text-warm-medium)] leading-relaxed">
              For sensitive souls, overthinkers, community builders and quiet
              optimists who still believe we can do better.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-base md:text-lg font-normal text-[color:var(--deep-soil)]">
              What is The Sunflower Post?
            </h2>
            <p className="text-[color:var(--text-warm-medium)] leading-relaxed">
              A hybrid of a modern magazine, a gentle forum and a solution-space
              for people who care.
            </p>
            <p className="text-[color:var(--text-warm-medium)] leading-relaxed">
              We bring together journals, discussion rooms and real-world meetups
              so you can connect with others, feel less alone, and contribute to
              ideas that might actually change things.
            </p>
            <p className="text-[color:var(--text-warm-medium)] leading-relaxed">
              Think: slow internet, but with structure. A place where your small
              joys matter as much as your big ideas.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#254331] rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center text-xl font-bold text-gray-900">
                1
              </div>
              <h3 className="text-lg font-semibold text-white">Join</h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Enter the Circle, create a gentle profile, choose a few interests,
                and we&apos;ll show you rooms that feel like home.
              </p>
            </div>
            <div className="bg-[#254331] rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center text-xl font-bold text-gray-900">
                2
              </div>
              <h3 className="text-lg font-semibold text-white">Share</h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Plant sunflowers: post small joys, ask for a pick-me-up, join
                book chats or explore the Pinterest-style wall of inspiration.
              </p>
            </div>
            <div className="bg-[#254331] rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center text-xl font-bold text-gray-900">
                3
              </div>
              <h3 className="text-lg font-semibold text-white">Contribute</h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Take part in Solution Rooms and Speak Up sessions that feed into
                annual Sunflower Reports.
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="bg-white rounded-xl p-8 md:p-12 space-y-6 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Ready for a different kind of internet?
          </h2>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Join the waitlist for the first cohort of Sunflower Circle members
            and help us shape this space from the ground up.
          </p>
          <div>
            <button className="px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-base font-semibold text-gray-900 transition-colors">
              Join the waitlist
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
