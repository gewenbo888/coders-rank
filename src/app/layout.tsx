import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coders.psyverse.fun"),
  title: "AI Coders · Ranked | AI 编程助手排行榜",
  description:
    "Cursor, Claude Code, Windsurf, GitHub Copilot, Aider, v0, Bolt, Lovable, Devin, DeepSeek V4 — 35+ AI coding tools scored on 6 weighted criteria including code-generation quality, context understanding, and productivity impact.",
  keywords: ["AI coding tools", "AI coding assistant", "Cursor", "Claude Code", "Windsurf", "GitHub Copilot", "Aider", "v0", "Bolt.new", "Lovable", "Devin", "DeepSeek Coder", "Qwen Coder", "AI 编程", "AI 编程助手"],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "AI Coders · Ranked" }],
    title: "AI Coders · Ranked",
    description: "35+ AI coding tools scored on 6 weighted criteria across 6 categories. 中英双语。",
    url: "https://coders.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: "AI Coders · Ranked",
    description: "35+ AI coding tools scored on 6 criteria across 6 categories.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#0a0908" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
