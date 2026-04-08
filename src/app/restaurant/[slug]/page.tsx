"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Phone, Globe, Star, Clock, ArrowLeft, BadgeCheck,
  Zap, CheckCircle, Share2
} from "lucide-react";
import { Restaurant, DAY_NAMES } from "@/lib/types";
import { formatTime, priceRangeLabel, isHappyHourActive } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  beer: "🍺",
  wine: "🍷",
  cocktail: "🍸",
  shot: "🥃",
  food: "🍽️",
  appetizer: "🧀",
};

function HappyHourCard({ hh, isToday }: { hh: Restaurant["happyHours"][0]; isToday: boolean }) {
  const now = new Date();
  const isActive = isToday && isHappyHourActive(hh.startTime, hh.endTime, now);

  const drinkItems = hh.items.filter((i) => ["beer", "wine", "cocktail", "shot"].includes(i.category));
  const foodItems = hh.items.filter((i) => ["food", "appetizer"].includes(i.category));

  return (
    <div className={`rounded-2xl border p-4 ${isActive ? "border-green-300 bg-green-50" : "border-gray-100 bg-white"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={15} className={isActive ? "text-green-600" : "text-orange-500"} />
          <span className="font-semibold text-gray-900">{hh.label || "Happy Hour"}</span>
          {isActive && (
            <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Now
            </span>
          )}
        </div>
        <span className={`text-sm font-semibold ${isActive ? "text-green-700" : "text-orange-600"}`}>
          {formatTime(hh.startTime)} – {formatTime(hh.endTime)}
        </span>
      </div>

      {drinkItems.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Drinks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {drinkItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[item.category] || "🥤"}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  {item.salePrice != null && (
                    <p className="text-sm font-bold text-green-600">${item.salePrice}</p>
                  )}
                  {item.origPrice != null && (
                    <p className="text-xs text-gray-400 line-through">${item.origPrice}</p>
                  )}
                  {item.discount && <p className="text-xs font-semibold text-orange-600">{item.discount}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {foodItems.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Food</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {foodItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[item.category] || "🍽️"}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  {item.salePrice != null && item.salePrice > 0 && (
                    <p className="text-sm font-bold text-green-600">${item.salePrice}</p>
                  )}
                  {item.salePrice === 0 && <p className="text-sm font-bold text-green-600">FREE</p>}
                  {item.origPrice != null && (
                    <p className="text-xs text-gray-400 line-through">${item.origPrice}</p>
                  )}
                  {item.discount && <p className="text-xs font-semibold text-orange-600">{item.discount}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RestaurantPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [accuracy, setAccuracy] = useState<"helpful" | "wrong" | null>(null);

  useEffect(() => {
    fetch(`/api/restaurants/${slug}`)
      .then((r) => r.json())
      .then((data) => { setRestaurant(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-56 bg-gray-200 rounded-2xl mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h1>
        <Link href="/" className="text-orange-500 hover:underline">Browse all happy hours</Link>
      </div>
    );
  }

  const today = new Date().getDay();
  const todayHH = restaurant.happyHours.filter((hh) => hh.dayOfWeek === today || hh.dayOfWeek === -1);
  const otherHH = restaurant.happyHours.filter((hh) => hh.dayOfWeek !== today && hh.dayOfWeek !== -1);

  const groupedByDay = otherHH.reduce<Record<number, typeof otherHH>>((acc, hh) => {
    (acc[hh.dayOfWeek] ||= []).push(hh);
    return acc;
  }, {});

  const isCurrentlyActive = todayHH.some((hh) => isHappyHourActive(hh.startTime, hh.endTime));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors">
        <ArrowLeft size={15} /> Back to all happy hours
      </Link>

      {/* Hero */}
      <div className="relative h-52 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/10 text-[10rem] font-black leading-none">{restaurant.name[0]}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {restaurant.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    <BadgeCheck size={11} /> Verified
                  </span>
                )}
                {isCurrentlyActive && (
                  <span className="flex items-center gap-1 text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" /> Open Now
                  </span>
                )}
                {restaurant.featured && (
                  <span className="flex items-center gap-1 text-xs font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    <Star size={10} fill="white" /> Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-white">{restaurant.name}</h1>
              <p className="text-white/80 text-sm">{restaurant.cuisine} · {priceRangeLabel(restaurant.priceRange)} · {restaurant.address}</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Happy Hours */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's happy hours */}
          {todayHH.length > 0 && (
            <section>
              <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                Today&apos;s Happy Hours
                <span className="text-sm font-normal text-gray-500">({DAY_NAMES[today]})</span>
              </h2>
              <div className="space-y-3">
                {todayHH.map((hh) => (
                  <HappyHourCard key={hh.id} hh={hh} isToday={true} />
                ))}
              </div>
            </section>
          )}

          {/* Other days */}
          {Object.keys(groupedByDay).length > 0 && (
            <section>
              <h2 className="font-bold text-gray-900 text-lg mb-3">Other Days</h2>
              <div className="space-y-4">
                {Object.entries(groupedByDay).map(([day, hhs]) => (
                  <div key={day}>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{DAY_NAMES[Number(day)]}</p>
                    <div className="space-y-3">
                      {hhs.map((hh) => (
                        <HappyHourCard key={hh.id} hh={hh} isToday={false} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {restaurant.happyHours.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-400">No happy hour specials listed yet.</p>
            </div>
          )}

          {/* Accuracy feedback */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Were these specials accurate?</p>
            {accuracy ? (
              <p className="text-sm text-green-600 flex items-center gap-1.5">
                <CheckCircle size={15} /> Thanks for your feedback!
              </p>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setAccuracy("helpful")}
                  className="flex-1 text-sm border border-green-300 text-green-700 rounded-full py-2 hover:bg-green-50 transition-colors"
                >
                  ✓ Yes, accurate
                </button>
                <button
                  onClick={() => setAccuracy("wrong")}
                  className="flex-1 text-sm border border-red-200 text-red-600 rounded-full py-2 hover:bg-red-50 transition-colors"
                >
                  ✗ Something's off
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info sidebar */}
        <div className="space-y-4">
          {/* Ratings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(restaurant.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
              <span className="font-bold text-gray-900">{restaurant.rating}</span>
            </div>
            <p className="text-xs text-gray-500">{restaurant.reviewCount.toLocaleString()} reviews</p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Contact & Location</h3>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span>{restaurant.address}, {restaurant.city}, {restaurant.state}</span>
            </div>
            {restaurant.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-gray-400" />
                <a href={`tel:${restaurant.phone}`} className="text-orange-600 hover:underline">{restaurant.phone}</a>
              </div>
            )}
            {restaurant.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe size={14} className="text-gray-400" />
                <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline truncate">
                  Website
                </a>
              </div>
            )}
            {restaurant.instagram && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 text-xs font-bold">IG</span>
                <a href={`https://instagram.com/${restaurant.instagram}`} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                  @{restaurant.instagram}
                </a>
              </div>
            )}
          </div>

          {/* Tags */}
          {restaurant.tags.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Vibe & Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {restaurant.tags.map((t) => (
                  <span key={t.tag.id} className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-100 rounded-full px-2 py-1 text-gray-600">
                    {t.tag.icon} {t.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {restaurant.description && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{restaurant.description}</p>
            </div>
          )}

          {/* Flash alert CTA */}
          <Link href={`/owner/dashboard`} className="block">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={15} fill="white" />
                <span className="font-bold text-sm">Own this venue?</span>
              </div>
              <p className="text-xs text-white/80">Send flash alerts to drive traffic right now.</p>
              <span className="mt-2 inline-block text-xs font-semibold bg-white text-orange-600 px-3 py-1 rounded-full">
                Claim Listing →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
