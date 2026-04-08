export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  [-1]: "Daily",
};

export const DAY_SHORT: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

export interface HHItem {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  origPrice?: number | null;
  salePrice?: number | null;
  discount?: string | null;
}

export interface HappyHour {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  label?: string | null;
  isActive: boolean;
  items: HHItem[];
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  phone?: string | null;
  website?: string | null;
  instagram?: string | null;
  cuisine: string;
  priceRange: number;
  description?: string | null;
  coverImage?: string | null;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  tier: string;
  happyHours: HappyHour[];
  tags: { tag: Tag }[];
}

export interface FlashAlert {
  id: string;
  restaurantId: string;
  message: string;
  discount?: string | null;
  validUntil: Date | string;
  radius: number;
  status: string;
  sentCount: number;
  createdAt: Date | string;
  restaurant?: Pick<Restaurant, "name" | "slug" | "cuisine" | "address">;
}

export interface FilterState {
  day: number | null;
  nowOnly: boolean;
  tags: string[];
  cuisine: string[];
  priceRange: number[];
  search: string;
}
