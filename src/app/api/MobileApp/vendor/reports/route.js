import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withRole } from '@/lib/withRole';
import { endOfMonth } from 'date-fns';

export const GET = withRole(['VENDOR'], async (req, user) => {

  const { searchParams } = new URL(req.url);
  const month = Number(searchParams.get('month'));
  const year = Number(searchParams.get('year'));

  if (!month || !year) {
    console.warn('Missing month or year in query');
    return NextResponse.json({ success: false, message: 'Missing month or year' }, { status: 400 });
  }

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
    });

    if (!vendor) {
      console.warn('Vendor not found for user:', user.userId);
      return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 });
    }

    const vendorId = vendor.id;

    const startDate = new Date(year, month - 1, 1);
    const endDate = endOfMonth(startDate);

    const [
      totalSales,
      ordersThisMonth,
      newCustomers,
      topProduct,
      salesTrends,
      recentOrders
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          vendorId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }).then(data => {
        return data;
      }),

      prisma.order.count({
        where: {
          vendorId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }).then(data => {
        return data;
      }),

      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          customer: {
            orders: {
              some: {
                vendorId: vendorId,
              },
            },
          },
        },
      }).then(data => {
        return data;
      }),


      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: {
          order: {
            vendorId,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 1,
      }).then(async (top) => {
        if (!top.length) return 'N/A';

        const product = await prisma.product.findUnique({
          where: { id: top[0].productId },
        });

        return product?.name || 'N/A';
      }),

   Promise.all([...Array(4).keys()].map(async (i) => {
      const from = new Date(startDate);
      from.setDate(from.getDate() + i * 7); // Week start
      const to = new Date(from);
      to.setDate(from.getDate() + 6); // Week end

      const statuses = ['DELIVERED', 'SHIPPED', 'PENDING'];

      const [delivered, shipped, pending] = await Promise.all(
        statuses.map(status =>
          prisma.order.aggregate({
            _sum: { total: true },
            where: {
              vendorId,
              status,
              createdAt: { gte: from, lte: to },
            },
          })
        )
      );

      return {
        week: `Week ${i + 1}`,
        blue: delivered._sum.total || 0,  // Delivered
        pink: shipped._sum.total || 0,    // Shipped
        green: pending._sum.total || 0,   // Pending
      };
    })),

      prisma.order.findMany({
        where: {
          vendorId,
          createdAt: { gte: startDate, lte: endDate },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          customer: { select: { name: true } },
        },
      }).then(data => {
        return data;
      }),
    ]);

    const partners = [
      { name: 'Airbnb', logo: 'https://cdn.brandfetch.io/idkuvXnjOH/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1717146459610' },
      { name: 'Netflix', logo: 'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940' },
      { name: 'Uber', logo: 'https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png' },
      { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/512px-Spotify_logo_with_text.svg.png' },
    ];

    return NextResponse.json({
      success: true,
      message: 'Vendor reports fetched successfully',
      user,
      data: {
        totalSales: `₹${totalSales._sum.total?.toFixed(0) || '0'}`,
        ordersThisMonth,
        newCustomers,
        topProduct,
        monthlySalesTrends: salesTrends,
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          amount: `₹${order.total?.toFixed(0) || '0'}`,
          customer: order.customer?.name || 'N/A',
          status: order.status,
          createdAt: order.createdAt,
        })),
        partners,
      },
    });
  } catch (err) {
    console.error('Error in /app/vendor/reports:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}, ['VENDOR']);