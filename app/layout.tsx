import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const APP_NAME = "LIVE\u00D7LOG";

export const metadata: Metadata = {
  title: APP_NAME,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 px-4 pt-4 pb-2">
          <div className="mx-auto max-w-md">
            <div className="inline-block border-2 border-white bg-zinc-900 px-2 py-1 text-sm font-black tracking-wide text-white leading-none">
              {APP_NAME}
            </div>
          </div>
        </header>

        <div className="pt-16 pb-24">{children}</div>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-black/80 backdrop-blur">
          <div className="mx-auto max-w-md grid grid-cols-3">
            <Link
              href="/"
              className="py-4 text-center font-black tracking-widest hover:text-lime-400 transition"
            >
              HOME
            </Link>

            <Link
              href="/history"
              className="py-4 text-center font-black tracking-widest hover:text-lime-400 transition"
            >
              HISTORY
            </Link>

            <form action="/logout" method="post">
              <button className="w-full py-4 text-center font-black tracking-widest hover:text-lime-400 transition">
                LOGOUT
              </button>
            </form>
          </div>
        </nav>
      </body>
    </html>
  );
}
