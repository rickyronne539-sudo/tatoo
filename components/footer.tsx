"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, ArrowUp } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}


export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = [
    { label: "About", href: "/#about" },
    { label: "Explore", href: "/tattoos" },
    { label: "Book Ink", href: "/book" },
    { label: "Happy Clients", href: "/#clients" },
    { label: "Studio Admin", href: "/admin" },
    { label: "Community", href: "/#community" },
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-[#070709] py-14 md:py-18 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-3.5 group hover:opacity-95 transition-opacity"
            >
              <div className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 p-1.5 group-hover:border-white/25 transition-all">
                <Image
                  src="/marked-studio-emblem.png"
                  alt="Marked Studio Emblem"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-[0.22em] text-white uppercase leading-none">
                  MARKED
                </span>
                <span className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-mono mt-1 leading-none">
                  STUDIO • ART & IDENTITY
                </span>
              </div>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm">
              Discover your next tattoo. A modern social community connecting
              ideas, collectors, and body art culture.
            </p>
          </div>

          {/* Social icons placeholder */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest / Community"
              className="w-10 h-10 rounded-full bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            >
              <Globe className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-10 h-10 rounded-full bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all ml-2"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom links and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
          <nav className="flex flex-wrap items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-zinc-500">
            © {new Date().getFullYear()} Marked Studio. Discover your next tattoo.
          </p>
        </div>
      </div>
    </footer>
  );
}
