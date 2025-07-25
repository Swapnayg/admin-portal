import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const vendorId = user.vendorId;
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID not found' }, { status: 400 });
    }

    const body = await req.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      // Mark all notifications as read for this vendor
      await prisma.notification.updateMany({
        where: {
          vendorId,
          read: false,
        },
        data: {
          read: true,
        },
      });

      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    // Mark single notification as read
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        vendorId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    if (notification.count === 0) {
      return NextResponse.json({ error: 'Notification not found or already read' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('[POST /vendor/notifications/mark-read] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
