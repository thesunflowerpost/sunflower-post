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
    href: "/pinterest-wall",
    icon: "📌",
    label: "Pinterest Wall",
    description: "Visual inspo & saved sunshine",
    comingSoon: true,
  },
  {
    href: "/solution-rooms",
    icon: "🧩",
    label: "Solution Rooms",
    description: "Gentle problem-solving together",
    comingSoon: true,
  },
];

export default function CommunitySidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border border-yellow-100 rounded-2xl p-3 md:p-4 text-xs space-y-4 shadow-sm">
      {/* HEADER */}
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#A08960]">
          Rooms
        </p>
        <p className="text-[11px] text-[#7A674C]">
          Move between spaces without losing the calm.
        </p>
      </div>

      {/* ROOM LIST */}
      <div className="space-y-2">
        {ROOMS.map((room) => {
          const isActive = pathname.startsWith(room.href) && !room.comingSoon;

          return room.comingSoon ? (
            // COMING SOON (NO LINK)
            <div
              key={room.href}
              className="flex items-start gap-3 rounded-xl px-3 py-2 border border-yellow-50 bg-[#FFFEFA] text-[#C8B89A] opacity-70"
            >
              <span className="text-base">{room.icon}</span>
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold">{room.label}</span>
                <p className="text-[10px]">{room.description}</p>
                <span className="text-[9px] italic">Coming soon</span>
              </div>
            </div>
          ) : (
            // ACTIVE / CLICKABLE ROOM
            <Link
              key={room.href}
              href={room.href}
              className={[
                "flex items-start gap-3 rounded-xl px-3 py-2 border transition",
                isActive
                  ? "bg-[#FFF7D6] border-yellow-300 text-[#3A2E1F]"
                  : "bg-[#FFFEFA] border-yellow-100 text-[#5C4A33] hover:bg-yellow-50/70",
              ].join(" ")}
            >
              <span className="text-base">{room.icon}</span>
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold">{room.label}</span>
                <p className="text-[10px]">{room.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* FOOTER NOTE */}
      <div className="pt-1 border-t border-yellow-50 mt-2">
        <p className="text-[10px] text-[#A08960]">
          More rooms open as the community grows 🌻
        </p>
      </div>
    </nav>
  );
}
