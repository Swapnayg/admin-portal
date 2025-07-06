// app/api/vendors/reactivate-vendor/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const body = await req.formData();
  const id = Number(body.get("id"));

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });
  }

  await prisma.vendor.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return NextResponse.redirect(new URL("/vendors", req.url));
}
