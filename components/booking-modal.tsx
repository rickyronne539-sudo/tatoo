"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarPlus,
  Info,
  UserCheck,
  User,
} from "lucide-react";
import { Tattoo, PLACEMENTS } from "@/lib/sample-tattoos";
import { useAuth } from "@/lib/auth-context";

export interface BookingData {
  tattoo?: Tattoo | null;
  customTitle?: string;
  placement: string;
  size: "Small (2-3 in)" | "Medium (4-6 in)" | "Large (7-10 in)" | "Full Area / Sleeve";
  colorMode: "Black & Grey" | "Full Color" | "Fine Line Monochrome";
  date: string;
  timeSlot: string;
  sessionType: "Studio Appointment" | "Design Consultation";
  fullName: string;
  email: string;
  phone: string;
  isFirstTattoo: boolean;
  notes: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTattoo?: Tattoo | null;
}

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

export function BookingModal({
  isOpen,
  onClose,
  initialTattoo = null,
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Suggested upcoming dates (next 5 days)
  const availableDates = [
    { label: "Tomorrow", date: "Sep 8, 2026", day: "Tue" },
    { label: "Wed", date: "Sep 9, 2026", day: "Wed" },
    { label: "Thu", date: "Sep 10, 2026", day: "Thu" },
    { label: "Fri", date: "Sep 11, 2026", day: "Fri" },
    { label: "Sat", date: "Sep 12, 2026", day: "Sat" },
    { label: "Sun", date: "Sep 13, 2026", day: "Sun" },
  ];

  const timeSlots = [
    { time: "10:00 AM", period: "Morning", popular: true },
    { time: "1:30 PM", period: "Afternoon", popular: false },
    { time: "4:00 PM", period: "Late Afternoon", popular: true },
    { time: "6:30 PM", period: "Evening", popular: false },
  ];

  const { user, register: authRegister, addBooking, recordAdminBooking, loginWithGoogle } = useAuth();
  const [createAccountOnBook, setCreateAccountOnBook] = useState(true);
  const [accountUsername, setAccountUsername] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [registeredHandle, setRegisteredHandle] = useState("");

  const [bookingData, setBookingData] = useState<BookingData>({
    tattoo: initialTattoo,
    customTitle: initialTattoo ? initialTattoo.title : "Custom Tattoo Project",
    placement: initialTattoo ? initialTattoo.placement : "Forearm",
    size: "Medium (4-6 in)",
    colorMode: initialTattoo?.style === "Color" ? "Full Color" : "Black & Grey",
    date: availableDates[0].date,
    timeSlot: "1:30 PM",
    sessionType: "Studio Appointment",
    fullName: user ? user.name : "",
    email: user ? user.email : "",
    phone: "",
    isFirstTattoo: false,
    notes: "",
  });

  // Pre-fill user data if logged in
  React.useEffect(() => {
    if (user) {
      setBookingData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  const [bookingRef, setBookingRef] = useState<string>("");

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => (prev + 1) as 2 | 3);
    } else if (step === 3) {
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const code = `TAT-${randomCode}`;
      setBookingRef(code);

      let activeHandle = user?.username || "";
      if (!user && createAccountOnBook && bookingData.email) {
        const preferredUsername =
          accountUsername.trim() ||
          bookingData.fullName.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
          bookingData.email.split("@")[0];
        const newUser = authRegister(
          bookingData.fullName,
          preferredUsername,
          bookingData.email,
          bookingData.tattoo?.style
        );
        activeHandle = newUser.username;
      }
      setRegisteredHandle(activeHandle);

      addBooking({
        ref: code,
        pieceTitle: bookingData.tattoo
          ? bookingData.tattoo.title
          : bookingData.customTitle || "Custom Tattoo Project",
        date: bookingData.date,
        time: bookingData.timeSlot,
        placement: bookingData.placement,
        deposit: 50,
      });

      recordAdminBooking({
        ref: code,
        clientName: bookingData.fullName || user?.name || "Client",
        clientEmail: bookingData.email || user?.email || "client@tattoo.community",
        clientAvatar: user?.avatarUrl,
        clientUsername: activeHandle,
        tattooTitle: bookingData.tattoo
          ? bookingData.tattoo.title
          : bookingData.customTitle || "Custom Bespoke Design",
        tattooImage:
          bookingData.tattoo?.imageUrl ||
          "https://images.unsplash.com/photo-1590246814883-5783515f4835?auto=format&fit=crop&w=400&q=80",
        style: bookingData.tattoo?.style || "Bespoke Concept",
        placement: bookingData.placement,
        size: bookingData.size,
        date: bookingData.date,
        time: bookingData.timeSlot,
        sessionType: bookingData.sessionType,
        depositPaid: 50,
        estimatedTotal: bookingData.size.includes("Full") ? 680 : bookingData.size.includes("Large") ? 420 : 280,
        status: "deposit_held",
        notes: bookingData.notes || (bookingData.isFirstTattoo ? "First tattoo collector." : undefined),
      });

      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={resetAndClose}
    >
      <div
        className="relative w-full max-w-2xl bg-zinc-950 border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Progress Steps */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-zinc-900/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Step {step} of 4</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {step === 1 && "Design, Placement & Sizing"}
              {step === 2 && "Schedule Date & Time"}
              {step === 3 && "Your Contact & Details"}
              {step === 4 && "Booking Confirmed"}
            </h2>
          </div>

          <button
            onClick={resetAndClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar indicator */}
        <div className="w-full bg-zinc-900 h-1">
          <div
            className="bg-white h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Wizard Body */}
        <form onSubmit={handleNextStep} className="p-5 sm:p-7 space-y-6">
          {/* STEP 1: Design & Sizing */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Selected Design Preview banner */}
              {bookingData.tattoo ? (
                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                    <Image
                      src={bookingData.tattoo.imageUrl}
                      alt={bookingData.tattoo.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                      {bookingData.tattoo.style}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate mt-1">
                      {bookingData.tattoo.title}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      By @{bookingData.tattoo.author.username} • Default: {bookingData.tattoo.placement}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Project / Concept Title
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.customTitle}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        customTitle: e.target.value,
                      })
                    }
                    placeholder="e.g. Custom Botanical Floral Sleeve"
                    className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none"
                  />
                </div>
              )}

              {/* Placement selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Target Placement on Body
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {PLACEMENTS.map((place) => (
                    <button
                      key={place}
                      type="button"
                      onClick={() =>
                        setBookingData({ ...bookingData, placement: place })
                      }
                      className={`py-2 px-3 text-xs font-medium rounded-xl border text-left flex items-center gap-2 transition-all ${
                        bookingData.placement === place
                          ? "bg-white text-black font-semibold border-white"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{place}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Approximate Size */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Estimated Sizing
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Small (2-3 in)",
                    "Medium (4-6 in)",
                    "Large (7-10 in)",
                    "Full Area / Sleeve",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          size: s as BookingData["size"],
                        })
                      }
                      className={`p-3 text-xs font-medium rounded-xl border text-left transition-all ${
                        bookingData.size === s
                          ? "bg-white text-black font-semibold border-white"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color style */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Color Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Black & Grey",
                    "Full Color",
                    "Fine Line Monochrome",
                  ].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          colorMode: mode as BookingData["colorMode"],
                        })
                      }
                      className={`py-2.5 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                        bookingData.colorMode === mode
                          ? "bg-white text-black font-semibold border-white"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.08]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Scheduling */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Session Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Appointment Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      type: "Studio Appointment",
                      desc: "In-person tattooing session",
                    },
                    {
                      type: "Design Consultation",
                      desc: "Virtual or studio sketch review (30 min)",
                    },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          sessionType: item.type as BookingData["sessionType"],
                        })
                      }
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        bookingData.sessionType === item.type
                          ? "bg-white text-black font-semibold border-white"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.type}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          bookingData.sessionType === item.type
                            ? "text-zinc-700"
                            : "text-zinc-500"
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-zinc-400">
                    Preferred Date
                  </span>
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {bookingData.date}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {availableDates.map((item) => (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() =>
                        setBookingData({ ...bookingData, date: item.date })
                      }
                      className={`py-3 px-2 rounded-xl border text-center transition-all ${
                        bookingData.date === item.date
                          ? "bg-white text-black border-white"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold opacity-80">
                        {item.day}
                      </div>
                      <div className="text-xs font-bold mt-1">
                        {item.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          timeSlot: slot.time,
                        })
                      }
                      className={`py-3 px-3 rounded-xl border text-center relative transition-all ${
                        bookingData.timeSlot === slot.time
                          ? "bg-white text-black font-bold border-white"
                          : "bg-zinc-900 text-zinc-300 border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{slot.time}</span>
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          bookingData.timeSlot === slot.time
                            ? "text-zinc-700"
                            : "text-zinc-500"
                        }`}
                      >
                        {slot.period}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Client Details */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Account status or quick registration card */}
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
                    1-Click Auto-Fill
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
                  {/* Google 1-Click Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const u = await loginWithGoogle();
                        setBookingData((prev) => ({
                          ...prev,
                          fullName: u.name,
                          email: u.email,
                        }));
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/15 text-xs text-white flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                  >
                    <GoogleLogo className="w-3.5 h-3.5" />
                    <span>1-Click Sign-In with Google</span>
                  </button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.fullName}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="e.g. Maya Lin"
                    className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingData.email}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        email: e.target.value,
                      })
                    }
                    placeholder="maya@example.com"
                    className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none"
                />
              </div>

              {/* First Tattoo checkbox */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">
                    Is this your first tattoo?
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    We will allow extra buffer time for consultation & aftercare walkthrough.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={bookingData.isFirstTattoo}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      isFirstTattoo: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-zinc-700 text-white focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Special notes & requests */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Custom Ideas or Skin Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Describe any desired changes, size tweaks, or skin sensitivity considerations..."
                  className="w-full px-4 py-3 bg-zinc-900 rounded-xl text-sm text-white border border-white/10 focus:border-white/30 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Receipt */}
          {step === 4 && (
            <div className="space-y-6 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                  Booking Confirmed
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">
                  You are all set, {bookingData.fullName || "Collector"}!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md mx-auto">
                  A confirmation email with session instructions and studio details has been sent to{" "}
                  <strong className="text-zinc-200">{bookingData.email || "your email"}</strong>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-white/[0.1] text-left space-y-3.5 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="text-xs text-zinc-400">Reference ID</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {bookingRef}
                  </span>
                </div>

                {(registeredHandle || user?.username) && (
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-xs text-zinc-400">Tattoo Account</span>
                    <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      @{registeredHandle || user?.username}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Session Type</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {bookingData.sessionType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Date & Time</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {bookingData.date} at {bookingData.timeSlot}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Placement & Size</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {bookingData.placement} • {bookingData.size}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.08] pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reservation Deposit</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    $50.00 Held
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Added booking ${bookingRef} on ${bookingData.date} at ${bookingData.timeSlot} to your calendar.`);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 border border-white/10"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Add to Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons footer (Step 1-3) */}
          {step < 4 && (
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold border border-white/10 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 active:scale-95 transition-all shadow-md shadow-white/10"
              >
                <span>{step === 3 ? "Confirm Appointment" : "Next Step"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
