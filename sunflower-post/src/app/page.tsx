import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* HERO SECTION - Magazine-style with full-width image */}
      <section className="relative w-full h-[360px] md:h-[420px] overflow-hidden rounded-b-3xl shadow-[var(--shadow-medium)]">
        {/* Hero Image Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--sunflower-gold)]/60 via-[color:var(--honey-gold)]/40 to-[color:var(--sun-glow)]/70">
          {/* Placeholder for hero image - replace with actual image */}
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,_var(--sunflower-gold)_0,_transparent_50%)]" />
        </div>

        {/* Soft gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--deep-soil)]/80 via-[color:var(--deep-soil)]/20 to-transparent" />

        {/* Hero Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-6 md:pb-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-block px-3 py-1.5 rounded-full bg-[color:var(--sunflower-gold)]/90 backdrop-blur-sm border border-[color:var(--honey-gold)]">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--deep-soil)] font-semibold">
                A softer corner of the internet
              </p>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl lg:text-4xl font-normal text-white leading-tight">
              Good news still exists.
              <br />
              You just needed a room to find it.
            </h1>
            <p className="text-xs md:text-sm text-white/90 max-w-xl leading-relaxed">
              The Sunflower Post is a joy-first community and journal space where
              people share small joys, kind ideas and real solutions for a kinder
              world – outside the noise of social media.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] text-[10px] font-semibold text-[color:var(--deep-soil)] shadow-[var(--shadow-medium)] transition-all hover:shadow-[var(--shadow-large)] hover:scale-105"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm text-[10px] font-semibold text-white hover:bg-white/20 transition-all"
              >
                Login
              </Link>
              <Link
                href="/journal"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/60 text-[10px] font-medium text-white hover:bg-white/10 transition-all"
              >
                Read The Journal
              </Link>
            </div>

            <p className="text-[10px] text-white/80 pt-0.5">
              No algorithms. No doomscrolling. Just letters, laughter and light.
            </p>
          </div>
        </div>
      </section>

      <div className="px-4 py-8 md:py-12 space-y-10 md:space-y-14">
        {/* THIS WEEK'S SUNFLOWER POST */}
        <section className="max-w-4xl">
          <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border-2 border-[color:var(--sunflower-gold)]/20 rounded-3xl p-6 md:p-8 space-y-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--sunflower-gold)]/10 border border-[color:var(--sunflower-gold)]/30">
              <span className="text-lg">💌</span>
              <p className="text-xs font-semibold text-[color:var(--deep-soil)] uppercase tracking-wide">
                This Week&apos;s Sunflower Post
              </p>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-normal text-[color:var(--text-warm-dark)] leading-snug">
              Twelve tiny joys that don&apos;t depend on your productivity levels.
            </h2>
            <p className="text-sm md:text-base text-[color:var(--text-warm-medium)] leading-relaxed max-w-2xl">
              A gentle list of everyday moments you&apos;re still allowed to enjoy,
              even when you&apos;re tired, behind or figuring things out.
            </p>
            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] text-xs font-semibold text-[color:var(--deep-soil)] shadow-[var(--shadow-gentle)] transition-all hover:shadow-[var(--shadow-soft)] hover:scale-105">
              Preview the bulletin →
            </button>
          </div>
        </section>

        {/* WHAT'S BLOOMING THIS WEEK - Featured Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-normal text-[color:var(--deep-soil)]">
              What&apos;s Blooming This Week 🌻
            </h2>
            <p className="text-sm text-[color:var(--text-warm-light)]">
              Highlights from across the Circle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Featured Journal */}
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02] group">
              {/* Image */}
              <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&h=400&fit=crop"
                  alt="Journal"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-slate-700 text-slate-50 shadow-md">
                    Long Read
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-semibold text-[color:var(--text-warm-dark)] ring-2 ring-white shadow-sm">
                    E
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-[color:var(--text-warm-light)]">
                    <span className="font-semibold">Emma R.</span>
                    <span>•</span>
                    <span>12 min read</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-[color:var(--deep-soil)] group-hover:text-[color:var(--deep-soil)]/80 transition-colors leading-snug">
                  On feeling invisible in a loud world
                </h3>
                <p className="text-[11px] text-[color:var(--text-warm-light)] leading-relaxed">
                  A gentle piece on being present, even when you don&apos;t feel seen.
                </p>
                <div className="pt-1 text-[10px] text-[color:var(--text-warm-lighter)]">
                  💬 24 comments
                </div>
              </div>
            </div>

            {/* Featured Book Club */}
            <div className="bg-gradient-to-br from-white to-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02] group">
              {/* Book Cover Image */}
              <div className="relative h-40 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop"
                  alt="Book"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-blue-900 text-blue-50 shadow-md">
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
        <section className="space-y-5 text-xs md:text-sm">
          <h2 className="font-[family-name:var(--font-display)] text-base md:text-lg font-normal text-[color:var(--deep-soil)]">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-[color:var(--border-soft)] rounded-2xl p-4 space-y-2 hover:shadow-[var(--shadow-soft)] transition-shadow">
              <p className="text-xs font-semibold text-[color:var(--text-warm-dark)]">1. Join</p>
              <p className="text-[color:var(--text-warm-medium)] leading-relaxed">
                Enter the Circle, create a gentle profile, choose a few interests,
                and we&apos;ll show you rooms that feel like home.
              </p>
            </div>
            <div className="bg-white border border-[color:var(--border-soft)] rounded-2xl p-4 space-y-2 hover:shadow-[var(--shadow-soft)] transition-shadow">
              <p className="text-xs font-semibold text-[color:var(--text-warm-dark)]">2. Share</p>
              <p className="text-[color:var(--text-warm-medium)] leading-relaxed">
                Plant sunflowers: post small joys, ask for a pick-me-up, join
                book chats or explore the Pinterest-style wall of inspiration.
              </p>
            </div>
            <div className="bg-white border border-[color:var(--border-soft)] rounded-2xl p-4 space-y-2 hover:shadow-[var(--shadow-soft)] transition-shadow">
              <p className="text-xs font-semibold text-[color:var(--text-warm-dark)]">3. Contribute</p>
              <p className="text-[color:var(--text-warm-medium)] leading-relaxed">
                Take part in Solution Rooms and Speak Up sessions that feed into
                annual Sunflower Reports.
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section
          id="join-circle"
          className="mt-4 bg-white border border-[color:var(--border-soft)] rounded-3xl p-6 md:p-8 space-y-4 text-xs md:text-sm hover:shadow-[var(--shadow-medium)] transition-shadow"
        >
          <h2 className="font-[family-name:var(--font-display)] text-base md:text-xl font-normal text-[color:var(--deep-soil)]">
            Ready for a different kind of internet?
          </h2>
          <p className="text-[color:var(--text-warm-medium)] max-w-2xl leading-relaxed">
            Join the waitlist for the first cohort of Sunflower Circle members
            and help us shape this space from the ground up.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] text-xs font-semibold text-[color:var(--deep-soil)] shadow-[var(--shadow-gentle)] transition-all hover:shadow-[var(--shadow-soft)] hover:scale-105">
              Join the waitlist
            </button>
            <p className="text-[11px] text-[color:var(--text-warm-light)]">
              No spam. Just the occasional ray of sunshine.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
