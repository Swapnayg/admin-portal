// app/api/app/vendor/mock-product/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        vendorId: user.vendorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true,
        reviews: true,
        orderItems: true,
        vendor: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'No product found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
