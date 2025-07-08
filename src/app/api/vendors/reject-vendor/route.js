// app/api/vendors/reject/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
import { sendRejectionEmail } from '@/lib/vendor-mails';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const id = formData.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 });
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: parseInt(id) },
      data: { status: 'REJECTED' },
      include: { user: true }, 
    });

    const email = updatedVendor.user?.email;
    console.log("Email:", email);

    if (email) {
      console.log("into the mail");
      await sendRejectionEmail(email);
    }

    return NextResponse.redirect(new URL("/vendors", req.url)); 
  } catch (error) {
    console.error('Reject Vendor Error:', error);
    return NextResponse.json({ error: 'Failed to reject vendor' }, { status: 500 });
  }
}
