import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = async () => {
  try {
    console.log('[CRON] Starting vendor cleanup task...');

    const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    console.log(`[CRON] Threshold date: ${thresholdDate.toISOString()}`);

    const vendorsToDelete = await prisma.vendor.findMany({
      where: {
        isActive: false,
        deactivatedAt: {
          lte: thresholdDate,
        },
      },
    });

    console.log(`[CRON] Found ${vendorsToDelete.length} vendor(s) to delete.`);

    for (const vendor of vendorsToDelete) {
      console.log(`[CRON] Deleting vendorId=${vendor.id}, userId=${vendor.userId}`);
      await prisma.user.delete({
        where: { id: vendor.userId },
      });
    }

    console.log('[CRON] Cleanup complete.');
    return NextResponse.json({ message: `Deleted ${vendorsToDelete.length} vendor(s).` });
  } catch (error) {
    console.error('[CRON] Error during vendor deletion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
