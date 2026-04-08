"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, X, ChevronLeft, ChevronRight } from "lucide-react";

interface FlashAlert {
  id: string;
  message: string;
  discount?: string | null;
  validUntil: string;
  restaurant: { name: string; slug: string; cuisine: string; address: string };
}

export default function FlashAlertBanner() {
  const [alerts, setAlerts] = useState<FlashAlert[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/flash-alerts")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setAlerts(data))
      .catch(() => {});
  }, []);

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (!visible.length) return null;

  const alert = visible[currentIndex % visible.length];
  const timeLeft = Math.max(0, Math.round((new Date(alert.validUntil).getTime() - Date.now()) / 60000));

  return (
    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Zap size={16} fill="white" className="animate-pulse" />
          <span className="text-xs font-black tracking-wide">FLASH DEAL</span>
        </div>

        <div className="flex-1 min-w-0">
          <Link href={`/restaurant/${alert.restaurant.slug}`} className="hover:underline">
            <span className="font-semibold text-sm">{alert.restaurant.name}</span>
            {alert.discount && (
              <span className="ml-2 bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">
                {alert.discount}
              </span>
            )}
            <span className="ml-2 text-xs text-white/80 hidden sm:inline">{alert.message}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-white/80 hidden md:block">
            Ends in {timeLeft}m
          </span>

          {visible.length > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentIndex((i) => (i - 1 + visible.length) % visible.length)}>
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs">{(currentIndex % visible.length) + 1}/{visible.length}</span>
              <button onClick={() => setCurrentIndex((i) => (i + 1) % visible.length)}>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          <button
            onClick={() => setDismissed((s) => new Set([...s, alert.id]))}
            className="text-white/70 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
