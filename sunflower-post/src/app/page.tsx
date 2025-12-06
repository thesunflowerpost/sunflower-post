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
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop"
                  alt="Book"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                    Now Reading
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Sofia</span>
                  <span>·</span>
                  <span>Chapter 5</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                  The Power of Now
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Join the discussion on presence and mindfulness.
                </p>
                <div className="pt-2 text-sm text-gray-500">
                  💬 15 members discussing
                </div>
              </div>
            </div>

            {/* Featured Community Post */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all group">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop"
                  alt="Community post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-gray-900">
                    Trending
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Community</span>
                  <span>·</span>
                  <span>2h ago</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                  Small acts of kindness
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Stories that restore faith in humanity.
                </p>
                <div className="pt-2 text-sm text-gray-500">
                  💛 47 reactions · 💬 23 comments
                </div>
              </div>
            </div>
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
