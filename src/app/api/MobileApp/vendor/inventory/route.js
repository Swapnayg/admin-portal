// app/api/app/vendor/mock-products/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        vendorId: user.userId,
        status: 'approved',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
