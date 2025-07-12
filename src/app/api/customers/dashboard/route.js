import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const customerId = parseInt(id || '', 10);

  if (isNaN(customerId)) {
    return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { user: true },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const recentOrders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        vendor: true,
        items: { include: { product: true } },
        payment: true,
        trackingEvents: true,
      },
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { customerId } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProducts.map((p) => p.productId) } },
      include: {
        images: {
          take: 1,
          orderBy: { createdAt: 'asc' }, // oldest first, or use 'desc' for newest first
        },
        reviews: true, // optional if you want to calculate average rating
      },
    });

    const productsWithRatings = productDetails.map((prod) => {
      const quantityOrdered = topProducts.find((p) => p.productId === prod.id)?._sum?.quantity || 0;

      const averageRating = prod.reviews.length > 0
        ? prod.reviews.reduce((acc, cur) => acc + cur.rating, 0) / prod.reviews.length
        : null;

      return {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        imageUrl: prod.images[0]?.url || null,
        quantityOrdered,
        averageRating,
      };
    });

    const topVendors = await prisma.order.groupBy({
      by: ['vendorId'],
      where: { customerId },
      _count: true,
      orderBy: { _count: { vendorId: 'desc' } },
      take: 5,
    });

    const vendorDetails = await prisma.vendor.findMany({
      where: { id: { in: topVendors.map((v) => v.vendorId) } },
      select: {
        id: true,
        businessName: true,
        city: true,
        state: true,
        address: true,
      },
    });

    const vendorsWithOrderStats = await Promise.all(
      vendorDetails.map((vendor) => {
      const vendorStat = topVendors.find((v) => v.vendorId === vendor.id);
      return {
        id: vendor.id,
        businessName: vendor.businessName,
        city: vendor.city,
        state: vendor.state,
        address: vendor.address,
        ordersCount: vendorStat?._count || 0,
      };
    }),
    );

    const aggregates = await prisma.orderItem.aggregate({
      where: { order: { customerId } },
      _sum: {
        price: true,
        commissionAmt: true,
      },
    });

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.user.email,
        address: customer.address,
      },
      recentOrders,
      topProducts: productsWithRatings,
      topVendors: vendorsWithOrderStats,
      totalSpend: aggregates._sum.price ?? 0,
      totalCommissionEarned: aggregates._sum.commissionAmt ?? 0,
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
