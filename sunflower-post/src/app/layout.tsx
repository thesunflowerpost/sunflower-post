import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Sunflower Post",
  description:
    "A softer corner of the internet for joy, hope and gentle community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className +
          " min-h-screen bg-gradient-to-b from-[#FFF9EC] via-[#FFFDF8] to-[#FFF8E6] text-[#3A2E1F] antialiased"
        }
      >
        <div className="min-h-screen flex flex-col">
          {/* TOP STRIP / NAV */}
          <header className="sticky top-0 z-30 border-b border-yellow-100 bg-white/70 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center text-base shadow-sm">
                  🌻
                </div>
                <div className="hidden sm:block">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[#A08960]">
                    A softer corner of the internet
                  </p>
                  <p className="text-xs font-semibold text-yellow-900">
                    The Sunflower Post
                  </p>
                </div>
              </a>

              <nav className="flex items-center gap-1.5 text-[10px] text-[#7A674C]">
  <a
    href="/"
    className="px-2.5 py-1.5 rounded-full bg-yellow-50 text-yellow-900 font-medium shadow-sm"
  >
    Home
  </a>
  <a
    href="/lounge"
    className="px-2.5 py-1.5 rounded-full hover:bg-yellow-50 hover:text-yellow-900 transition"
  >
    Lounge
  </a>
  <a
    href="/hope-bank"
    className="px-2.5 py-1.5 rounded-full hover:bg-yellow-50 hover:text-yellow-900 transition hidden sm:inline-flex"
  >
    Hope Bank
  </a>
  <a
    href="#journals"
    className="px-2.5 py-1.5 rounded-full hover:bg-yellow-50 hover:text-yellow-900 transition hidden md:inline-flex"
  >
    Journals
  </a>
  <div className="w-px h-4 bg-yellow-200 mx-1 hidden md:block" />
  <a
    href="/login"
    className="px-2.5 py-1.5 rounded-full hover:bg-yellow-50 hover:text-yellow-900 transition font-medium"
  >
    Login
  </a>
  <a
    href="/signup"
    className="px-2.5 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-sm transition-all hover:shadow-md"
  >
    Sign up
  </a>
</nav>


            </div>
          </header>

          {/* MAIN APP CONTAINER */}
          <main className="flex-1 py-6 md:py-10">
            <div className="max-w-6xl mx-auto px-4">
              <div className="bg-[#FFFEFA] border border-yellow-100 rounded-3xl md:rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.04)] overflow-hidden">
                {children}
              </div>
            </div>
          </main>

          {/* FOOTER */}
          <footer className="pb-6 pt-2 text-[11px] text-[#7A674C]">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
              <p>
                © {new Date().getFullYear()} The Sunflower Post. All rights
                reserved.
              </p>
              <p className="text-[10px]">
                No spam. Just the occasional ray of sunshine.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
