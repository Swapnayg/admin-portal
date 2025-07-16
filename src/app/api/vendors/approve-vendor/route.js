import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendApprovalEmail } from '@/lib/vendor-mails';
import { auth } from '@/lib/firebase-admin';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const id = formData.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 });
    }

    const vendor = await prisma.vendor.update({
      where: { id: parseInt(id.toString()) },
      data: { status: 'APPROVED' },
      include: { user: true },
    });

    const username = vendor.user?.username || vendor.user?.email;
    const email = vendor.user?.email;
    const password = vendor.user?.tempPassword;

    if (email && username && password) {
      let userExists = false;

      try {
        await auth.getUserByEmail(email);
        userExists = true;
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          userExists = false;
        } else {
          console.error('Firebase Auth Check Error:', error);
          throw error;
        }
      }

      // ✅ Create only if not exists
      if (!userExists) {
        await auth.createUser({
          email,
          password,
          displayName: username,
        });
      }

      // ✅ Send approval email
      await sendApprovalEmail(email, username, password);
    }

    return NextResponse.redirect(new URL('/vendors', req.url));
  } catch (error) {
    console.error('Approve Vendor Error:', error);
    return NextResponse.json({ error: 'Failed to approve vendor' }, { status: 500 });
  }
}
