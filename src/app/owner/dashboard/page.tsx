"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap, TrendingUp, Users, Clock, ChevronRight, Plus,
  Beer, Send, CheckCircle, AlertTriangle, BarChart3, Star
} from "lucide-react";
import { Restaurant } from "@/lib/types";
import { formatTime } from "@/lib/utils";

const TIERS = {
  free: { label: "Free", color: "bg-gray-100 text-gray-600" },
  standard: { label: "Standard", color: "bg-blue-100 text-blue-700" },
  premium: { label: "Premium", color: "bg-orange-100 text-orange-700" },
};

function StatCard({ icon, label, value, sub, color = "orange" }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
        color === "green" ? "bg-green-50 text-green-600" :
        color === "blue" ? "bg-blue-50 text-blue-600" :
        color === "purple" ? "bg-purple-50 text-purple-600" :
        "bg-orange-50 text-orange-600"
      }`}>
        {icon}
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function OwnerDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [flashForm, setFlashForm] = useState({ message: "", discount: "", validHours: 2, radius: 5 });
  const [flashSent, setFlashSent] = useState(false);
  const [flashSending, setFlashSending] = useState(false);

  useEffect(() => {
    fetch("/api/restaurants")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRestaurants(data);
          // Default to first featured/premium restaurant for demo
          const premier = data.find((r: Restaurant) => r.featured) || data[0];
          setSelectedRestaurant(premier);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sendFlashAlert = async () => {
    if (!selectedRestaurant || !flashForm.message) return;
    setFlashSending(true);
    try {
      await fetch("/api/flash-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          ...flashForm,
        }),
      });
      setFlashSent(true);
      setFlashForm({ message: "", discount: "", validHours: 2, radius: 5 });
      setTimeout(() => setFlashSent(false), 5000);
    } catch {
      // handle error
    } finally {
      setFlashSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Owner Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your listing and drive traffic with flash deals</p>
        </div>
        <Link
          href="/advertise"
          className="flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
        >
          <TrendingUp size={15} /> Upgrade Plan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users size={20} />} label="Profile Views" value="1,284" sub="Last 30 days" color="blue" />
        <StatCard icon={<Zap size={20} />} label="Flash Alerts Sent" value="12" sub="This month" color="orange" />
        <StatCard icon={<TrendingUp size={20} />} label="Avg. Accuracy Score" value="94%" sub="Based on user reports" color="green" />
        <StatCard icon={<Star size={20} />} label="Avg. Rating" value={selectedRestaurant?.rating || "—"} sub={`${(selectedRestaurant?.reviewCount || 0).toLocaleString()} reviews`} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Restaurant */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Beer size={16} className="text-orange-500" /> Your Venues
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {restaurants.slice(0, 10).map((r) => {
                const tier = TIERS[r.tier as keyof typeof TIERS] || TIERS.free;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRestaurant(r)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      selectedRestaurant?.id === r.id
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-100 hover:border-orange-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {r.name[0]}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tier.color}`}>
                        {tier.label}
                      </span>
                      <ChevronRight size={14} className="text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors">
              <Plus size={15} /> Add New Venue
            </button>
          </div>

          {/* Happy Hours for selected restaurant */}
          {selectedRestaurant && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" /> Happy Hour Schedule
                </h2>
                <Link
                  href={`/restaurant/${selectedRestaurant.slug}`}
                  className="text-xs text-orange-500 hover:underline"
                >
                  View public page →
                </Link>
              </div>

              {selectedRestaurant.happyHours.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-sm mb-3">No happy hours set up yet</p>
                  <button className="text-sm bg-orange-500 text-white px-4 py-2 rounded-full">Add Happy Hour</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedRestaurant.happyHours.map((hh) => (
                    <div key={hh.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {hh.dayOfWeek === -1 ? "Every Day" : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][hh.dayOfWeek]} — {hh.label || "Happy Hour"}
                        </p>
                        <p className="text-xs text-gray-500">{formatTime(hh.startTime)} – {formatTime(hh.endTime)} · {hh.items.length} items</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${hh.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                        <button className="text-xs text-orange-500 hover:underline">Edit</button>
                      </div>
                    </div>
                  ))}
                  <button className="mt-2 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors">
                    <Plus size={14} /> Add Another Time Slot
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Verification status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-orange-500" /> Listing Health
            </h2>
            <div className="space-y-3">
              {[
                { label: "Business claimed", done: true },
                { label: "Happy hours added", done: (selectedRestaurant?.happyHours.length || 0) > 0 },
                { label: "Menu items detailed", done: true },
                { label: "Phone number verified", done: !!selectedRestaurant?.phone },
                { label: "Photos uploaded", done: false },
                { label: "Listing verified by HappyHour team", done: selectedRestaurant?.verified },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${done ? "text-gray-700" : "text-gray-500"}`}>{label}</span>
                  {!done && <span className="ml-auto text-xs text-orange-500 hover:underline cursor-pointer">Fix</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Flash Alert */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={20} fill="white" />
              <h2 className="font-black text-lg">Flash Alert</h2>
            </div>
            <p className="text-white/80 text-xs mb-4">
              Slow night? Blast a deal to people near your bar right now.
            </p>

            {flashSent ? (
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <CheckCircle size={32} className="mx-auto mb-2" />
                <p className="font-bold">Alert Sent!</p>
                <p className="text-xs text-white/80 mt-1">Notified ~50 people within {flashForm.radius} miles</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Venue</label>
                  <select
                    value={selectedRestaurant?.id || ""}
                    onChange={(e) => {
                      const r = restaurants.find((r) => r.id === e.target.value);
                      if (r) setSelectedRestaurant(r);
                    }}
                    className="w-full bg-white/20 border border-white/30 text-white rounded-xl px-3 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {restaurants.slice(0, 10).map((r) => (
                      <option key={r.id} value={r.id} className="text-gray-900">{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Message</label>
                  <textarea
                    value={flashForm.message}
                    onChange={(e) => setFlashForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="e.g. Come in now! Half off all margaritas for the next 2 hours."
                    rows={3}
                    className="w-full bg-white/20 border border-white/30 text-white rounded-xl px-3 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Deal Label (optional)</label>
                  <input
                    type="text"
                    value={flashForm.discount}
                    onChange={(e) => setFlashForm((f) => ({ ...f, discount: e.target.value }))}
                    placeholder="e.g. 50% off drinks"
                    className="w-full bg-white/20 border border-white/30 text-white rounded-xl px-3 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1">Valid for</label>
                    <select
                      value={flashForm.validHours}
                      onChange={(e) => setFlashForm((f) => ({ ...f, validHours: Number(e.target.value) }))}
                      className="w-full bg-white/20 border border-white/30 text-white rounded-xl px-3 py-2 text-sm focus:outline-none"
                    >
                      {[1, 2, 3, 4].map((h) => (
                        <option key={h} value={h} className="text-gray-900">{h}hr{h > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/80 block mb-1">Radius</label>
                    <select
                      value={flashForm.radius}
                      onChange={(e) => setFlashForm((f) => ({ ...f, radius: Number(e.target.value) }))}
                      className="w-full bg-white/20 border border-white/30 text-white rounded-xl px-3 py-2 text-sm focus:outline-none"
                    >
                      {[1, 2, 5, 10].map((r) => (
                        <option key={r} value={r} className="text-gray-900">{r}mi</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 text-xs text-white/80">
                  <p className="font-semibold text-white mb-1">Estimated reach</p>
                  <p>~50 opted-in users · <span className="font-bold text-white">~$7.50</span> estimated cost</p>
                  <p className="mt-1">($0.15 per notification)</p>
                </div>

                <button
                  onClick={sendFlashAlert}
                  disabled={flashSending || !flashForm.message || !selectedRestaurant}
                  className="w-full flex items-center justify-center gap-2 bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={15} />
                  {flashSending ? "Sending..." : "Send Flash Alert"}
                </button>
              </div>
            )}
          </div>

          {/* Upgrade CTA */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Upgrade for More Power</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p className="flex items-center gap-2"><span className="text-orange-500">✓</span> 5 flash alerts/month</p>
              <p className="flex items-center gap-2"><span className="text-orange-500">✓</span> Priority search placement</p>
              <p className="flex items-center gap-2"><span className="text-orange-500">✓</span> Customer analytics</p>
              <p className="flex items-center gap-2"><span className="text-orange-500">✓</span> Featured badge</p>
            </div>
            <Link
              href="/advertise"
              className="block w-full text-center text-sm font-semibold bg-orange-500 text-white py-2.5 rounded-full hover:bg-orange-600 transition-colors"
            >
              View Plans →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
