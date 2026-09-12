"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  SAMPLE_TATTOOS,
  PLACEMENTS,
  Tattoo,
} from "@/lib/sample-tattoos";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  CalendarPlus,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function GoogleLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function BookPage() {
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(
    SAMPLE_TATTOOS[0]
  );
  const [customTitle, setCustomTitle] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const availableDates = [
    { label: "Tomorrow", date: "Sep 8, 2026", day: "Tue" },
    { label: "Wed", date: "Sep 9, 2026", day: "Wed" },
    { label: "Thu", date: "Sep 10, 2026", day: "Thu" },
    { label: "Fri", date: "Sep 11, 2026", day: "Fri" },
    { label: "Sat", date: "Sep 12, 2026", day: "Sat" },
    { label: "Sun", date: "Sep 13, 2026", day: "Sun" },
  ];

  const timeSlots = [
    { time: "10:00 AM", period: "Morning" },
    { time: "1:30 PM", period: "Afternoon" },
    { time: "4:00 PM", period: "Late Afternoon" },
    { time: "6:30 PM", period: "Evening" },
  ];

  const [placement, setPlacement] = useState<string>("Forearm");
  const [size, setSize] = useState<string>("Medium (4-6 in)");
  const [colorMode, setColorMode] = useState<string>("Black & Grey");
  const [sessionType, setSessionType] = useState<string>("Studio Appointment");
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].date);
  const [selectedTime, setSelectedTime] = useState<string>("1:30 PM");

  const { user, loginWithGoogle, register: authRegister, addBooking, recordAdminBooking } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [createAccountOnBook, setCreateAccountOnBook] = useState(true);
  const [accountUsername, setAccountUsername] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [registeredHandle, setRegisteredHandle] = useState("");

  const [fullName, setFullName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phone, setPhone] = useState("");
  const [isFirstTattoo, setIsFirstTattoo] = useState(false);
  const [notes, setNotes] = useState("");

  React.useEffect(() => {
    if (user) {
      setFullName((prev) => prev || user.name);
      setEmail((prev) => prev || user.email);
    }
  }, [user]);

  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(
    null
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = `TAT-${Math.floor(10000 + Math.random() * 90000)}`;
    setConfirmedBookingRef(refCode);

    let activeHandle = user?.username || "";
    if (!user && createAccountOnBook && email) {
      const preferredUsername =
        accountUsername.trim() ||
        fullName.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
        email.split("@")[0];
      const newUser = authRegister(
        fullName,
        preferredUsername,
        email,
        selectedTattoo?.style
      );
      activeHandle = newUser.username;
    }
    setRegisteredHandle(activeHandle);

    const title = isCustom
      ? customTitle || "Custom Design"
      : selectedTattoo?.title || "Custom Tattoo Project";

    addBooking({
      ref: refCode,
      pieceTitle: title,
      date: selectedDate,
      time: selectedTime,
      placement,
      deposit: 50,
    });

    recordAdminBooking({
      ref: refCode,
      clientName: fullName || user?.name || "Client",
      clientEmail: email || user?.email || "client@tattoo.community",
      clientAvatar: user?.avatarUrl,
      clientUsername: activeHandle,
      tattooTitle: title,
      tattooImage:
        !isCustom && selectedTattoo
          ? selectedTattoo.imageUrl
          : "https://images.unsplash.com/photo-1590246814883-5783515f4835?auto=format&fit=crop&w=400&q=80",
      style: !isCustom && selectedTattoo ? selectedTattoo.style : "Custom Concept",
      placement,
      size,
      date: selectedDate,
      time: selectedTime,
      sessionType: sessionType as "Studio Appointment" | "Design Consultation",
      depositPaid: 50,
      estimatedTotal: size.includes("Full") ? 680 : size.includes("Large") ? 420 : 280,
      status: "deposit_held",
      notes: notes || (isFirstTattoo ? "First time client." : undefined),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-300 font-medium">Book Appointment</span>
          </nav>

          {/* Page Heading */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-[0.2em] text-zinc-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              Direct Artist Reservation
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Book a Tattoo Appointment
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Schedule your ink session or virtual concept review. Choose a
              signature flash piece or configure a bespoke custom tattoo design.
            </p>
          </div>

          {/* If confirmed, show confirmation view */}
          {confirmedBookingRef ? (
            <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-emerald-500/30 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                  Appointment Confirmed
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                  Reservation Held, {fullName || "Friend"}!
                </h2>
                <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
                  We have forwarded your booking details to{" "}
                  <strong className="text-zinc-200">{email}</strong>. The studio
                  will reach out for consultation prep.
                </p>
              </div>

              {/* Receipt card */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/[0.08] text-left space-y-3 max-w-md mx-auto text-xs">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-zinc-400">Reference Number</span>
                  <span className="font-mono font-bold text-white">
                    #{confirmedBookingRef}
                  </span>
                </div>
                {(registeredHandle || user?.username) && (
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-zinc-400">Tattoo Account</span>
                    <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      @{registeredHandle || user?.username}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Piece</span>
                  <span className="font-semibold text-zinc-200">
                    {isCustom ? customTitle || "Custom Design" : selectedTattoo?.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Date & Time</span>
                  <span className="font-semibold text-zinc-200">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Placement</span>
                  <span className="font-semibold text-zinc-200">{placement}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                  <span className="text-zinc-400">Deposit Status</span>
                  <span className="font-bold text-emerald-400">$50 Hold Active</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Added booking #${confirmedBookingRef} on ${selectedDate} at ${selectedTime} to calendar.`);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-300 border border-white/10 hover:text-white"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Sync to Calendar</span>
                </button>
                <Link
                  href="/tattoos"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors"
                >
                  Browse More Tattoos
                </Link>
              </div>
            </div>
          ) : (
            /* Split layout: Form on left, live summary on right */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Form on left (7 cols) */}
              <form
                onSubmit={handleBookingSubmit}
                className="lg:col-span-7 space-y-8 bg-zinc-950/60 p-6 sm:p-8 rounded-3xl border border-white/[0.08]"
              >
                {/* 1. Design Choice: Flash vs Custom */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    1. Choose Design Source
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCustom(false)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        !isCustom
                          ? "bg-white text-black border-white font-bold"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.08]"
                      }`}
                    >
                      <div className="text-xs font-bold">Pick From Flash Collection</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          !isCustom ? "text-zinc-700" : "text-zinc-500"
                        }`}
                      >
                        Select from trending pieces
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isCustom
                          ? "bg-white text-black border-white font-bold"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.08]"
                      }`}
                    >
                      <div className="text-xs font-bold">Custom Concept Idea</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          isCustom ? "text-zinc-700" : "text-zinc-500"
                        }`}
                      >
                        Bespoke project from scratch
                      </div>
                    </button>
                  </div>

                  {!isCustom ? (
                    /* Flash Picker */
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] text-zinc-400">
                        Select a design to base your session on:
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                        {SAMPLE_TATTOOS.map((tat) => (
                          <div
                            key={tat.id}
                            onClick={() => {
                              setSelectedTattoo(tat);
                              setPlacement(tat.placement);
                            }}
                            className={`group cursor-pointer relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                              selectedTattoo?.id === tat.id
                                ? "border-white shadow-lg"
                                : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={tat.imageUrl}
                              alt={tat.title}
                              fill
                              sizes="100px"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex items-end">
                              <span className="text-[9px] font-semibold text-white truncate">
                                {tat.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Custom idea input */
                    <div className="pt-2 space-y-1.5">
                      <label className="text-xs text-zinc-400">
                        Project / Tattoo Concept Name
                      </label>
                      <input
                        type="text"
                        required
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="e.g. Celestial Orbit & Mythological Serpent"
                        className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Placement & Sizing */}
                <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    2. Placement & Dimensions
                  </label>

                  {/* Body Placement */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-zinc-400">Target Placement:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                      {PLACEMENTS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlacement(p)}
                          className={`py-2 px-3 text-xs rounded-xl border text-left flex items-center gap-1.5 transition-all ${
                            placement === p
                              ? "bg-white text-black font-semibold border-white"
                              : "bg-zinc-900 text-zinc-300 border-white/[0.08]"
                          }`}
                        >
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizing */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-zinc-400">Estimated Sizing:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        "Small (2-3 in)",
                        "Medium (4-6 in)",
                        "Large (7-10 in)",
                        "Full Sleeve / Back",
                      ].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`py-2.5 px-2 text-xs rounded-xl border text-center transition-all ${
                            size === s
                              ? "bg-white text-black font-semibold border-white"
                              : "bg-zinc-900 text-zinc-300 border-white/[0.08]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Date & Time Selection */}
                <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    3. Date & Time Slot
                  </label>

                  {/* Dates */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {availableDates.map((item) => (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => setSelectedDate(item.date)}
                        className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                          selectedDate === item.date
                            ? "bg-white text-black border-white font-bold"
                            : "bg-zinc-900 text-zinc-300 border-white/[0.08]"
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold opacity-80">
                          {item.day}
                        </div>
                        <div className="text-xs font-bold mt-0.5">
                          {item.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Time slots */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                          selectedTime === slot.time
                            ? "bg-white text-black font-bold border-white"
                            : "bg-zinc-900 text-zinc-300 border-white/[0.08]"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{slot.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Client Details */}
                <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    4. Client Contact & Account
                  </label>

                  {user ? (
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden relative border border-white/20 bg-zinc-800 shrink-0">
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            fill
                            sizes="36px"
                            unoptimized={user.avatarUrl.includes("googleusercontent.com")}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            <span className="text-[9px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                              Signed In
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-400 font-mono">
                        Auto-Filled
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.1] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white">
                            Register Tattoo Account
                          </span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                          <input
                            type="checkbox"
                            checked={createAccountOnBook}
                            onChange={(e) => setCreateAccountOnBook(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-700 text-white focus:ring-0 cursor-pointer"
                          />
                          <span className="text-[11px] text-zinc-400">
                            Create account on book
                          </span>
                        </label>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Create your user account to track appointment status, message the studio, and save your tattoo history.
                      </p>

                      {/* Google 1-Click Sign In */}
                      <button
                        type="button"
                        disabled={isGoogleLoading}
                        onClick={async () => {
                          setIsGoogleLoading(true);
                          setGoogleError("");
                          try {
                            const u = await loginWithGoogle();
                            setFullName(u.name);
                            setEmail(u.email);
                          } catch (err: unknown) {
                            console.error(err);
                            const errorObj = err as { code?: string; message?: string };
                            if (errorObj?.code === "auth/popup-closed-by-user") {
                              return;
                            }
                            if (errorObj?.code === "auth/unauthorized-domain") {
                              const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
                              setGoogleError(
                                `Domain "${host}" is not authorized. Add "${host}" to Authorized domains in Firebase Console.`
                              );
                              return;
                            }
                            const errMsg = errorObj?.message || "Google sign-in failed. Please try again.";
                            setGoogleError(errMsg);
                          } finally {
                            setIsGoogleLoading(false);
                          }
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/15 text-xs text-white flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                      >
                        {isGoogleLoading ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <GoogleLogo className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isGoogleLoading ? "Connecting to Google..." : "1-Click Sign-In with Google"}
                        </span>
                      </button>

                      {googleError && (
                        <p className="text-[11px] text-red-400 font-mono">{googleError}</p>
                      )}

                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-white/[0.08]"></div>
                        <span className="flex-shrink mx-2 text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                          Or register with password
                        </span>
                        <div className="flex-grow border-t border-white/[0.08]"></div>
                      </div>

                      {createAccountOnBook && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-zinc-400">
                              Preferred Handle
                            </label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-zinc-500 font-mono">
                                @
                              </span>
                              <input
                                type="text"
                                value={accountUsername}
                                onChange={(e) => setAccountUsername(e.target.value)}
                                placeholder="e.g. maya_ink"
                                className="w-full pl-7 pr-3 py-2.5 bg-zinc-950 rounded-xl text-xs text-white border border-white/10 focus:border-white/30 focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-zinc-400">
                              Password
                            </label>
                            <input
                              type="password"
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full px-3.5 py-2.5 bg-zinc-950 rounded-xl text-xs text-white border border-white/10 focus:border-white/30 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email *"
                      className="px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none"
                    />
                  </div>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number (Optional)"
                    className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special requests, allergies, or design notes..."
                    className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-zinc-200 active:scale-98 transition-all shadow-xl shadow-white/10"
                  >
                    Confirm & Reserve Appointment ($50 Hold)
                  </button>
                  <p className="text-center text-[11px] text-zinc-500 mt-2.5">
                    Free reschedule up to 48 hours prior • Certified professional studio hygiene
                  </p>
                </div>
              </form>

              {/* Right Column: Live Sticky Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                <div className="p-6 rounded-3xl bg-zinc-950 border border-white/[0.1] shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <span className="text-xs uppercase font-semibold tracking-wider text-zinc-400">
                      Live Booking Summary
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-white/[0.08] text-zinc-300 rounded border border-white/10">
                      Draft
                    </span>
                  </div>

                  {/* Preview Image or Icon */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.08]">
                    {!isCustom && selectedTattoo ? (
                      <Image
                        src={selectedTattoo.imageUrl}
                        alt={selectedTattoo.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 p-4 text-center">
                        <Sparkles className="w-8 h-8 mb-2 text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-300">
                          Custom Artwork Session
                        </span>
                        <span className="text-[11px] text-zinc-500 mt-0.5">
                          Artist will sketch prior to appointment
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details list */}
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Design</span>
                      <span className="font-semibold text-zinc-200 truncate max-w-[200px]">
                        {isCustom ? customTitle || "Custom Design" : selectedTattoo?.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Placement</span>
                      <span className="font-semibold text-zinc-200">{placement}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Size & Sizing</span>
                      <span className="font-semibold text-zinc-200">{size}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Scheduled Date</span>
                      <span className="font-semibold text-zinc-200">
                        {selectedDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Time Slot</span>
                      <span className="font-semibold text-zinc-200">
                        {selectedTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Estimated Duration</span>
                      <span className="font-semibold text-zinc-200">
                        2.5 – 4.0 Hours
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold">Deposit Hold</span>
                      </div>
                      <span className="text-sm font-bold text-white">$50.00</span>
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-2 text-zinc-300 font-medium">
                      <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Studio Peace of Mind</span>
                    </div>
                    <ul className="space-y-1 list-disc list-inside text-zinc-400">
                      <li>Single-use sterilized needles & vegan inks</li>
                      <li>Consultation & stencil check included</li>
                      <li>Detailed aftercare kit and healing support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
