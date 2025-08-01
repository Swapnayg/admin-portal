// app/api/app/vendor/contact/update/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const { name, email, phone, designation } = await req.json();

    const updatedUser = await prisma.vendor.update({
      where: { userId: user.userId },
      data: {
        contactName: name,
        contactEmail: email,
        contactPhone: phone,
        designation: designation,
      },
      select: {
        id: true,
        contactName: true,
        contactEmail: true,
        contactPhone: true,
        designation: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Contact details updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('[Update Contact Error]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});
