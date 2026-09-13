import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Marked Studio — Discover Your Next Tattoo",
  description:
    "A modern social community and marketplace centered around tattoos. Find the tattoo that tells your story, share ideas, and discover inspiration.",
  keywords: [
    "tattoos",
    "marked studio",
    "tattoo ideas",
    "tattoo inspiration",
    "fine line tattoo",
    "realism tattoo",
    "tattoo community",
    "tattoo flash",
  ],
  authors: [{ name: "Marked Studio" }],
  openGraph: {
    title: "Marked Studio — Discover Your Next Tattoo",
    description:
      "Find the tattoo that tells your story. Discover tattoo ideas, connect with people, and find the right inspiration for your next piece.",
    type: "website",
  },
};

import { AuthProvider } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth-modal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased selection:bg-white selection:text-black flex flex-col`}
      >
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}

