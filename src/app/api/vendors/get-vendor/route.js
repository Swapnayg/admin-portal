import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const idParam = searchParams.get("id");

  const id = Number(idParam);
  if (!idParam || isNaN(id)) {
    return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      user: { select: { username: true, email: true } },
      category: true,
      zone: true,
      kycDocuments: true,
    },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  return NextResponse.json({ vendor });
}
