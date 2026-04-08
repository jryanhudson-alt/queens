import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const day = searchParams.get("day");
  const nowOnly = searchParams.get("now") === "true";
  const tags = searchParams.getAll("tag");
  const cuisine = searchParams.getAll("cuisine");
  const price = searchParams.getAll("price").map(Number).filter(Boolean);
  const search = searchParams.get("search") || "";

  const now = new Date();
  const todayDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { cuisine: { contains: search } },
      { address: { contains: search } },
    ];
  }

  if (cuisine.length) {
    where.cuisine = { in: cuisine };
  }

  if (price.length) {
    where.priceRange = { in: price };
  }

  if (tags.length) {
    where.tags = {
      some: {
        tag: { name: { in: tags } },
      },
    };
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    include: {
      tags: { include: { tag: true } },
      happyHours: {
        where: { isActive: true },
        include: { items: true },
      },
    },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });

  // Filter by day/now after fetch since SQLite doesn't support complex time comparisons
  let filtered = restaurants;

  if (day !== null && day !== undefined && day !== "") {
    const dayNum = parseInt(day);
    filtered = filtered.filter((r) =>
      r.happyHours.some((hh) => hh.dayOfWeek === dayNum || hh.dayOfWeek === -1)
    );
  }

  if (nowOnly) {
    filtered = filtered.filter((r) =>
      r.happyHours.some((hh) => {
        const matchesDay = hh.dayOfWeek === todayDay || hh.dayOfWeek === -1;
        if (!matchesDay) return false;
        const [sh, sm] = hh.startTime.split(":").map(Number);
        const [eh, em] = hh.endTime.split(":").map(Number);
        const start = sh * 60 + sm;
        const end = eh * 60 + em;
        if (start <= end) return currentMinutes >= start && currentMinutes < end;
        return currentMinutes >= start || currentMinutes < end;
      })
    );
  }

  return NextResponse.json(filtered);
}
