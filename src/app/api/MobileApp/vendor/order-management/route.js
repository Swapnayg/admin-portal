// app/api/app/vendor/all-orders/route.ts
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

    const orders = await prisma.order.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' },
      include: {
        payment: true,
        customer: {
          include: { user: true },
        },
        vendor: true,
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    const formatted = orders.map((order) => {
      return {
        id: order.id,
        orderId: order.id,
        vendorId: order.vendorId,
        customerId: order.customerId,
        createdAt: order.createdAt,
        status: order.status,
        subTotal: order.subTotal,
        taxTotal: order.taxTotal,
        shippingCharge: order.shippingCharge,
        total: order.total,
        payment: {
          id: order.payment?.id ?? null,
          orderId: order.payment?.orderId ?? null,
          amount: order.payment?.amount ?? 0,
          method: order.payment?.method ?? '',
          createdAt: order.payment?.createdAt ?? null,
          status: order.payment?.status ?? 'UNPAID',
        },
        vendor: {
          businessName: order.vendor?.businessName ?? 'Unknown Vendor',
        },
        customer: {
          name: order.customer?.name ?? 'Unknown',
          email: order.customer?.user?.email ?? '',
          phone: order.customer?.phone ?? '',
        },
        items: order.items.map((item) => {
          const product = item.product || {};
          const images = [...(product.images || [])];
          images.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          const latestImage = images.length > 0
            ? images[0].url
            : 'https://via.placeholder.com/200';

          return {
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            quantity: item.quantity,
            basePrice: item.basePrice,
            taxRate: item.taxRate,
            taxAmount: item.taxAmount,
            price: item.price,
            product: {
              id: product.id,
              name: product.name ?? 'Unnamed Product',
              description: product.description ?? '',
              price: product.price ?? 0,
              basePrice: product.basePrice ?? 0,
              taxRate: product.taxRate ?? 0,
              stock: product.stock ?? 0,
              vendorId: product.vendorId,
              status: product.status,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              images: product.images ?? [],
              latestImage: latestImage,
            },
          };
        }),
      };
    });

    return NextResponse.json({
      message: 'All orders fetched successfully',
      user,
      data: formatted,
    });
  } catch (error) {
    console.error('[all-orders] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
