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
        zones: true,
        bankAccount: true,
        kycDocuments: true,
        products: true,
      },
    });
    const products = await prisma.product.findMany({
      where: {
        vendorId: vendor.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        vendor: true,
        category: true,
        images: true,
        compliance: true,
        orderItems: true,
        notification: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!products.length) {
      return NextResponse.json({ success: false, message: 'No approved products found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
