import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// One humanist-geometric family across the UI — friendlier and more distinctive
// than the usual Inter default, with heavy weights reserved for the big budget
// numbers so the type scale itself carries the product's personality.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plate — Daily Calorie & Macro Tracker",
  description:
    "Log meals in seconds and see exactly what's left of your day's calorie budget.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
