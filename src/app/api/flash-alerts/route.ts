import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const alerts = await prisma.flashAlert.findMany({
    where: { status: "sent", validUntil: { gte: now } },
    include: {
      restaurant: { select: { name: true, slug: true, cuisine: true, address: true, lat: true, lng: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(alerts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { restaurantId, message, discount, validHours = 2, radius = 5 } = body;

  if (!restaurantId || !message) {
    return NextResponse.json({ error: "restaurantId and message required" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

  const validUntil = new Date(Date.now() + validHours * 60 * 60 * 1000);
  const costPerNotification = 0.15;
  const estimatedRecipients = 50; // in real app, calculate from opted-in users in radius

  const alert = await prisma.flashAlert.create({
    data: {
      restaurantId,
      message,
      discount,
      validUntil,
      radius,
      status: "sent",
      cost: costPerNotification * estimatedRecipients,
      sentCount: estimatedRecipients,
    },
  });

  return NextResponse.json(alert, { status: 201 });
}
