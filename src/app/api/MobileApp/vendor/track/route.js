// app/api/app/vendor/order-details/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Order ID is required' },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        payment: true,
        vendor: { select: { businessName: true } },
        customer: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const formatted = {
      orderId: `#${order.id}`,
      status: order.status,
      payment: order.payment?.status || 'UNPAID',
      createdAt: order.createdAt,
      vendor: {
        businessName: order.vendor?.businessName || 'Unknown Vendor',
      },
      customer: {
        name: order.customer?.name || 'Unknown',
        email: order.customer?.email || '',
        phone: order.customer?.phone || '',
      },
      items: order.items.map((item) => {
        const product = item.product;
        const imageUrl =
          product?.images?.[0]?.url || 'https://via.placeholder.com/200';
        return {
          name: product?.name || 'Unnamed Product',
          quantity: item.quantity,
          price: item.price,
          image: imageUrl,
        };
      }),
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error('[OrderDetailsError]', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
