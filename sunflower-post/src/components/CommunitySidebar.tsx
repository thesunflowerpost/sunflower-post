"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Room = {
  href: string;
  icon: string;
  label: string;
  description: string;
  comingSoon?: boolean;
};

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  title: string;
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
};

type CommunitySidebarProps = {
  filters?: FilterGroup[];
};

const ROOMS: Room[] = [
  {
    href: "/lounge",
    icon: "💬",
    label: "The Lounge",
    description: "Daily check-ins & small joys",
  },
  {
    href: "/hope-bank",
    icon: "🌈",
    label: "Hope Bank",
    description: "Stories of things quietly getting better",
  },
  {
    href: "/music-room",
    icon: "🎵",
    label: "Music Room",
    description: "Playlists & feel-good songs",
  },
  {
    href: "/book-club",
    icon: "📚",
    label: "Book Club",
    description: "Chapters, quotes & gentle debates",
    
  },
  {
    href: "/tv-movies",
    icon: "📺",
    label: "TV & Movies",
    description: "Decompress with series & films",
  },
  {
    href: "/inspo-wall",
    icon: "✨",
    label: "Inspo Wall",
    description: "Visual inspo & saved sunshine",
  },
  {
    href: "/dilemmas",
    icon: "💭",
    label: "Dilemmas",
    description: "Get perspective on life's tricky moments",
  },
];

export default function CommunitySidebar({ filters }: CommunitySidebarProps = {}) {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <nav className="bg-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-xl p-3 space-y-1 shadow-[var(--shadow-gentle)]">
        {/* HEADER */}
        <div className="px-2 py-2 mb-2">
          <h2 className="text-xs font-semibold text-[color:var(--text-warm-lighter)] uppercase tracking-wide">
            Rooms
          </h2>
        </div>

      {/* ROOM LIST */}
      <div className="space-y-0.5">
        {ROOMS.map((room) => {
          const isActive = pathname.startsWith(room.href) && !room.comingSoon;

          return room.comingSoon ? (
            // COMING SOON (NO LINK)
            <div
              key={room.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[color:var(--text-tertiary)] cursor-not-allowed group relative"
            >
              <span className="text-lg flex-shrink-0 opacity-60">{room.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block truncate">{room.label}</span>
              </div>
              <span className="text-[10px] bg-[color:var(--border-soft)] text-[color:var(--text-tertiary)] px-1.5 py-0.5 rounded">Soon</span>
            </div>
          ) : (
            // ACTIVE / CLICKABLE ROOM
            <Link
              key={room.href}
              href={room.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all group relative",
                isActive
                  ? "bg-[color:var(--sunflower-gold)] text-[color:var(--deep-soil)] font-medium shadow-[var(--shadow-gentle)]"
                  : "text-[color:var(--text-warm-medium)] hover:bg-white/60 hover:text-[color:var(--deep-soil)] hover:shadow-sm",
              ].join(" ")}
            >
              <span className="text-lg flex-shrink-0">{room.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block truncate">{room.label}</span>
              </div>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[color:var(--honey-gold)] rounded-r" />
              )}
            </Link>
          );
        })}
      </div>

        {/* FOOTER NOTE */}
        <div className="pt-3 mt-3 border-t border-[color:var(--border-soft)]">
          <p className="text-[11px] text-[color:var(--text-warm-light)] px-2 leading-relaxed">
            More rooms open as the community grows 🌻
          </p>
        </div>
      </nav>

      {/* FILTERS SECTION */}
      {filters && filters.length > 0 && (
        <nav className="bg-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-xl p-3 space-y-4 shadow-[var(--shadow-gentle)]">
          {filters.map((filterGroup, index) => (
            <div key={index} className="space-y-2">
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold text-[color:var(--text-warm-lighter)] uppercase tracking-wide">
                  {filterGroup.title}
                </h3>
              </div>
              <div className="space-y-1">
                {filterGroup.options.map((option) => {
                  const isActive = filterGroup.activeValue === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => filterGroup.onChange(option.value)}
                      className={[
                        "w-full text-left rounded-lg px-3 py-2 text-sm transition-all relative",
                        isActive
                          ? "bg-[color:var(--sunflower-gold)] text-[color:var(--deep-soil)] font-medium shadow-[var(--shadow-gentle)]"
                          : "text-[color:var(--text-warm-medium)] hover:bg-white/60 hover:text-[color:var(--deep-soil)] hover:shadow-sm",
                      ].join(" ")}
                    >
                      {option.label}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[color:var(--honey-gold)] rounded-r" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
