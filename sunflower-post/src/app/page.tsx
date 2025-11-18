export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* HERO SECTION - Magazine-style with full-width image */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-b-3xl">
        {/* Hero Image Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100">
          {/* Placeholder for hero image - replace with actual image */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,_#FFE27A_0,_transparent_50%)]" />
        </div>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Hero Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8 md:pb-12">
          <div className="max-w-2xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-yellow-200">
              A softer corner of the internet
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Good news still exists.
              <br />
              You just needed a room to find it.
            </h1>
            <p className="text-sm md:text-base text-white/90 max-w-xl">
              The Sunflower Post is a joy-first community and journal space where
              people share small joys, kind ideas and real solutions for a kinder
              world – outside the noise of social media.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#join-circle"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-xs font-semibold text-[#3A2E1F] shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                Join the Sunflower Circle
              </a>
              <a
                href="#journals"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm text-xs font-semibold text-white hover:bg-white/20 transition-all"
              >
                Read the latest journal
              </a>
            </div>

            <p className="text-[11px] text-white/80 pt-1">
              No algorithms. No doomscrolling. Just letters, laughter and light.
            </p>
          </div>
        </div>
      </section>

      <div className="px-4 py-10 md:py-14 space-y-10 md:space-y-14">
        {/* THIS WEEK'S SUNFLOWER POST */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-white border border-yellow-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-yellow-900 uppercase tracking-wide">
              This Week&apos;s Sunflower Post 💌
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-[#3A2E1F]">
              Twelve tiny joys that don&apos;t depend on your productivity levels.
            </h2>
            <p className="text-sm md:text-base text-[#5C4A33] leading-relaxed">
              A gentle list of everyday moments you&apos;re still allowed to enjoy,
              even when you&apos;re tired, behind or figuring things out.
            </p>
            <button className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-xs font-semibold text-[#3A2E1F] shadow-sm transition-all hover:shadow-md hover:scale-105">
              Preview the bulletin →
            </button>
          </div>
        </section>

        {/* WHAT'S BLOOMING THIS WEEK - Featured Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-yellow-900">
              What&apos;s Blooming This Week 🌻
            </h2>
            <p className="text-sm text-[#7A674C]">
              Highlights from across the Circle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Featured Journal */}
            <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
              <div className="relative h-40 bg-gradient-to-br from-amber-100 to-orange-100">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#FFE27A_0,_transparent_60%)]" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-yellow-900 text-yellow-50">
                    Long Read
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-2xl">📖</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#7A674C]">
                  <span className="font-semibold">JOURNAL</span>
                  <span>•</span>
                  <span>12 min read</span>
                </div>
                <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                  On feeling invisible in a loud world
                </h3>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  A gentle piece on being present, even when you don&apos;t feel seen.
                </p>
                <div className="pt-2 text-[11px] text-[#A08960]">
                  24 comments
                </div>
              </div>
            </div>

            {/* Featured Book Club */}
            <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
              <div className="relative h-40 bg-gradient-to-br from-blue-100 to-indigo-100">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#93C5FD_0,_transparent_60%)]" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-900 text-blue-50">
                    Now Reading
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#7A674C]">
                  <span className="font-semibold">BOOK CLUB</span>
                  <span>•</span>
                  <span>Chapter 5</span>
                </div>
                <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                  The Power of Now
                </h3>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  Join the discussion on presence and mindfulness.
                </p>
                <div className="pt-2 text-[11px] text-[#A08960]">
                  15 members discussing
                </div>
              </div>
            </div>

            {/* Featured Music */}
            <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
              <div className="relative h-40 bg-gradient-to-br from-purple-100 to-pink-100">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#DDD6FE_0,_transparent_60%)]" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-purple-900 text-purple-50">
                    Playlist
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-2xl">🎧</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#7A674C]">
                  <span className="font-semibold">MUSIC ROOM</span>
                  <span>•</span>
                  <span>8 tracks</span>
                </div>
                <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                  Diaspora Sounds
                </h3>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  Songs that connect us to our roots and journeys.
                </p>
                <div className="pt-2 text-[11px] text-[#A08960]">
                  12 listens this week
                </div>
              </div>
            </div>

            {/* Featured Guide */}
            <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
              <div className="relative h-40 bg-gradient-to-br from-green-100 to-emerald-100">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#86EFAC_0,_transparent_60%)]" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-900 text-green-50">
                    New Resource
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-2xl">🗺️</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#7A674C]">
                  <span className="font-semibold">GUIDES</span>
                  <span>•</span>
                  <span>Toolkit</span>
                </div>
                <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                  Mental Health Kit for Parents
                </h3>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  Practical resources for supporting your child&apos;s wellbeing.
                </p>
                <div className="pt-2 text-[11px] text-[#A08960]">
                  8 resources
                </div>
              </div>
            </div>

            {/* Featured Lounge Post */}
            <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group md:col-span-2 lg:col-span-1">
              <div className="relative h-40 bg-gradient-to-br from-yellow-100 to-amber-100">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#FDE68A_0,_transparent_60%)]" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-500 text-white">
                    🔥 Trending
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-2xl">🌻</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#7A674C]">
                  <span className="font-semibold">THE LOUNGE</span>
                  <span>•</span>
                  <span>2h ago</span>
                </div>
                <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                  My neighbor brought me soup today
                </h3>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  Small acts of kindness that restore faith in humanity.
                </p>
                <div className="pt-2 text-[11px] text-[#A08960]">
                  47 reactions • 23 comments
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT'S HAPPENING IN THE COMMUNITY */}
        <section className="space-y-5 max-w-3xl mx-auto">
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-yellow-900">
              What&apos;s Happening in the Community
            </h2>
            <p className="text-sm text-[#7A674C]">
              Real conversations, happening right now
            </p>
          </div>

          <div className="space-y-3">
            {/* Trending Post 1 */}
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 hover:shadow-md transition-all hover:border-yellow-200 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#7A674C]">
                    <span>🌻 The Lounge</span>
                    <span>•</span>
                    <span>2 hours ago</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                    "Small joy: My neighbor brought me soup when I was feeling down"
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#A08960]">
                    <span>47 reactions</span>
                    <span>•</span>
                    <span>23 comments</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-pink-100 text-pink-700">
                    ⭐ Most heartwarming
                  </span>
                </div>
              </div>
            </div>

            {/* Trending Post 2 */}
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 hover:shadow-md transition-all hover:border-yellow-200 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#7A674C]">
                    <span>📚 Book Club</span>
                    <span>•</span>
                    <span>5 hours ago</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                    "Chapter 3 discussion: The comfort zone myth"
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#A08960]">
                    <span>34 reactions</span>
                    <span>•</span>
                    <span>18 comments</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700">
                    💬 Most discussed
                  </span>
                </div>
              </div>
            </div>

            {/* Trending Post 3 */}
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 hover:shadow-md transition-all hover:border-yellow-200 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#7A674C]">
                    <span>🧩 Solution Room</span>
                    <span>•</span>
                    <span>1 day ago</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                    "New SEND resource collaborative document"
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#A08960]">
                    <span>28 reactions</span>
                    <span>•</span>
                    <span>12 comments</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide bg-orange-100 text-orange-700">
                    🚀 Trending
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button className="text-xs font-semibold text-yellow-900 hover:text-yellow-700 underline decoration-dotted underline-offset-4">
              View all activity →
            </button>
          </div>
        </section>

        {/* INSIDE THE CIRCLE */}
        <section id="inside-circle" className="space-y-5">
          <h2 className="text-lg md:text-xl font-semibold text-yellow-900">
            Inside the Circle
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow">
              <p className="font-semibold text-[#3A2E1F]">🌻 The Lounge</p>
              <p className="text-[#7A674C] leading-relaxed">
                Daily check-ins, small joys, soft rants and gentle company.
              </p>
            </div>
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow">
              <p className="font-semibold text-[#3A2E1F]">📚 Book Club</p>
              <p className="text-[#7A674C] leading-relaxed">
                Read together, chapter by chapter. From comfort reads to
                big-thinking.
              </p>
            </div>
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow">
              <p className="font-semibold text-[#3A2E1F]">🎧 Music Room</p>
              <p className="text-[#7A674C] leading-relaxed">
                Nostalgic tracks, diaspora sounds and songs that carried you.
              </p>
            </div>
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow">
              <p className="font-semibold text-[#3A2E1F]">🧩 Solution Rooms</p>
              <p className="text-[#7A674C] leading-relaxed">
                Co-create ideas on topics like SEND &amp; AI, mental health and
                diaspora futures.
              </p>
            </div>
          </div>
        </section>

        {/* FOR WHO + WHAT IS IT */}
        <section className="grid md:grid-cols-2 gap-8 md:gap-10 text-xs md:text-sm">
          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-semibold text-yellow-900">
              For who?
            </h2>
            <p className="text-[#5C4A33] leading-relaxed">
              For sensitive souls, overthinkers, community builders and quiet
              optimists who still believe we can do better.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-semibold text-yellow-900">
              What is The Sunflower Post?
            </h2>
            <p className="text-[#5C4A33] leading-relaxed">
              A hybrid of a modern magazine, a gentle forum and a solution-space
              for people who care.
            </p>
            <p className="text-[#5C4A33] leading-relaxed">
              We bring together journals, discussion rooms and real-world meetups
              so you can connect with others, feel less alone, and contribute to
              ideas that might actually change things.
            </p>
            <p className="text-[#5C4A33] leading-relaxed">
              Think: slow internet, but with structure. A place where your small
              joys matter as much as your big ideas.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-5 text-xs md:text-sm">
          <h2 className="text-base md:text-lg font-semibold text-yellow-900">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow">
              <p className="text-xs font-semibold text-[#3A2E1F]">1. Join</p>
              <p className="text-[#5C4A33] leading-relaxed">
                Enter the Circle, create a gentle profile, choose a few interests,
                and we&apos;ll show you rooms that feel like home.
              </p>
            </div>
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow">
              <p className="text-xs font-semibold text-[#3A2E1F]">2. Share</p>
              <p className="text-[#5C4A33] leading-relaxed">
                Plant sunflowers: post small joys, ask for a pick-me-up, join
                book chats or explore the Pinterest-style wall of inspiration.
              </p>
            </div>
            <div className="bg-white border border-yellow-100 rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow">
              <p className="text-xs font-semibold text-[#3A2E1F]">3. Contribute</p>
              <p className="text-[#5C4A33] leading-relaxed">
                Take part in Solution Rooms and Speak Up sessions that feed into
                annual Sunflower Reports.
              </p>
            </div>
          </div>
        </section>

        {/* SUNFLOWER JOURNALS - Enhanced with reading badges */}
        <section id="journals" className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-yellow-900">
              Sunflower Journals 🪞
            </h2>
            <p className="text-xs md:text-sm text-[#5C4A33] max-w-2xl">
              Long-form reflections, essays and interviews from selected writers,
              educators and community members.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Journal 1 */}
            <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#94A3B8_0,_transparent_70%)]" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-700 text-slate-50">
                    Long Read • 12 min
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-[10px] text-[#A08960] font-semibold uppercase tracking-wide">
                  Essay • Culture
                </div>
                <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                  On feeling invisible in a loud world
                </h3>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  A gentle piece on being present, even when you don&apos;t feel seen.
                </p>
              </div>
            </div>

            {/* Journal 2 */}
            <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
              <div className="relative h-48 bg-gradient-to-br from-rose-100 to-pink-200">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#FB7185_0,_transparent_70%)]" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-700 text-rose-50">
                    Short Read • 4 min
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-[10px] text-[#A08960] font-semibold uppercase tracking-wide">
                  Essay • Community
                </div>
                <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                  Joy as quiet resistance
                </h3>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  Why softness and laughter still matter in heavy times.
                </p>
              </div>
            </div>

            {/* Journal 3 */}
            <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
              <div className="relative h-48 bg-gradient-to-br from-cyan-100 to-blue-200">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#06B6D4_0,_transparent_70%)]" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-cyan-700 text-cyan-50">
                    Medium Read • 8 min
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-[10px] text-[#A08960] font-semibold uppercase tracking-wide">
                  Behind the Scenes
                </div>
                <h3 className="text-sm font-semibold text-[#3A2E1F] group-hover:text-yellow-900 transition-colors">
                  Soft tech: building gentler online spaces
                </h3>
                <p className="text-xs text-[#7A674C] leading-relaxed">
                  Notes from behind the scenes of The Sunflower Post.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section
          id="join-circle"
          className="mt-4 bg-white border border-yellow-100 rounded-3xl p-6 md:p-8 space-y-4 text-xs md:text-sm hover:shadow-lg transition-shadow"
        >
          <h2 className="text-base md:text-xl font-semibold text-yellow-900">
            Ready for a different kind of internet?
          </h2>
          <p className="text-[#5C4A33] max-w-2xl leading-relaxed">
            Join the waitlist for the first cohort of Sunflower Circle members
            and help us shape this space from the ground up.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-xs font-semibold text-[#3A2E1F] shadow-sm transition-all hover:shadow-md hover:scale-105">
              Join the waitlist
            </button>
            <p className="text-[11px] text-[#7A674C]">
              No spam. Just the occasional ray of sunshine.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
