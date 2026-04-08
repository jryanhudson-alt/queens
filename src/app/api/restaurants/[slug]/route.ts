import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      tags: { include: { tag: true } },
      happyHours: {
        where: { isActive: true },
        include: { items: true },
        orderBy: { dayOfWeek: "asc" },
      },
      flashAlerts: {
        where: { status: "sent", validUntil: { gte: new Date() } },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(restaurant);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json();
  const allowed = ["name", "description", "phone", "website", "instagram", "coverImage"];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }
  data.updatedAt = new Date();
  const updated = await prisma.restaurant.update({ where: { slug }, data });
  return NextResponse.json(updated);
}
