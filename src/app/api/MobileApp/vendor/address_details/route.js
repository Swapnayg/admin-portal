// app/api/app/vendor/address/update/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { phone, address, city, state, zipcode } = body;

    const updatedVendor = await prisma.vendor.update({
      where: { id: user.vendorId },
      data: {
        phone,
        address,
        city,
        state,
        zipcode,
      },
      select: {
        id: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipcode: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Vendor address updated successfully',
      data: updatedVendor,
    });
  } catch (error) {
    console.error('[Vendor Update Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
