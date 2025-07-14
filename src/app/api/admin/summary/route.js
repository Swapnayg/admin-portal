import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const vendorCategoryParam = searchParams.get("vendorCategory");
    const productCategoryParam = searchParams.get("productCategory");

    if (!fromParam || !toParam) {
      return NextResponse.json({ error: "Missing from/to parameters" }, { status: 400 });
    }

    const from = new Date(fromParam);
    const to = new Date(toParam);
    const vendorCategory = vendorCategoryParam ? Number(vendorCategoryParam) : undefined;
    const productCategory = productCategoryParam ? Number(productCategoryParam) : undefined;

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }

    // Month-wise summary
    const months = [];
    const current = new Date(from);
    while (current <= to) {
      const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      months.push({ label: format(monthStart, "MMM yyyy"), start: monthStart, end: monthEnd });
      current.setMonth(current.getMonth() + 1);
    }

    const monthWise = await Promise.all(
      months.map(async (m) => {
        const [vendors, products, customers, orders] = await Promise.all([
          prisma.vendor.count({
            where: {
              createdAt: { gte: m.start, lte: m.end },
              ...(vendorCategory ? { categoryId: vendorCategory } : {}),
            },
          }),
          prisma.product.count({
            where: {
              createdAt: { gte: m.start, lte: m.end },
              ...(productCategory ? { categoryId: productCategory } : {}),
            },
          }),
          prisma.customer.count({
            where: {
              user: {
                createdAt: { gte: m.start, lte: m.end },
              },
            },
          }),
          prisma.order.findMany({
            where: {
              createdAt: { gte: m.start, lte: m.end },
              vendor: vendorCategory ? { categoryId: vendorCategory } : undefined,
              items: productCategory
                ? {
                    some: {
                      product: { categoryId: productCategory },
                    },
                  }
                : undefined,
            },
            include: {
              items: { include: { product: true } },
            },
          }),
        ]);

        const revenue = orders.reduce((sum, o) => sum + o.total, 0);
        const commission = orders
          .flatMap((o) => o.items)
          .filter((item) => !productCategory || item.product.categoryId === productCategory)
          .reduce((sum, i) => sum + (i.commissionAmt || 0), 0);

        const netRevenue = revenue - commission;

        return {
          month: m.label,
          vendors,
          products,
          customers,
          orders: orders.length,
          revenue,
          commission,
          netRevenue,
        };
      })
    );

    const total = monthWise.reduce(
      (acc, cur) => ({
        vendors: acc.vendors + cur.vendors,
        products: acc.products + cur.products,
        customers: acc.customers + cur.customers,
        orders: acc.orders + cur.orders,
        gross: acc.gross + cur.revenue,
        commission: acc.commission + cur.commission,
        expenses: acc.expenses + cur.commission,
        netRevenue: acc.netRevenue + cur.netRevenue,
      }),
      {
        vendors: 0,
        products: 0,
        customers: 0,
        orders: 0,
        gross: 0,
        commission: 0,
        expenses: 0,
        netRevenue: 0,
      }
    );

    // Use selected "to" month for breakdown
    const currentMonthStart = new Date(to.getFullYear(), to.getMonth(), 1);
    const currentMonthEnd = new Date(to.getFullYear(), to.getMonth() + 1, 0);

    // Vendor Breakdown
    const vendors = await prisma.vendor.findMany({
      where: vendorCategory ? { categoryId: vendorCategory } : undefined,
      include: {
        orders: {
          where: {
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            items: productCategory
              ? {
                  some: { product: { categoryId: productCategory } },
                }
              : undefined,
          },
          include: {
            items: { include: { product: true } },
          },
        },
      },
    });

    const vendorBreakdown = vendors.map((v) => {
      const orders = v.orders;
      const revenue = orders.reduce((sum, o) => sum + o.total, 0);
      const commission = orders
        .flatMap((o) => o.items)
        .filter((i) => !productCategory || i.product.categoryId === productCategory)
        .reduce((sum, i) => sum + (i.commissionAmt || 0), 0);
      return {
        id: v.id,
        name: v.businessName,
        orders: orders.length,
        revenue,
        commission,
        netRevenue: revenue - commission,
      };
    });

    // Product Breakdown
    const productOrders = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        ...(productCategory ? { product: { categoryId: productCategory } } : {}),
      },
      include: { product: { include: { category: true } } },
    });

    const productMap = new Map();

    for (const item of productOrders) {
      const prod = item.product;
      const entry = productMap.get(prod.id) || {
        id: prod.id,
        name: prod.name,
        revenue: 0,
        commission: 0,
        quantity: 0,
      };
      entry.revenue += item.price * item.quantity;
      entry.commission += item.commissionAmt || 0;
      entry.quantity += item.quantity;
      productMap.set(prod.id, entry);
    }

    const productBreakdown = Array.from(productMap.values());

    // Category Breakdown
    const categoryAgg = new Map();
    for (const item of productOrders) {
      const cat = item.product.categoryId;
      const entry = categoryAgg.get(cat) || {
        id: cat,
        name: item.product.category?.name || `Category ${cat}`,
        revenue: 0,
        quantity: 0,
      };
      entry.revenue += item.price * item.quantity;
      entry.quantity += item.quantity;
      categoryAgg.set(cat, entry);
    }

    const categoryBreakdown = Array.from(categoryAgg.values());

    return NextResponse.json({
      summary: {
        monthWise,
        total,
      },
      currentMonth: {
        label: format(currentMonthStart, "MMMM yyyy"),
        vendorBreakdown,
        productBreakdown,
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error("Summary API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
