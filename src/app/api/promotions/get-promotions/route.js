import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { id: 'desc' },
    });

    const formatted = promotions.map((promo) => ({
      id: promo.id,
      title: promo.title,
      code: promo.code,
      discount: promo.discount,
      validFrom: new Date(promo.validFrom), // Ensure Date object
      validTo: new Date(promo.validTo),
      type: promo.type,
      status: promo.status,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[GET_PROMOTIONS]', error);
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
  }
}
