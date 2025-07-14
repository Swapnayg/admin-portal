import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  const read = searchParams.get("read") === "true";

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const updated = await prisma.notification.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json({ success: true, notification: updated });
  } catch (error) {
    console.error("Failed to update notification status", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
