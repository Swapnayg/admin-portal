import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const DELETE = withRole(['VENDOR'], async (req, user) => {
  try {
    // Find vendor by user ID
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.id },
    });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // Delete the vendor (this will also delete the associated user due to onDelete: Cascade)
    await prisma.vendor.delete({
      where: { id: vendor.id },
    });

    // Optional: delete the user as well (if you want full cleanup)
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({
      message: 'Vendor account deleted successfully',
    });
  } catch (error) {
    console.error('[delete-vendor] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
