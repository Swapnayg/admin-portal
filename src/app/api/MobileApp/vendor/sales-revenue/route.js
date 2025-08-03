// app/api/app/vendor/sales-analytics/route.ts
import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, addDays, subDays } from 'date-fns';

export const GET = withRole(['VENDOR'], async (req, user) => {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get('date');

  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  const baseDate = startOfDay(selectedDate); // Selected date is center (Day 3)

  const weekStart = startOfDay(subDays(baseDate, 3)); // 3 days before
  const weekEnd = startOfDay(addDays(baseDate, 4));   // 3 days after (exclusive)
  const salesData = [];

  const vendor = await prisma.vendor.findUnique({
    where: { userId: user.userId },
  });

  if (!vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
  }

  // Loop through the 7-day window
  for (let i = 0; i < 7; i++) {
    const day = startOfDay(addDays(weekStart, i));
    const nextDay = startOfDay(addDays(day, 1));

    const [ordered, cancelled, returned, delivered] = await Promise.all([
      prisma.order.count({
        where: {
          vendorId: vendor.id,
          createdAt: { gte: day, lt: nextDay },
        },
      }),
      prisma.order.count({
        where: {
          vendorId: vendor.id,
          status: 'CANCELLED',
          createdAt: { gte: day, lt: nextDay },
        },
      }),
      prisma.order.count({
        where: {
          vendorId: vendor.id,
          status: 'RETURNED',
          createdAt: { gte: day, lt: nextDay },
        },
      }),
      prisma.order.count({
        where: {
          vendorId: vendor.id,
          status: 'DELIVERED',
          createdAt: { gte: day, lt: nextDay },
        },
      }),
    ]);

    salesData.push({
      date: day,
      ordered,
      cancelled,
      returned,
      delivered,
    });
  }

  // Find delivered orders for the 7-day range
  const deliveredOrders = await prisma.order.findMany({
    where: {
      vendorId: vendor.id,
      status: 'DELIVERED',
      createdAt: { gte: weekStart, lt: weekEnd },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  let totalSales = 0;
  let totalCommission = 0;
  const productSalesMap = {};

  for (const order of deliveredOrders) {
    totalSales += order.total ?? 0;

    for (const item of order.items) {
      totalCommission += item.commissionAmt ?? 0;

      const key = item.productId;
      if (!productSalesMap[key]) {
        productSalesMap[key] = { product: item.product, quantity: 0 };
      }
      productSalesMap[key].quantity += item.quantity;
    }
  }

  const topProductEntry = Object.values(productSalesMap).sort(
    (a, b) => b.quantity - a.quantity
  )[0];


  return NextResponse.json({
    salesData,
    totalSales,
    totalCommission,
    topProduct: topProductEntry
      ? {
          id: topProductEntry.product.id,
          name: topProductEntry.product.name,
          quantitySold: topProductEntry.quantity,
        }
      : null,
  });
});
