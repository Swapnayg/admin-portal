import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

export async function GET() {
  try {
    const payouts = await prisma.payout.findMany({
      include: {
        vendor: {
          include: {
            user: {
              select: { username: true }
            }
          }
        }
      },
      orderBy: {
        requestedAt: 'desc'
      }
    });

    const formatted = payouts.map((p) => ({
      id: p.id,
      vendor: p.vendor.user.username,
      amount: p.amount,
      status: p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase(), // Enum: APPROVED -> Approved
      date: format(new Date(p.requestedAt), 'dd-MM-yyyy'), 
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
