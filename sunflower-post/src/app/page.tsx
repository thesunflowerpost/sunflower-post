export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-10">
      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
        {/* LEFT – COPY */}
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960]">
            A softer corner of the internet
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-yellow-900 leading-snug">
            Good news still exists.
            <br />
            You just needed a room to find it.
          </h1>
          <p className="text-sm text-[#5C4A33] max-w-xl">
            The Sunflower Post is a joy-first community and journal space where
            people share small joys, kind ideas and real solutions for a kinder
            world – outside the noise of social media.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#join-circle"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-xs font-semibold text-[#3A2E1F] shadow-sm"
            >
              Join the Sunflower Circle
            </a>
            <a
              href="#journals"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-yellow-200 bg-[#FFFEFA] text-xs font-semibold text-[#5C4A33] hover:bg-yellow-50"
            >
              Read the latest journal
            </a>
          </div>

          <p className="text-[11px] text-[#7A674C] pt-1">
            No algorithms. No doomscrolling. Just letters, laughter and light.
          </p>
        </div>

        {/* RIGHT – IMAGE + THIS WEEK'S POST */}
        <div className="space-y-4">
          {/* IMAGE PLACEHOLDER */}
          <div className="relative overflow-hidden rounded-3xl border border-yellow-100 bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 h-52 md:h-60 flex items-end">
            <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top,_#FFE27A_0,_transparent_60%)]" />
            <div className="relative flex w-full items-end justify-between px-4 pb-3">
              <div className="space-y-1 max-w-[70%]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#9A7B38]">
                  Community moment
                </p>
                <p className="text-xs font-semibold text-[#3A2E1F]">
                  A circle of friends sitting by a sunflower field, sharing
                  stories and books.
                </p>
                <p className="text-[10px] text-[#5C4A33]">
                  This is a placeholder visual. You&apos;ll swap this for your real
                  Sunflower photo later.
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 text-[10px] text-[#7A674C]">
                <div className="w-10 h-10 rounded-full bg-white/70 border border-yellow-100 flex items-center justify-center text-lg">
                  📚
                </div>
                <span>Offline</span>
                <span>meetups</span>
              </div>
            </div>
          </div>

          {/* THIS WEEK'S POST CARD */}
          <div className="bg-white border border-yellow-100 rounded-3xl p-5 space-y-3 shadow-sm">
            <p className="text-[11px] font-semibold text-yellow-900">
              This Week&apos;s Sunflower Post 💌
            </p>
            <h2 className="text-sm font-semibold text-[#3A2E1F]">
              Twelve tiny joys that don&apos;t depend on your productivity levels.
            </h2>
            <p className="text-xs text-[#5C4A33]">
              A gentle list of everyday moments you&apos;re still allowed to enjoy,
              even when you&apos;re tired, behind or figuring things out.
            </p>
            <button className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[11px] font-semibold text-[#3A2E1F] shadow-sm">
              Preview the bulletin →
            </button>
          </div>
        </div>
      </section>

      {/* INSIDE THE CIRCLE */}
      <section id="inside-circle" className="space-y-4">
        <h2 className="text-sm md:text-base font-semibold text-yellow-900">
          Inside the Circle
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-1">
            <p className="font-semibold text-[#3A2E1F]">🌻 The Lounge</p>
            <p className="text-[#7A674C]">
              Daily check-ins, small joys, soft rants and gentle company.
            </p>
          </div>
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-1">
            <p className="font-semibold text-[#3A2E1F]">📚 Book Club</p>
            <p className="text-[#7A674C]">
              Read together, chapter by chapter. From comfort reads to
              big-thinking.
            </p>
          </div>
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-1">
            <p className="font-semibold text-[#3A2E1F]">🎧 Music Room</p>
            <p className="text-[#7A674C]">
              Nostalgic tracks, diaspora sounds and songs that carried you.
            </p>
          </div>
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-1">
            <p className="font-semibold text-[#3A2E1F]">🧩 Solution Rooms</p>
            <p className="text-[#7A674C]">
              Co-create ideas on topics like SEND &amp; AI, mental health and
              diaspora futures.
            </p>
          </div>
        </div>
      </section>

      {/* FOR WHO + WHAT IS IT */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-10 text-xs md:text-sm">
        <div className="space-y-3">
          <h2 className="text-sm md:text-base font-semibold text-yellow-900">
            For who?
          </h2>
          <p className="text-[#5C4A33]">
            For sensitive souls, overthinkers, community builders and quiet
            optimists who still believe we can do better.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm md:text-base font-semibold text-yellow-900">
            What is The Sunflower Post?
          </h2>
          <p className="text-[#5C4A33]">
            A hybrid of a modern magazine, a gentle forum and a solution-space
            for people who care.
          </p>
          <p className="text-[#5C4A33]">
            We bring together journals, discussion rooms and real-world meetups
            so you can connect with others, feel less alone, and contribute to
            ideas that might actually change things.
          </p>
          <p className="text-[#5C4A33]">
            Think: slow internet, but with structure. A place where your small
            joys matter as much as your big ideas.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-4 text-xs md:text-sm">
        <h2 className="text-sm md:text-base font-semibold text-yellow-900">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-2">
            <p className="text-[11px] font-semibold text-[#3A2E1F]">1. Join</p>
            <p className="text-[#5C4A33]">
              Enter the Circle, create a gentle profile, choose a few interests,
              and we&apos;ll show you rooms that feel like home.
            </p>
          </div>
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-2">
            <p className="text-[11px] font-semibold text-[#3A2E1F]">2. Share</p>
            <p className="text-[#5C4A33]">
              Plant sunflowers: post small joys, ask for a pick-me-up, join
              book chats or explore the Pinterest-style wall of inspiration.
            </p>
          </div>
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-2">
            <p className="text-[11px] font-semibold text-[#3A2E1F]">3. Contribute</p>
            <p className="text-[#5C4A33]">
              Take part in Solution Rooms and Speak Up sessions that feed into
              annual Sunflower Reports.
            </p>
          </div>
        </div>
      </section>

      {/* JOURNALS PREVIEW */}
      <section id="journals" className="space-y-4">
        <h2 className="text-sm md:text-base font-semibold text-yellow-900">
          Sunflower Journals 🪞
        </h2>
        <p className="text-xs md:text-sm text-[#5C4A33] max-w-2xl">
          Long-form reflections, essays and interviews from selected writers,
          educators and community members.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-1">
            <p className="font-semibold text-[#3A2E1F]">
              On feeling invisible in a loud world
            </p>
            <p className="text-[#7A674C]">
              A gentle piece on being present, even when you don&apos;t feel seen.
            </p>
          </div>
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-1">
            <p className="font-semibold text-[#3A2E1F]">
              Joy as quiet resistance
            </p>
            <p className="text-[#7A674C]">
              Why softness and laughter still matter in heavy times.
            </p>
          </div>
          <div className="bg-white border border-yellow-100 rounded-2xl p-3 space-y-1">
            <p className="font-semibold text-[#3A2E1F]">
              Soft tech: building gentler online spaces
            </p>
            <p className="text-[#7A674C]">
              Notes from behind the scenes of The Sunflower Post.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        id="join-circle"
        className="mt-4 bg-white border border-yellow-100 rounded-3xl p-5 md:p-6 space-y-3 text-xs md:text-sm"
      >
        <h2 className="text-sm md:text-base font-semibold text-yellow-900">
          Ready for a different kind of internet?
        </h2>
        <p className="text-[#5C4A33] max-w-2xl">
          Join the waitlist for the first cohort of Sunflower Circle members
          and help us shape this space from the ground up.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <button className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-xs font-semibold text-[#3A2E1F] shadow-sm">
            Join the waitlist
          </button>
          <p className="text-[11px] text-[#7A674C]">
            No spam. Just the occasional ray of sunshine.
          </p>
        </div>
      </section>
    </div>
  );
}
