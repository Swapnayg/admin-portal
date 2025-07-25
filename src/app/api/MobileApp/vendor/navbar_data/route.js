import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
        tickets: {
          where: { status: 'OPEN' },
          select: { id: true },
        },
        chats: {
          select: {
            messages: {
              where: { senderId: { not: user.id } },
              select: { id: true },
            },
          },
        },
        notification: {
          where: { read: false },
          select: { id: true },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    const unreadMessages = vendor.chats.reduce((total, chat) => total + chat.messages.length, 0);
    const unreadNotifications = vendor.notification.length;
    const openTickets = vendor.tickets.length;

    return NextResponse.json({
      businessName: vendor.businessName,
      email: vendor.user.email,
      username: vendor.user.username,
      profileImage: `https://cdn.vendorapp.com/images/vendor${vendor.id}.jpg`, // Adjust if stored in DB
      unreadMessages,
      newNotifications: unreadNotifications,
      unreadNotifications,
      openTickets,
    });
  } catch (error) {
    console.error('[vendor-profile-meta] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
