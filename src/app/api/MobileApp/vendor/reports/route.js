import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withRole } from '@/lib/withRole';
import { endOfMonth } from 'date-fns';

export const GET = withRole(async (req, res, user) => {
  const { searchParams } = new URL(req.url);
  const month = Number(searchParams.get('month'));
  const year = Number(searchParams.get('year'));

  if (!month || !year) {
    return NextResponse.json({ success: false, message: 'Missing month or year' }, { status: 400 });
  }

  const vendorId = user.id;
  const startDate = new Date(year, month - 1, 1);
  const endDate = endOfMonth(startDate);

  try {
    const [totalSales, ordersThisMonth, newCustomers, topProduct, salesTrends, recentOrders] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          vendorId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      prisma.order.count({
        where: {
          vendorId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      prisma.customer.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          orders: { some: { vendorId } },
        },
      }),

      prisma.order.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: {
          vendorId,
          createdAt: { gte: startDate, lte: endDate },
        },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 1,
      }).then(async (top) => {
        if (!top.length) return 'N/A';
        const product = await prisma.product.findUnique({ where: { id: top[0].productId } });
        return product?.name || 'N/A';
      }),

      Promise.all([...Array(7).keys()].map(async (i) => {
        const from = new Date(startDate);
        from.setDate(from.getDate() + i * 4);
        const to = new Date(from);
        to.setDate(from.getDate() + 3);

        const result = await prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            vendorId,
            createdAt: { gte: from, lte: to },
          },
        });

        return {
          blue: result._sum.totalAmount || 0,
          pink: Math.floor(Math.random() * 3000) + 1000, // dummy
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
          totalAmount: true,
          status: true,
          createdAt: true,
          customer: { select: { name: true } },
        },
      }),
    ]);

    const partners = [
      { name: 'Airbnb', logo: 'https://cdn.brandfetch.io/idkuvXnjOH/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1717146459610' },
      { name: 'Netflix', logo: 'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940' },
      { name: 'Uber', logo: 'https://cdn-assets-us.frontify.com/s3/frontify-enterprise-files-us/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8yN1wvYXNzZXRzXC9lZFwvNTUwOVwvNmNmOGVmM2YzMjFkMTA3YThmZGVjNjY1NjJlMmVmMzctMTYyMDM3Nzc0OC5haSJ9:postmates:9KZWqmYNXpeGs6pQy4UCsx5EL3qq29lhFS6e4ZVfQrs?width=2400' },
      { name: 'Spotify', logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_Black.png' },
    ];

    return NextResponse.json({
      success: true,
      message: 'Vendor reports fetched successfully',
      user,
      data: {
        totalSales: `₹${totalSales._sum.totalAmount?.toFixed(0) || '0'}`,
        ordersThisMonth,
        newCustomers,
        topProduct,
        monthlySalesTrends: salesTrends,
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          amount: `₹${order.totalAmount?.toFixed(0) || '0'}`,
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
