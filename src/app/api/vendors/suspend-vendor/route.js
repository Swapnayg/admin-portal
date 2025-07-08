// app/api/vendors/suspend-vendor/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendSuspensionEmail } from '@/lib/vendor-mails';

export async function POST(req) {
  try {
    const body = await req.formData();
    const id = Number(body.get("id"));

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: { status: "SUSPENDED" },
      include: { user: true }, 
    });

    const email = updatedVendor.user?.email;

    if (email) {
      await sendSuspensionEmail(email);
    }

    return NextResponse.redirect(new URL("/vendors", req.url)); 
  } catch (error) {
    console.error('Suspend Vendor Error:', error);
    return NextResponse.json({ error: 'Failed to suspend vendor' }, { status: 500 });
  }
}
