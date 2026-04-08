"use client";

import { useEffect, useRef, useState } from "react";
import { Restaurant } from "@/lib/types";
import { formatTime, isHappyHourActive } from "@/lib/utils";

interface MapViewProps {
  restaurants: Restaurant[];
  onSelect?: (restaurant: Restaurant) => void;
  selectedId?: string | null;
}

// Lightweight SVG-based map placeholder (replace with Mapbox in production)
export default function MapView({ restaurants, onSelect, selectedId }: MapViewProps) {
  const [tooltip, setTooltip] = useState<{ restaurant: Restaurant; x: number; y: number } | null>(null);

  if (!restaurants.length) {
    return (
      <div className="h-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400 text-sm">No restaurants to display</p>
      </div>
    );
  }

  const lats = restaurants.map((r) => r.lat);
  const lngs = restaurants.map((r) => r.lng);
  const minLat = Math.min(...lats) - 0.005;
  const maxLat = Math.max(...lats) + 0.005;
  const minLng = Math.min(...lngs) - 0.005;
  const maxLng = Math.max(...lngs) + 0.005;

  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;

  const toX = (lng: number) => ((lng - minLng) / lngRange) * 100;
  const toY = (lat: number) => (1 - (lat - minLat) / latRange) * 100;

  const today = new Date().getDay();
  const now = new Date();

  return (
    <div className="h-full bg-slate-800 rounded-2xl overflow-hidden relative">
      {/* Map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <line x1={`${i * 10}%`} y1="0%" x2={`${i * 10}%`} y2="100%" stroke="white" strokeWidth="0.5" />
              <line x1="0%" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="white" strokeWidth="0.5" />
            </g>
          ))}
        </svg>
        {/* City label */}
        <div className="absolute bottom-4 left-4 text-white/30 text-xs font-medium">Austin, TX</div>
        <div className="absolute top-3 right-3 text-white/30 text-xs">Map View</div>
      </div>

      {/* Pins */}
      {restaurants.map((r) => {
        const x = toX(r.lng);
        const y = toY(r.lat);
        const isActive = r.happyHours.some(
          (hh) =>
            (hh.dayOfWeek === today || hh.dayOfWeek === -1) &&
            isHappyHourActive(hh.startTime, hh.endTime, now)
        );
        const isSelected = r.id === selectedId;

        return (
          <button
            key={r.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${x}%`, top: `${y}%` }}
            onMouseEnter={() => setTooltip({ restaurant: r, x, y })}
            onMouseLeave={() => setTooltip(null)}
            onClick={() => onSelect?.(r)}
          >
            <div
              className={`relative flex items-center justify-center rounded-full text-white text-xs font-bold transition-all duration-200 shadow-lg ${
                isSelected
                  ? "w-9 h-9 bg-white text-orange-600 border-2 border-orange-500 shadow-orange-400/50"
                  : isActive
                  ? "w-8 h-8 bg-green-500 border-2 border-white animate-pulse"
                  : r.featured
                  ? "w-7 h-7 bg-orange-500 border-2 border-white"
                  : "w-6 h-6 bg-slate-600 border border-slate-400 hover:bg-orange-500 hover:w-7 hover:h-7"
              }`}
            >
              {r.name[0]}
            </div>
            {isActive && !isSelected && (
              <span className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping" />
            )}
          </button>
        );
      })}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-white rounded-xl shadow-xl p-3 w-48 pointer-events-none"
          style={{
            left: `${Math.min(tooltip.x, 75)}%`,
            top: `${Math.max(tooltip.y - 20, 5)}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-bold text-gray-900 text-sm">{tooltip.restaurant.name}</p>
          <p className="text-xs text-gray-500 mb-1">{tooltip.restaurant.cuisine}</p>
          {tooltip.restaurant.happyHours.slice(0, 1).map((hh) => (
            <p key={hh.id} className="text-xs text-orange-600 font-medium">
              {formatTime(hh.startTime)} – {formatTime(hh.endTime)}
            </p>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-xl p-2 text-xs text-white space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" /> Live Now
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-500" /> Featured
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-600" /> Happy Hour
        </div>
      </div>
    </div>
  );
}
