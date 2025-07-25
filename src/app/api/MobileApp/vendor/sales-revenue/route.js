// app/api/app/vendor/sales-analytics/route.ts
import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, subDays } from 'date-fns';

export const GET = withRole(['VENDOR'], async (req, user) => {
  const today = new Date();
  const salesData = [];

  for (let i = 6; i >= 0; i--) {
    const day = startOfDay(subDays(today, i));
    const nextDay = startOfDay(subDays(today, i - 1));

    const [ordered, cancelled, returned, delivered] = await Promise.all([
      prisma.order.count({
        where: {
          vendorId: user.id,
          createdAt: { gte: day, lt: nextDay },
        },
      }),
      prisma.order.count({
        where: {
          vendorId: user.id,
          status: 'CANCELLED',
          createdAt: { gte: day, lt: nextDay },
        },
      }),
      prisma.order.count({
        where: {
          vendorId: user.id,
          status: 'RETURNED',
          createdAt: { gte: day, lt: nextDay },
        },
      }),
      prisma.order.count({
        where: {
          vendorId: user.id,
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

  return NextResponse.json({ salesData });
});
