import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Tattoo Appointment | Marked Studio",
  description:
    "Schedule your next tattoo session or design consultation. Choose placement, style, date, and time with leading tattoo creators.",
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
