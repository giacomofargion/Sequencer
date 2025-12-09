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
    <html lang="en">
      <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
