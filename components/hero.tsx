"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Compass, Sparkles, Heart } from "lucide-react";
import { HERO_HIGHLIGHT_TATTOOS } from "@/lib/sample-tattoos";

export function Hero() {
  const scrollToTrending = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("trending-tattoos");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCommunity = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("community");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Subtle radial atmosphere lighting - strictly minimal, not loud gradients */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-zinc-800/20 blur-[130px] -z-10 pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 md:space-y-8">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs uppercase tracking-[0.2em] text-zinc-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Social Tattoo Marketplace
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] font-sans">
              Find the tattoo that tells your story.
            </h1>

            {/* Supporting Subtext */}
            <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-xl">
              Discover tattoo ideas, connect with people, and find the right
              person for your next tattoo.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={scrollToTrending}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 active:scale-95"
              >
                <span>Explore Tattoos</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={scrollToCommunity}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white font-medium text-sm tracking-wide border border-white/10 hover:border-white/20 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-zinc-300" />
                <span>Share Your Idea</span>
              </button>
            </div>

            {/* Micro Stats / Social Proof Indicator */}
            <div className="pt-4 flex items-center gap-8 border-t border-white/[0.06] w-full max-w-lg">
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">10k+</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Designs Shared</div>
              </div>
              <div className="w-px h-8 bg-white/[0.08]" />
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">40+</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Styles & Flash</div>
              </div>
              <div className="w-px h-8 bg-white/[0.08]" />
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">100%</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Community Driven</div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Curated Tattoo Image Grid */}
          <div className="lg:col-span-6 w-full">
            <div className="relative grid grid-cols-2 gap-3.5 sm:gap-4.5 p-2 sm:p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] shadow-2xl backdrop-blur-sm">
              {HERO_HIGHLIGHT_TATTOOS.map((item, index) => (
                <div
                  key={item.id}
                  className={`group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.06] transition-all duration-300 hover:border-white/20 hover:shadow-xl ${
                    index === 0 ? "aspect-[4/5]" : ""
                  } ${index === 1 ? "aspect-[4/6] translate-y-3 sm:translate-y-5" : ""} ${
                    index === 2 ? "aspect-[4/6] -translate-y-3 sm:-translate-y-5" : ""
                  } ${index === 3 ? "aspect-[4/5]" : ""}`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    priority={index < 2}
                  />

                  {/* Dark subtle overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-black/60 backdrop-blur-md text-zinc-300 rounded border border-white/10">
                      {item.style}
                    </span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white truncate drop-shadow-sm">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-zinc-300 drop-shadow-sm">
                        {item.artist}
                      </p>
                    </div>
                    <span className="p-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/80 group-hover:text-white transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
