// app/api/app/vendor/latest-orders/route.ts
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

    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayOrders = await prisma.order.findMany({
      where: {
        vendorId: vendor.id,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        status: true,
       customer: {
        select: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      },
    });

    const formatted = todayOrders.map((order) => ({
      orderId: `ORD-${order.id.toString().padStart(4, '0')}`,
      customerName: order.customer.user.username,
      status: order.status,
      date: order.createdAt.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));

    return NextResponse.json({
      message: 'Today\'s orders fetched successfully',
      user,
      data: formatted,
    });
  } catch (error) {
    console.error('[latest-orders] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
