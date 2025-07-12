// /app/api/analytics/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const vendorId = searchParams.get('vendorId');
  const productId = searchParams.get('productId');

  const where = {
    createdAt: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  };

  if (vendorId) where.vendorId = parseInt(vendorId);
  if (productId) {
    where.items = {
      some: { productId: parseInt(productId) },
    };
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      vendor: {
        include: {
          user: true,
        },
      },
    },
  });

  // Total Sales & Return Rate
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const returnCount = orders.filter((o) => o.status === 'RETURNED').length;
  const returnRate = orders.length > 0
    ? ((returnCount / orders.length) * 100).toFixed(1)
    : '0.0';

  // Total Commission
  const totalCommission = orders.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + (item.commissionAmt || 0), 0);
  }, 0);

  // Top Vendor
  const vendorSales = {};
  orders.forEach((order) => {
    const vendorName = order.vendor?.user?.username || 'Unknown';
    vendorSales[vendorName] = (vendorSales[vendorName] || 0) + order.total;
  });
  const topVendor = Object.entries(vendorSales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Monthly Sales
  const monthlyMap = {};
  orders.forEach((order) => {
    const month = order.createdAt.getMonth(); // 0-based index
    monthlyMap[month] = (monthlyMap[month] || 0) + order.total;
  });

  const monthlySales = MONTHS.map((month, i) => ({
    month,
    value: monthlyMap[i] || 0,
  }));

  // Category Breakdown
  const categories = await prisma.productCategory.findMany({
    include: { products: true },
  });

  const categoryBreakdown = categories.map((cat) => {
    const catSales = orders
      .flatMap((o) => o.items)
      .filter((item) => item.product?.categoryId === cat.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    return { category: cat.name, value: catSales };
  }).filter((c) => c.value > 0);

  // Top Products (with price, commission rate, commission earned)
  const topProductsMap = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const prod = item.product;
      if (!prod) return;

      if (!topProductsMap[prod.id]) {
        topProductsMap[prod.id] = {
          name: prod.name,
          sales: 0,
          price: item.price || 0,
          commissionRate: item.commissionRate || 0,
          commissionEarned: 0,
        };
      }
      topProductsMap[prod.id].sales += item.quantity;
      topProductsMap[prod.id].commissionEarned += item.commissionAmt || 0;
    });
  });

  const topProducts = Object.values(topProductsMap)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return NextResponse.json({
    totalSales,
    returnRate,
    totalCommission,
    topVendor,
    monthlySales,
    categoryBreakdown,
    topProducts,
  });
}
