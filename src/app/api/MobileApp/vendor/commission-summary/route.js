// app/api/app/vendor/mock-order/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: {
        userId: user.userId,
      },
      include: {
        category: true,
        zones: true,
        bankAccount: true,
        kycDocuments: true,
        products: true,
      },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: {
        vendorId: vendor.id,
        status: {
          in: ['SHIPPED', 'DELIVERED'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        customer: true,
        vendor: {
          include: {
            user: true,
          },
        },
        payment: true,
      },
    });



    // ✅ Use order.total instead of calculating from items
    let totalSales = 0;
    orders.forEach((order) => {
      const rawTotal = order.total;
      const total =
        typeof rawTotal === 'object' && rawTotal?.toNumber
          ? rawTotal.toNumber()
          : typeof rawTotal === 'number'
            ? rawTotal
            : parseFloat(rawTotal);

      totalSales += total;
    });

    // Weekly trends (DELIVERED orders)
    const getWeekNumber = (date) => {
      const d = new Date(date);
      const firstJan = new Date(d.getFullYear(), 0, 1);
      return Math.ceil((((d.getTime() - firstJan.getTime()) / 86400000) + firstJan.getDay() + 1) / 7);
    };

    const trendMap = {};
    orders.forEach((order) => {
      if (order.status === 'DELIVERED') {
        const week = getWeekNumber(order.createdAt);
        trendMap[week] = (trendMap[week] || 0) + 1;
      }
    });

    let finalTotalCommission = 0;

    const ordersWithCommission = orders.map((order) => {
      let orderCommissionTotal = 0;

      const itemsWithCommission = order.items.map((item, index) => {
        let commissionAmt = item.commissionAmt;

        // Fallback calculation if missing
        if (commissionAmt === null || commissionAmt === undefined) {
          const base = item.basePrice;
          const qty = item.quantity;
          const pct = item.commissionPct || 0;
          commissionAmt = parseFloat(((base * qty * pct) / 100).toFixed(2));
        } else {
          
        }

        orderCommissionTotal += commissionAmt;

        return {
          ...item,
          commissionAmt,
          commissionPct: item.commissionPct,
        };
      });

      finalTotalCommission += orderCommissionTotal;

      return {
        ...order,
        items: itemsWithCommission,
        commissionAmount: parseFloat(orderCommissionTotal.toFixed(2)),
      };
    });

    const monthlySalesTrends = Object.entries(trendMap).map(([week, count]) => ({
      week: Number(week),
      delivered: count,
    }));

    const totalOrders = orders.length;
    const newCustomers = new Set(orders.map((o) => o.customer?.id)).size;

    // 🔍 Aggregate commission per product
    const productCommissionMap = new Map();

    ordersWithCommission.forEach((order) => {
      order.items.forEach((item) => {
        const product = item.product;

        if (!product || typeof product.id !== 'number') return;

        const existing = productCommissionMap.get(product.id) || {
          productId: product.id,
          name: product.name,
          totalCommission: 0,
          image: product.images?.[0]?.url || null,
        };

        existing.totalCommission += item.commissionAmt || 0;

        productCommissionMap.set(product.id, existing);
      });
    });

    const productCommissionTrends = Array.from(productCommissionMap.values()).map((p) => ({
      ...p,
      totalCommission: Number(p.totalCommission.toFixed(2)),
    }));


    return NextResponse.json({
      success: true,
      monthlySalesTrends,
      totalSales,
      totalOrders,
      newCustomers,
      orders: ordersWithCommission, // Include enriched orders
      finalTotalCommission:finalTotalCommission.toFixed(2),
      productCommissionTrends,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
