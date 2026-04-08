"use client";

import { DAY_SHORT } from "@/lib/types";

interface DaySelectorProps {
  selected: number | null;
  nowOnly: boolean;
  onDayChange: (day: number | null) => void;
  onNowToggle: () => void;
}

export default function DaySelector({ selected, nowOnly, onDayChange, onNowToggle }: DaySelectorProps) {
  const days = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <button
        onClick={onNowToggle}
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          nowOnly
            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
            : "bg-white border border-gray-200 text-gray-700 hover:border-green-400"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${nowOnly ? "bg-white animate-pulse" : "bg-green-500"}`} />
        Now
      </button>

      <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

      {days.map((day) => (
        <button
          key={day}
          onClick={() => onDayChange(selected === day ? null : day)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selected === day && !nowOnly
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
              : "bg-white border border-gray-200 text-gray-700 hover:border-orange-400"
          }`}
        >
          {DAY_SHORT[day]}
        </button>
      ))}
    </div>
  );
}
