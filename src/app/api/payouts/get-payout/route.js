import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') || '');

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const payout = await prisma.payout.findUnique({
      where: { id },
      include: {
        vendor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    }

    const formatted = {
      id: `#PAYOUT${String(payout.id).padStart(3, '0')}`,
      vendor: payout.vendor?.user?.username ?? 'N/A',
      amount: payout.amount,
      commissionAmount: payout.commissionAmount,
      status: payout.status.charAt(0).toUpperCase() + payout.status.slice(1).toLowerCase(),
      date: new Date(payout.requestedAt).toLocaleDateString('en-GB'), // 12-07-2025
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
