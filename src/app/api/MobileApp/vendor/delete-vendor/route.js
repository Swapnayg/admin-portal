import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const DELETE = withRole(['VENDOR'], async (req, user) => {
  try {
    // Find the vendor
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.id },
    });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // Mark the vendor as inactive and set deactivatedAt to now
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Vendor deactivation scheduled. Account will be deleted after 15–30 days.',
    });
  } catch (error) {
    console.error('[deactivate-vendor] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
