import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Fargion Sequencer",
  description: "Step sequencer built with Next.js, Tone.js, and Tailwind v4",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-3 sm:px-4 py-4 sm:py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
