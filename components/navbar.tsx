"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, Sparkles, LogOut, Calendar, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavbarProps {
  onSearchClick?: () => void;
}

export function Navbar({ onSearchClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, openAuthModal, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSearchClick) {
      onSearchClick();
    } else {
      const searchEl = document.getElementById("search-section");
      if (searchEl) {
        searchEl.scrollIntoView({ behavior: "smooth" });
        const input = searchEl.querySelector("input");
        if (input) {
          input.focus();
        }
      }
    }
  };

  const navLinks = [
    { label: "Explore", href: "/tattoos" },
    { label: "Book Ink", href: "/book" },
    { label: "Happy Clients", href: "/#clients" },
    { label: "People", href: "/#discover" },
    ...(isAdmin ? [{ label: "Admin", href: "/admin", isAdmin: true }] : []),
    { label: "Create", href: "/#community", highlight: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/40"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center gap-2 text-xl sm:text-2xl font-black tracking-[0.25em] text-white hover:opacity-90 transition-opacity uppercase"
            >
              <span>TATTOO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 group-hover:scale-125 transition-transform" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm font-medium tracking-wide transition-all rounded-md flex items-center gap-1.5 ${
                    link.highlight
                      ? "text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-zinc-300" />}
                  <span>{link.label}</span>
                  {link.isAdmin && (
                    <span className="text-[9px] font-mono uppercase bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded leading-none">
                      Ledger
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 md:gap-4">
            {/* Search icon trigger */}
            <button
              onClick={scrollToSearch}
              aria-label="Search tattoos"
              className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Logged In vs Logged Out */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/book"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>{user.bookings.length} Bookings</span>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
                  <div className="w-7 h-7 rounded-full overflow-hidden relative border border-white/20 bg-zinc-800">
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      fill
                      sizes="28px"
                      unoptimized={user.avatarUrl.includes("googleusercontent.com")}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-mono font-medium text-zinc-200">
                    @{user.username}
                  </span>
                  {isAdmin && (
                    <span className="text-[9px] font-mono uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                      Admin
                    </span>
                  )}
                  <button
                    onClick={logout}
                    title="Log Out"
                    aria-label="Log Out"
                    className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.08] transition-colors ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Login button */}
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors tracking-wide"
                >
                  Login
                </button>

                {/* Sign Up button */}
                <button
                  type="button"
                  onClick={() => openAuthModal("register")}
                  className="px-5 py-2 text-sm font-semibold text-black bg-white hover:bg-zinc-200 transition-all rounded-full tracking-wide shadow-md shadow-white/5 active:scale-95"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={scrollToSearch}
              aria-label="Search"
              className="p-2 text-zinc-300 hover:text-white rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-zinc-300 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-nav border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.05]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900 border border-white/10">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/20 bg-zinc-800">
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {isAdmin && (
                        <span className="text-[9px] font-mono uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {user.email} • {user.bookings.length} Bookings
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm font-medium text-zinc-300 hover:text-white border border-white/[0.1] rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm font-medium text-zinc-200 hover:text-white border border-white/[0.1] rounded-lg"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm font-semibold text-black bg-white rounded-lg hover:bg-zinc-200"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
