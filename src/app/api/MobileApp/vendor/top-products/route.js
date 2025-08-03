import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    // Get current vendor
    const vendor = await prisma.vendor.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 });
    }

    // Fetch top 5 products by number of order items
    const products = await prisma.product.findMany({
      where: {
        vendorId: vendor.id,
        orderItems: {
          some: {
            order: {
              status: {
                in: ['SHIPPED', 'DELIVERED'],
              },
            },
          },
        },
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: 5,
      include: {
        images: true,
        reviews: true,
        orderItems: true,
        vendor: true,
        category: true,
      },
    });

    if (!products || products.length === 0) {
      return NextResponse.json({ success: false, message: 'No products found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      products: products,
    });
  } catch (error) {
    console.error('Fetch top products error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
