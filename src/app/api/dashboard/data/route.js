import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay, eachWeekOfInterval, format, endOfWeek } from "date-fns";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = from ? startOfDay(new Date(from)) : undefined;
    const toDate = to ? endOfDay(new Date(to)) : undefined;

    const dateFilter = fromDate && toDate ? { gte: fromDate, lte: toDate } : undefined;

    const [
      users = 0,
      orders = 0,
      tickets = 0,
      products = 0,
      activePromotions = 0,
      revenueAgg = {},
      commissionAgg = {},
      vendorBreakdown = [],
      categoryBreakdown = [],
      productRevenue = [],
      ordersRaw = [],
      userRaw = [],
      orderRaw = []
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count({ where: { createdAt: dateFilter } }),
      prisma.ticket.count({ where: { createdAt: dateFilter } }),
      prisma.product.count(),
      prisma.promotion.count({ where: { status: "ACTIVE" } }),
      prisma.order.aggregate({
        where: { createdAt: dateFilter },
        _sum: { total: true },
      }),
      prisma.orderItem.aggregate({
        where: { order: { createdAt: dateFilter } },
        _sum: { commissionAmt: true },
      }),
      prisma.order.groupBy({
        by: ["vendorId"],
        where: dateFilter ? { createdAt: dateFilter } : {},
        _count: { _all: true },
        _sum: { total: true },
      }),
      prisma.product.groupBy({
        by: ["categoryId"],
        _count: true,
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { price: true, quantity: true, commissionAmt: true },
      }),
      prisma.order.findMany({
        where: dateFilter ? { createdAt: dateFilter } : {},
        select: { createdAt: true, total: true },
      }),
      prisma.user.findMany({
        where: dateFilter ? { createdAt: dateFilter } : {},
        select: { createdAt: true },
      }),
      prisma.order.findMany({
        where: dateFilter ? { createdAt: dateFilter } : {},
        select: { createdAt: true },
      })
    ]);

    const start = fromDate || new Date("2025-01-01");
    const end = toDate || new Date();

    const weekRanges = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const label = `${format(weekStart, "MMM d")}–${format(weekEnd, "d")}`;
      return {
        label,
        start: weekStart,
        end: weekEnd,
        total: 0,
        userCount: 0,
        orderCount: 0,
      };
    });

    for (const order of ordersRaw ?? []) {
      const week = weekRanges.find(w => order.createdAt >= w.start && order.createdAt <= w.end);
      if (week) week.total += Number(order.total || 0);
    }

    for (const user of userRaw ?? []) {
      const week = weekRanges.find(w => user.createdAt >= w.start && user.createdAt <= w.end);
      if (week) week.userCount++;
    }

    for (const order of orderRaw ?? []) {
      const week = weekRanges.find(w => order.createdAt >= w.start && order.createdAt <= w.end);
      if (week) week.orderCount++;
    }

    const vendorNames = await prisma.vendor.findMany({
      select: { id: true, businessName: true },
    });
    const vendorNameMap = Object.fromEntries((vendorNames ?? []).map(v => [v.id, v.businessName]));

    const productNames = await prisma.product.findMany({
      select: { id: true, name: true },
    });
    const productNameMap = Object.fromEntries((productNames ?? []).map(p => [p.id, p.name]));

    const categoryNames = await prisma.productCategory.findMany({
      select: { id: true, name: true },
    });
    const categoryNameMap = Object.fromEntries((categoryNames ?? []).map(c => [c.id, c.name]));

    return NextResponse.json({
      users,
      orders,
      tickets,
      products,
      activePromotions,
      revenue: revenueAgg._sum?.total || 0,
      commission: commissionAgg._sum?.commissionAmt || 0,
      userActivity: weekRanges.map(w => ({ week: w.label, count: w.userCount })),
      orderActivity: weekRanges.map(w => ({ week: w.label, count: w.orderCount })),
      vendorBreakdown: (vendorBreakdown ?? []).map(v => ({
        vendorId: v.vendorId,
        name: vendorNameMap[v.vendorId] || "Unknown",
        _count: { _all: v._count?._all || 0 },
        _sum: { total: v._sum?.total || 0 },
      })),
      categoryBreakdown: (categoryBreakdown ?? []).map(c => ({
        name: categoryNameMap[c.categoryId] || "Unknown",
        _count: c._count || 0,
      })),
      weeklyRevenue: weekRanges.map((w) => ({ week: w.label, total: w.total })),
      productRevenue: (productRevenue ?? []).map(p => ({
        productId: p.productId,
        name: productNameMap[p.productId] || "Unknown",
        _sum: {
          price: p._sum?.price || 0,
          quantity: p._sum?.quantity || 0,
          commissionAmt: p._sum?.commissionAmt || 0,
        },
      })),
    });
  } catch (error) {
    console.error("Dashboard API Error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
