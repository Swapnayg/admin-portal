// app/api/vendors/approve-vendor/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendApprovalEmail } from '@/lib/vendor-mails';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const id = formData.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 });
    }

    const vendor = await prisma.vendor.update({
      where: { id: parseInt(id) },
      data: { status: 'APPROVED' },
      include: { user: true }, // Ensure `user` relation includes email, username, etc.
    });

    const username = vendor.user?.username || vendor.user?.email;
    const email = vendor.user?.email;
    const password = vendor.user?.tempPassword; // Store this only temporarily (for initial email)

    if (email && username && password) {
      await sendApprovalEmail(email, username, password);
    }

    // await prisma.user.update({
    //   where: { id: vendor.userId },
    //   data: { tempPassword: null }, // Clear after sending
    // });

    return NextResponse.redirect(new URL('/vendors', req.url));
  } catch (error) {
    console.error('Approve Vendor Error:', error);
    return NextResponse.json({ error: 'Failed to approve vendor' }, { status: 500 });
  }
}
