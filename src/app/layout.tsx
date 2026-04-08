import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FlashAlertBanner from "@/components/FlashAlertBanner";

export const metadata: Metadata = {
  title: "HappyHour.app — Find Happy Hours Near You",
  description: "Discover the best happy hours in Austin. Browse by day, filter by cuisine, drinks, and vibe. Flash deals updated in real time.",
  keywords: "happy hour, Austin, bars, restaurants, drink specials, food specials",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <FlashAlertBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
