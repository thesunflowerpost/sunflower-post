import type { Metadata } from "next";
import { Nunito, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

// Load Nunito (primary UI font)
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

// Load DM Serif Display (emphasis/display font)
const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
  display: 'swap',
});

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
    <html lang="en" className={`${nunito.variable} ${dmSerifDisplay.variable}`}>
      <body
        className="min-h-screen antialiased"
        style={{
          fontFamily: 'var(--font-nunito)',
          background: 'var(--soft-cream)',
          color: 'var(--text-primary)'
        }}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* TOP STRIP / NAV */}
            <header className="sticky top-0 z-30 backdrop-blur" style={{
              borderBottom: '1px solid var(--border-soft)',
              background: 'rgba(250, 246, 240, 0.9)',
              boxShadow: 'var(--shadow-soft)'
            }}>
              <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <a href="/" className="flex items-center gap-2 group">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-105"
                    style={{
                      background: 'var(--sunflower-gold)',
                      boxShadow: 'var(--shadow-soft)'
                    }}
                  >
                    🌻
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                      A softer corner of the internet
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      The Sunflower Post
                    </p>
                  </div>
                </a>

                <Navigation />
              </div>
            </header>

            {/* MAIN APP CONTAINER */}
            <main className="flex-1 py-8 md:py-12">
              <div className="max-w-6xl mx-auto px-4">
                <div
                  className="rounded-3xl md:rounded-[32px] overflow-hidden"
                  style={{
                    background: 'var(--soft-cream)',
                    border: '1px solid var(--border-soft)',
                    boxShadow: 'var(--shadow-medium)'
                  }}
                >
                  {children}
                </div>
              </div>
            </main>

            {/* FOOTER */}
            <footer className="pb-6 pt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
                <p>
                  © {new Date().getFullYear()} The Sunflower Post. All rights
                  reserved.
                </p>
                <p className="text-[11px]">
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
