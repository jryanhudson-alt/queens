"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { Tag } from "@/lib/types";

const CUISINES = [
  "Mexican", "American", "Asian Fusion", "Japanese", "French",
  "Southern", "Cocktail Bar", "Dive Bar", "Beer Garden", "Brewery",
  "BBQ", "Vegetarian", "Italian",
];

const PRICE_LABELS: Record<number, string> = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

interface FilterSidebarProps {
  tags: Tag[];
  filters: { tags: string[]; cuisine: string[]; priceRange: number[] };
  onFilterChange: (key: string, value: string[] | number[]) => void;
  resultCount: number;
  onClose?: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({ tags, filters, onFilterChange, resultCount, onClose }: FilterSidebarProps) {
  const tagsByCategory = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    (acc[tag.category] ||= []).push(tag);
    return acc;
  }, {});

  const toggle = (key: "tags" | "cuisine", val: string) => {
    const cur = filters[key] as string[];
    onFilterChange(key, cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val]);
  };

  const togglePrice = (val: number) => {
    const cur = filters.priceRange;
    onFilterChange("priceRange", cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val]);
  };

  const hasFilters = filters.tags.length || filters.cuisine.length || filters.priceRange.length;

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-orange-500" />
          <span className="font-semibold text-gray-900">Filters</span>
          {hasFilters ? (
            <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {Number(!!filters.tags.length) + Number(!!filters.cuisine.length) + Number(!!filters.priceRange.length)}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={() => { onFilterChange("tags", []); onFilterChange("cuisine", []); onFilterChange("priceRange", []); }}
              className="text-xs text-orange-500 hover:underline"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-4">
        <Section title="Price Range">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => togglePrice(p)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  filters.priceRange.includes(p)
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 text-gray-600 hover:border-orange-400"
                }`}
              >
                {PRICE_LABELS[p]}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Cuisine">
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((c) => (
              <button
                key={c}
                onClick={() => toggle("cuisine", c)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  filters.cuisine.includes(c)
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 text-gray-600 hover:border-orange-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>

        {Object.entries(tagsByCategory).map(([category, catTags]) => (
          <Section key={category} title={category.charAt(0).toUpperCase() + category.slice(1)}>
            <div className="flex flex-wrap gap-2">
              {catTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggle("tags", tag.name)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    filters.tags.includes(tag.name)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-200 text-gray-600 hover:border-orange-400"
                  }`}
                >
                  {tag.icon && <span>{tag.icon}</span>}
                  {tag.name}
                </button>
              ))}
            </div>
          </Section>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{resultCount}</span> happy hours found
        </p>
      </div>
    </div>
  );
}
