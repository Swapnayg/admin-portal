// /app/api/cron/expire-promotions/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  // 🔐 Optional security check
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to ignore time

    const result = await prisma.promotion.updateMany({
      where: {
        status: 'ACTIVE',
        validTo: {
          lt: today, // Compare only date part
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    return NextResponse.json({
      message: 'Expired promotions updated successfully',
      updatedCount: result.count,
      runDate: today.toISOString().split('T')[0], // Just the date
    });
  } catch (error) {
    console.error('Expire promotions cron error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
