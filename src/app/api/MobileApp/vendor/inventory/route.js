// app/api/app/vendor/mock-products/route.ts
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { ProductStatus } from '@prisma/client';

export const GET = withRole(['VENDOR'], async (req, user) => {
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
        status: ProductStatus.APPROVED,
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
      products: products,
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
});
