import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, code, discount, validFrom, validTo, type } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
    }

    if (!title || !code || !discount || !validFrom || !validTo || !type) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id: parseInt(id) },
      data: {
        title,
        code,
        discount: parseFloat(discount),
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        type,
      },
    });

    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error('[PROMOTION_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
