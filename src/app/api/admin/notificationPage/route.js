import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const notifications = await prisma.notification.findMany({
      where: {
        adminId: { not: null }, // Filter only admin notifications
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: true,
        vendor: true,
        admin: true,
        customer: true,
        order: true,
        product: true,
      },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Failed to fetch admin notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
