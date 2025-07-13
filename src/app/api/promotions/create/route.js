import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, code, discount, validFrom, validTo, type, status } = body;

    if (!title || !code || !discount || !validFrom || !validTo || !type || !status) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const newPromotion = await prisma.promotion.create({
      data: {
        title,
        code,
        discount: parseFloat(discount),
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        type,
        status,
      },
    });

    return NextResponse.json(newPromotion, { status: 201 });
  } catch (error) {
    console.error('[PROMOTION_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
