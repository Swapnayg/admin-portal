import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        businessName: true,
      },
    });

    const categories = await prisma.productCategory.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ vendors, categories });
  } catch (error) {
    console.error('[METADATA_PRODUCTS_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
