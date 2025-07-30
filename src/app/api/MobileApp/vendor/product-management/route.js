// app/api/app/vendor/mock-products/route.ts
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
        zone: true,
        bankAccount: true,
        kycDocuments: true,
        products: true,
      },
    });
    const products = await prisma.product.findMany({
      where: {
        vendorId: vendor.id,
        status: 'approved',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      include: {
        vendor: true,
        category: true,
        images: true,
        orderItems: true,
        notifications: true,
        reviews: true,
      },
    });

    if (!products.length) {
      return NextResponse.json({ success: false, message: 'No approved products found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
