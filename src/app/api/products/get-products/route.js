// File: /app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  const status = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      const numericSearch = parseFloat(search);
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { name: { contains: search} } },
        { vendor: { user: { username: { contains: search } } } },
        ...(isNaN(numericSearch)
          ? []
          : [
              { price: numericSearch }, // exact match on number
            ]),
      ];
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        vendor: { include: { user: { select: { username: true } } } },
        category: true,
        compliance: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({ products, total });
  } catch (error) {
    console.error('[GET_PRODUCTS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
