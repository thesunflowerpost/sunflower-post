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
        className="min-h-screen antialiased bg-white text-gray-900"
        style={{
          fontFamily: 'var(--font-nunito)'
        }}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* TOP STRIP / NAV - Bright Yellow */}
            <header className="sticky top-0 z-30 bg-yellow-400 border-b border-yellow-500 shadow-sm">
              <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <a href="/" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg transition-transform group-hover:scale-105 shadow-sm">
                    🌻
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] uppercase tracking-wider text-gray-800 font-medium">
                      A softer corner of the internet
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      The Sunflower Post
                    </p>
                  </div>
                </a>

                <Navigation />
              </div>
            </header>

            {/* MAIN APP CONTAINER */}
            <main className="flex-1 py-8 md:py-12 bg-white">
              <div className="max-w-6xl mx-auto px-4">
                <div className="rounded-3xl md:rounded-[32px] overflow-hidden bg-white border border-gray-200 shadow-sm">
                  {children}
                </div>
              </div>
            </main>

            {/* FOOTER */}
            <footer className="pb-6 pt-2 text-xs text-gray-500 bg-white">
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
