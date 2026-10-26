import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astral Arcana | Personalized Tarot Reflection",
  description: "Ask a question, draw a classic three-card or five-card tarot spread, and receive a personalized reflective interpretation.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
