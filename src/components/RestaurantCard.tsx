"use client";

import Link from "next/link";
import { MapPin, Star, Clock, Zap, BadgeCheck } from "lucide-react";
import { Restaurant } from "@/lib/types";
import { formatTime, isHappyHourActive, priceRangeLabel } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  activeDay?: number | null;
  nowOnly?: boolean;
}

const CUISINE_COLORS: Record<string, string> = {
  Mexican: "bg-orange-100 text-orange-700",
  American: "bg-blue-100 text-blue-700",
  "Asian Fusion": "bg-purple-100 text-purple-700",
  Japanese: "bg-red-100 text-red-700",
  French: "bg-pink-100 text-pink-700",
  Southern: "bg-yellow-100 text-yellow-700",
  "Cocktail Bar": "bg-indigo-100 text-indigo-700",
  "Dive Bar": "bg-gray-100 text-gray-700",
  "Beer Garden": "bg-green-100 text-green-700",
  Brewery: "bg-amber-100 text-amber-700",
  BBQ: "bg-red-100 text-red-700",
  Vegetarian: "bg-green-100 text-green-700",
};

export default function RestaurantCard({ restaurant, activeDay, nowOnly }: RestaurantCardProps) {
  const now = new Date();
  const today = now.getDay();

  const activeHH = restaurant.happyHours.find((hh) => {
    if (nowOnly) {
      return (hh.dayOfWeek === today || hh.dayOfWeek === -1) && isHappyHourActive(hh.startTime, hh.endTime);
    }
    if (activeDay !== null && activeDay !== undefined) {
      return hh.dayOfWeek === activeDay || hh.dayOfWeek === -1;
    }
    return hh.dayOfWeek === today || hh.dayOfWeek === -1;
  });

  const isNowActive =
    activeHH && (activeHH.dayOfWeek === today || activeHH.dayOfWeek === -1) &&
    isHappyHourActive(activeHH.startTime, activeHH.endTime);

  const cuisineColor = CUISINE_COLORS[restaurant.cuisine] || "bg-gray-100 text-gray-700";
  const tagList = restaurant.tags.slice(0, 4).map((t) => t.tag);

  return (
    <Link href={`/restaurant/${restaurant.slug}`}>
      <div
        className={`group bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
          restaurant.featured ? "border-orange-300 shadow-md" : "border-gray-100 hover:border-orange-200"
        }`}
      >
        {/* Cover image area */}
        <div className="relative h-40 bg-gradient-to-br from-orange-400 to-amber-500 overflow-hidden">
          {restaurant.featured && (
            <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star size={10} fill="white" /> Featured
            </div>
          )}
          {isNowActive && (
            <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live Now
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 text-7xl font-black">{restaurant.name[0]}</span>
          </div>
          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
              {restaurant.verified && (
                <BadgeCheck size={14} className="inline ml-1 text-blue-500" />
              )}
            </h3>
            <span className="text-xs text-gray-400 flex-shrink-0">{priceRangeLabel(restaurant.priceRange)}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cuisineColor}`}>
              {restaurant.cuisine}
            </span>
            <div className="flex items-center gap-0.5 text-xs text-gray-500">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="font-medium text-gray-700">{restaurant.rating}</span>
              <span>({restaurant.reviewCount.toLocaleString()})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin size={11} />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>

          {activeHH && (
            <div className="bg-orange-50 rounded-xl p-3 mb-3 border border-orange-100">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock size={12} className="text-orange-500" />
                <span className="text-xs font-semibold text-orange-700">
                  {activeHH.label || "Happy Hour"}
                </span>
                <span className="text-xs text-orange-600 ml-auto">
                  {formatTime(activeHH.startTime)} – {formatTime(activeHH.endTime)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {activeHH.items.slice(0, 3).map((item) => (
                  <span key={item.id} className="text-xs bg-white border border-orange-100 rounded-lg px-2 py-0.5 text-gray-700">
                    {item.salePrice ? `$${item.salePrice}` : item.discount || ""} {item.name}
                  </span>
                ))}
                {activeHH.items.length > 3 && (
                  <span className="text-xs text-orange-500">+{activeHH.items.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {tagList.map((tag) => (
              <span key={tag.id} className="text-xs text-gray-500 flex items-center gap-0.5">
                {tag.icon}
                <span>{tag.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
