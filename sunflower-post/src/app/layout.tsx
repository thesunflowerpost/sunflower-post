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
      <body className="min-h-screen antialiased bg-gray-50 text-gray-900">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* MODERN CLEAN HEADER */}
            <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                <a href="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-xl transition-transform group-hover:scale-105">
                    🌻
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">
                      The Sunflower Post
                    </p>
                    <p className="text-xs text-gray-600">
                      A softer corner of the internet
                    </p>
                  </div>
                </a>

                <Navigation />
              </div>
            </header>

            {/* MAIN CONTAINER */}
            <main className="flex-1">
              {children}
            </main>

            {/* FOOTER */}
            <footer className="py-8 text-sm text-gray-600 bg-white border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
                <p>
                  © {new Date().getFullYear()} The Sunflower Post. All rights reserved.
                </p>
                <p className="text-xs text-gray-500">
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
