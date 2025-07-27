import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.id },
    });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // --- 📊 MOCK-LIKE: Order_Mock (past 7 days order totals)
    const today = new Date();
    const orderData = await Promise.all(
      Array.from({ length: 7 }).map(async (_, index) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - index));
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const dayOrders = await prisma.order.findMany({
          where: {
            vendorId: vendor.id,
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        });

        const totalAmount = dayOrders.reduce((sum, order) => sum + order.total, 0);

        return {
          date: date.toISOString(),
          amount: parseFloat(totalAmount.toFixed(2)),
        };
      })
    );

    // --- 🛒 MOCK-LIKE: ProductSales (top 5 products by order count)
    const productSales = await prisma.product.findMany({
      where: {
        vendorId: vendor.id,
      },
      select: {
        name: true,
        _count: {
          select: { orderItems: true },
        },
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const topProducts = productSales.map((p) => ({
      name: p.name,
      sales: p._count.orderItems,
    }));

    // --- 👤 MOCK-LIKE: UserModel (customers who ordered in last N days)
    const customers = await prisma.order.findMany({
      where: {
        vendorId: vendor.id,
      },
      select: {
        createdAt: true,
        customer: {
          select: {
            user: {
              select: {
                createdAt: true,
              },
            },
          },
        },
      },
    });

    const userModels = customers
      .map((o) => ({
        joinedDate: o.customer?.user?.createdAt?.toISOString(),
      }))
      .filter((u) => u.joinedDate); // Filter out nulls

    return NextResponse.json({
      message: 'Mock dashboard data generated',
      user,
      data: {
        orders: orderData, // Order_Mock[]
        products: topProducts, // ProductSales[]
        users: userModels, // UserModel[]
      },
    });
  } catch (error) {
    console.error('[mock-dashboard] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
