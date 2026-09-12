"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SearchSection } from "@/components/search-section";
import { TattooGrid } from "@/components/tattoo-grid";
import { DiscoverSection } from "@/components/discover-section";
import { HappyClientsSection } from "@/components/happy-clients-section";
import { CommunitySection } from "@/components/community-section";
import { Footer } from "@/components/footer";
import { SAMPLE_TATTOOS } from "@/lib/sample-tattoos";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter tattoos based on category pill and search query
  const filteredTattoos = useMemo(() => {
    return SAMPLE_TATTOOS.filter((tattoo) => {
      const matchesCategory =
        !selectedCategory ||
        tattoo.style.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tattoo.title.toLowerCase().includes(q) ||
        tattoo.style.toLowerCase().includes(q) ||
        tattoo.placement.toLowerCase().includes(q) ||
        tattoo.author.name.toLowerCase().includes(q) ||
        tattoo.author.username.toLowerCase().includes(q) ||
        tattoo.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col selection:bg-white selection:text-black">
      {/* 1. Sticky Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Search Section & Popular Categories */}
        <div id="explore">
          <SearchSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* 4. Trending Tattoos (Pinterest-style Masonry/Grid) */}
        <TattooGrid
          tattoos={filteredTattoos}
          title={
            selectedCategory
              ? `${selectedCategory} Tattoos`
              : searchQuery
              ? `Results for "${searchQuery}"`
              : "Trending Tattoos"
          }
          subtitle={
            selectedCategory
              ? `Showing top community creations in ${selectedCategory}.`
              : "Discover the most saved and inspiring pieces created across our global community."
          }
        />

        {/* 5. Happy Clients Showcase */}
        <HappyClientsSection />

        {/* 6. Discover Section */}
        <DiscoverSection />

        {/* 7. Community Section */}
        <CommunitySection />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
