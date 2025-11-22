import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className="min-h-screen bg-gradient-to-b from-[#FFF9EC] via-[#FFFDF8] to-[#FFF8E6] text-[#3A2E1F] antialiased font-[family-name:var(--font-body)]"
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* TOP STRIP / NAV */}
            <header className="sticky top-0 z-30 border-b border-[color:var(--border-soft)] bg-[color:var(--soft-cream)]/90 backdrop-blur shadow-[var(--shadow-gentle)]">
              <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
                <a href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-xl bg-[color:var(--sunflower-gold)] flex items-center justify-center text-base shadow-[var(--shadow-gentle)] transition-transform group-hover:scale-105">
                    🌻
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[color:var(--text-warm-lighter)]">
                      A softer corner of the internet
                    </p>
                    <p className="text-xs font-semibold text-[color:var(--deep-soil)]">
                      The Sunflower Post
                    </p>
                  </div>
                </a>

                <Navigation />
              </div>
            </header>

            {/* MAIN APP CONTAINER */}
            <main className="flex-1 py-6 md:py-10">
              <div className="max-w-6xl mx-auto px-4">
                <div className="bg-[color:var(--soft-cream)] border border-[color:var(--border-soft)] rounded-3xl md:rounded-[32px] shadow-[var(--shadow-medium)] overflow-hidden">
                  {children}
                </div>
              </div>
            </main>

            {/* FOOTER */}
            <footer className="pb-6 pt-2 text-[11px] text-[color:var(--text-warm-light)]">
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
        </AuthProvider>
      </body>
    </html>
  );
}
