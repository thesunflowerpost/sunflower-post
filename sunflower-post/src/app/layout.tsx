import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

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
        <AuthProvider>
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

                <Navigation />
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
        </AuthProvider>
      </body>
    </html>
  );
}
