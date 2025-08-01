// app/api/app/vendor/business/update/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { businessName, gst, website } = body;

    const updatedVendor = await prisma.vendor.update({
      where: { userId: user.userId },
      data: {
        businessName,
        gstNumber:gst,
        website,
      },
      select: {
        id: true,
        businessName: true,
        gstNumber: true,
        website: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Vendor business details updated successfully',
      data: updatedVendor,
    });
  } catch (error) {
    console.error('[Business Update Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
