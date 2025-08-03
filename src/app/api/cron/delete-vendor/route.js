import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('secret');


  // 🔐 Security check
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {

    const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const vendorsToDelete = await prisma.vendor.findMany({
      where: {
        isActive: false,
        deactivatedAt: {
          lte: thresholdDate,
        },
      },
    });

    for (const vendor of vendorsToDelete) {
      try {
        await prisma.user.delete({
          where: { id: vendor.userId },
        });
      } catch (deleteError) {
      }
    }

    return NextResponse.json({
      message: 'Inactive vendors cleaned up successfully',
      deletedCount: vendorsToDelete.length,
      runDate: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
