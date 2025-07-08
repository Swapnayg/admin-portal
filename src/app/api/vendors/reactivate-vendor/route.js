// app/api/vendors/reactivate-vendor/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendReactivationEmail } from '@/lib/vendor-mails';

export async function POST(req) {
  const body = await req.formData();
  const id = Number(body.get("id"));

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });
  }

  const vendor = await prisma.vendor.update({
    where: { id },
    data: { status: "APPROVED" },
    include: { user: true }, 
  });

  const username = vendor.user?.username || vendor.user?.email;
  const email = vendor.user?.email;
  const password = vendor.user?.tempPassword; // Store this only temporarily (for initial email)
  
  if (email && username && password) {
    await sendReactivationEmail(email, username, password);
  }
  

  return NextResponse.redirect(new URL("/vendors", req.url));
}
