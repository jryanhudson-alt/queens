"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Map, List, SlidersHorizontal, X } from "lucide-react";
import DaySelector from "@/components/DaySelector";
import RestaurantCard from "@/components/RestaurantCard";
import FilterSidebar from "@/components/FilterSidebar";
import MapView from "@/components/MapView";
import { Restaurant, Tag, DAY_NAMES } from "@/lib/types";

function HomeContent() {
  const searchParams = useSearchParams();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    day: null as number | null,
    nowOnly: searchParams.get("now") === "true",
    tags: [] as string[],
    cuisine: [] as string[],
    priceRange: [] as number[],
    search: "",
  });

  useEffect(() => {
    fetch("/api/tags").then((r) => r.json()).then(setTags).catch(() => {});
  }, []);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.day !== null) params.set("day", String(filters.day));
    if (filters.nowOnly) params.set("now", "true");
    if (filters.search) params.set("search", filters.search);
    filters.tags.forEach((t) => params.append("tag", t));
    filters.cuisine.forEach((c) => params.append("cuisine", c));
    filters.priceRange.forEach((p) => params.append("price", String(p)));

    try {
      const res = await fetch(`/api/restaurants?${params}`);
      const data = await res.json();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  const updateFilter = (key: string, value: unknown) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const title = filters.nowOnly
    ? "Happening Right Now"
    : filters.day !== null
    ? `Happy Hours on ${DAY_NAMES[filters.day]}`
    : "All Happy Hours";

  const activeFilterCount =
    filters.tags.length + filters.cuisine.length + filters.priceRange.length;

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Filter sidebar — desktop */}
      <div className="hidden lg:flex w-64 flex-shrink-0 border-r border-gray-100 bg-white overflow-y-auto">
        <FilterSidebar
          tags={tags}
          filters={filters}
          onFilterChange={updateFilter}
          resultCount={restaurants.length}
        />
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative ml-auto w-80 max-w-full bg-white h-full shadow-xl overflow-y-auto">
            <FilterSidebar
              tags={tags}
              filters={filters}
              onFilterChange={updateFilter}
              resultCount={restaurants.length}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bars, restaurants, cuisines..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
            {filters.search && (
              <button
                onClick={() => updateFilter("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <DaySelector
            selected={filters.day}
            nowOnly={filters.nowOnly}
            onDayChange={(d) => { updateFilter("day", d); updateFilter("nowOnly", false); }}
            onNowToggle={() => { updateFilter("nowOnly", !filters.nowOnly); updateFilter("day", null); }}
          />
        </div>

        {/* Toolbar */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-500 border border-gray-200 rounded-full px-3 py-1"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-orange-500 text-white text-xs px-1.5 rounded-full">{activeFilterCount}</span>
              )}
            </button>
            <h2 className="text-sm font-semibold text-gray-700">
              {loading ? "Loading..." : (
                <><span className="text-orange-500">{restaurants.length}</span> {title}</>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                view === "list" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              <List size={13} /> List
            </button>
            <button
              onClick={() => setView("map")}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                view === "map" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              <Map size={13} /> Map
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {view === "map" ? (
            <div className="h-full p-3">
              <MapView
                restaurants={restaurants}
                selectedId={selectedRestaurant}
                onSelect={(r) => setSelectedRestaurant(r.id)}
              />
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse">
                      <div className="h-40 bg-gray-100 rounded-t-2xl" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : restaurants.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <span className="text-5xl mb-4">🍺</span>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">No happy hours found</h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Try adjusting your filters or selecting a different day.
                  </p>
                  <button
                    onClick={() => setFilters({ day: null, nowOnly: false, tags: [], cuisine: [], priceRange: [], search: "" })}
                    className="mt-4 text-sm text-orange-500 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                  {restaurants.map((r) => (
                    <RestaurantCard
                      key={r.id}
                      restaurant={r}
                      activeDay={filters.day}
                      nowOnly={filters.nowOnly}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
