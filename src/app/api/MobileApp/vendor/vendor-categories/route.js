import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
    });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    const categories = await prisma.vendorCategory.findMany({
      include: {
        vendors: false, // Set to true if you want vendor details in the response
      },
    });

    return NextResponse.json({
      message: 'All vendor categories fetched successfully',
      user,
      data: categories,
    });

  } catch (error) {
    console.error('[all-orders] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
