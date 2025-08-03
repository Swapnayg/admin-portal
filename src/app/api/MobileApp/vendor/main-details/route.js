import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    console.log('[API] Vendor overview start. User ID:', user.userId);

    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
    });

    if (!vendor) {
      console.error('[API] Vendor not found for user:', user.userId);
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    const vendorId = vendor.id;
    console.log('[API] Vendor found:', vendorId);

    // Total Orders
    const totalOrders = await prisma.order.count({
      where: { vendorId },
    });
    console.log('[API] Total Orders:', totalOrders);

    // Growth logic placeholder
    const growth = '12.5%';

    // Latest Orders (limit 5)
    const latestOrders = await prisma.order.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        customer: true,
      },
    });
    console.log('[API] Latest Orders fetched:', latestOrders.length);

    // Recent Notifications (limit 5)
    const recentNotifications = await prisma.notification.findMany({
      where: {
        vendorId,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    console.log('[API] Recent Notifications fetched:', recentNotifications.length);

    // Format data
    const overviewStats = [
      {
        icon: 'shopping_cart',
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
    console.log('[API] Notifications formatted');

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
    console.log('[API] Orders formatted');

    console.log('[API] Sending overview response');
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
