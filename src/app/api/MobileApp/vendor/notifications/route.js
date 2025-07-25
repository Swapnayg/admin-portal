import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            message: true,
            type: true,
            isRead: true,
            createdAt: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    const unreadCount = vendor.notifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      vendorId: vendor.id,
      unreadCount,
      notifications: vendor.notifications,
    });
  } catch (error) {
    console.error('[Get Vendor Notifications Error]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
