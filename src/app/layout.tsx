import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorldCounter - Word Counter with Social Media Templates | 100% Local",
  description: "Simple word counter with character limits for Twitter, Instagram, LinkedIn and more. Auto-save to IndexedDB, copy to clipboard, 100% local and private.",
  keywords: ["word counter", "character counter", "Twitter counter", "Instagram counter", "LinkedIn counter", "social media templates", "local word counter", "text analysis"],
  authors: [{ name: "Alex Zimmer Bonjour" }],
  creator: "Alex Zimmer Bonjour",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
