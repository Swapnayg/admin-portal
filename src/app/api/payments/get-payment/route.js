import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid or missing payment ID' }, { status: 400 });
    }

    const paymentId = parseInt(id);

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            customer: { include: { user: true } },
            vendor: { include: { user: true } },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const formatted = {
      id: `#PAY${String(payment.id).padStart(3, '0')}`,
      date: payment.createdAt.toISOString().split('T')[0], // Format: YYYY-MM-DD
      amount: payment.amount,
      status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase(),
      method: payment.method,
      buyer: payment.order?.customer?.user?.username ?? 'N/A',
      vendor: payment.order?.vendor?.user?.username ?? 'N/A',
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[GET_PAYMENT_DETAIL_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
