// app/api/app/vendor/mock-order/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
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
    const orders = await prisma.order.findMany({
      where: {
        vendorId: vendor.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
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
        vendor: true,
        user: true,
        payment: true,
        shippingSnapshot: true,
      },
    });

    const mockOrders = orders.map((order, index) => ({
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
        const product = item.product || {};
        const images = product.images || [];
        return {
          name: product.name || 'Unnamed Product',
          quantity: item.quantity || 0,
          price: item.price?.toNumber() || 0.0,
          image: images.length > 0 ? images[0].url : 'https://via.placeholder.com/200',
        };
      }),
    }));

    return NextResponse.json({
      success: true,
      data: mockOrders,
    });
  } catch (error) {
    console.error('Fetch mock orders error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
