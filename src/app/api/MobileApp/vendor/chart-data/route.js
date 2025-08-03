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

    const today = new Date();

    const weeklySales = await Promise.all(
      Array.from({ length: 7 }).map(async (_, index) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - index));
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const dayOrders = await prisma.order.findMany({
          where: {
            vendorId: vendor.id,
            status: {
                in: ['SHIPPED', 'DELIVERED'],
              },
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        });

        const totalAmount = dayOrders.reduce((sum, order) => sum + order.total, 0);
        const newUsers = dayOrders.filter(o => {
          const created = o.customer?.user?.createdAt;
          return created && created >= date && created < nextDate;
        }).length;

        return {
          date: date.toISOString(),
          amount: parseFloat(totalAmount.toFixed(2)),
          newUsers,
        };
      })
    );

    const topProducts = await prisma.product.findMany({
      where: { vendorId: vendor.id },
      select: {
        name: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: {
        orderItems: { _count: 'desc' },
      },
      take: 5,
    });

    const formattedTopProducts = topProducts.map(p => ({
      name: p.name,
      sales: p._count.orderItems,
    }));

    const userGrowth = weeklySales.map(day => day.newUsers);

    const response = {
      weeklySales: weeklySales.map(({ date, amount }) => ({ date, amount })),
      topProducts: formattedTopProducts,
      userGrowth,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
