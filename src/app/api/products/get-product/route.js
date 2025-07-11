import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: { include: { user: { select: { username: true } } } },
        category: true,
        compliance: true,
        images: true,
        reviews: {
          include: {
            user: { select: { username: true } },
            images: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_VIEW_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
