import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = withRole(async (req, res, user) => {
  try {

    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
    });
    const vendorId = vendor.id;

    // Total Orders
    const totalOrders = await prisma.order.count({
      where: { vendorId },
    });

    // Growth logic placeholder (could compare with previous month)
    const growth = '12.5%'; // Hardcoded for now

    // Latest Orders (limit 5)
    const latestOrders = await prisma.order.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        customer: true,
      },
    });

    // Recent Notifications (limit 5)
    const recentNotifications = await prisma.notification.findMany({
      where: {
        vendorId,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Format data
    const overviewStats = [
      {
        icon: 'shopping_cart', // frontend uses this string to pick an icon
        label: 'Total Orders',
        value: `${totalOrders.toLocaleString()}`,
        growth,
      },
    ];

    const formattedNotifications = recentNotifications.map((n) => ({
      title: n.title,
      message: n.message,
      time: n.createdAt.toISOString(),
      iconName: 'mark_email_unread',
      isNew: !n.isRead,
    }));

    const formattedOrders = latestOrders.map((order) => ({
      initials: order.customer?.name
        ?.split(' ')
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() ?? 'NA',
      orderId: `Order #${order.id}`,
      customerName: order.customer?.name ?? 'Unknown',
      amount: order.totalAmount || 0,
      status: order.status,
      date: order.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({
      success: true,
      message: 'Overview data fetched',
      user,
      data: {
        overviewStats,
        recentNotifications: formattedNotifications,
        latestOrders: formattedOrders,
      },
    });
  } catch (error) {
    console.error('[GET /vendor/overview] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}, ['VENDOR']);
