// /app/api/cron/expire-promotions/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('secret');

  // 🔐 Optional security check
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔁 Cron Job: Expire Promotions - Started');

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight - only date comparison

    const result = await prisma.promotion.updateMany({
      where: {
        status: 'ACTIVE',
        validTo: {
          lt: today,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    console.log(`✅ Cron Job: Expire Promotions - Completed. Expired ${result.count} promotions.`);

    return NextResponse.json({
      message: 'Expired promotions updated successfully',
      updatedCount: result.count,
      runDate: today.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('❌ Cron Job: Expire Promotions - Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
