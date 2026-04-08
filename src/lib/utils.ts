import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${m.toString().padStart(2, "0")}${period}`;
}

export function formatPrice(price: number): string {
  return `$${price % 1 === 0 ? price : price.toFixed(2)}`;
}

export function priceRangeLabel(n: number): string {
  return "$".repeat(n);
}

export function isHappyHourActive(startTime: string, endTime: string, now?: Date): boolean {
  const d = now || new Date();
  const cur = d.getHours() * 60 + d.getMinutes();
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  if (start <= end) return cur >= start && cur < end;
  return cur >= start || cur < end;
}

export function getTodayDay(): number {
  return new Date().getDay();
}

export function getRestaurantsActiveNow(restaurants: { happyHours: { dayOfWeek: number; startTime: string; endTime: string }[] }[]): typeof restaurants {
  const now = new Date();
  const today = now.getDay();
  return restaurants.filter((r) =>
    r.happyHours.some(
      (hh) =>
        (hh.dayOfWeek === today || hh.dayOfWeek === -1) &&
        isHappyHourActive(hh.startTime, hh.endTime, now)
    )
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
