// /app/api/payments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: {
          include: {
            customer: { include: { user: true } },
            vendor: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = payments.map((p) => ({
      id: `#PAY${String(p.id).padStart(3, '0')}`,
      date: format(new Date(p.createdAt), 'dd-MM-yyyy'), // 👈 formatted date
      amount: p.amount,
      status: p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase(),
      buyer: p.order?.customer?.user?.username ?? 'N/A',
      vendor: p.order?.vendor?.user?.username ?? 'N/A',
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[GET_PAYMENTS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
