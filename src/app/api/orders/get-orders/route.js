import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { name: true } },
        vendor: { select: { businessName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      createdAt: order.createdAt,
      customer: { name: order.customer.name },
      vendor: { name: order.vendor.businessName },
      status: order.status,
      total: order.total,
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
