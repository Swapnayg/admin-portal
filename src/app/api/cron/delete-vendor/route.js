import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('secret');

  console.log('[CRON] 🔐 Secret token received:', token);
  console.log('[CRON] 🔐 Expected token:', process.env.CRON_SECRET_TOKEN);

  // 🔐 Security check
  if (token !== process.env.CRON_SECRET_TOKEN) {
    console.warn('[CRON] 🚫 Unauthorized access attempt');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔁 [CRON] Vendor Cleanup Job - STARTED');

    const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    console.log(`[CRON] 📆 Threshold date for deletion: ${thresholdDate.toISOString()}`);

    const vendorsToDelete = await prisma.vendor.findMany({
      where: {
        isActive: false,
        deactivatedAt: {
          lte: thresholdDate,
        },
      },
    });

    console.log(`[CRON] 🧾 Found ${vendorsToDelete.length} vendor(s) to delete.`);

    for (const vendor of vendorsToDelete) {
      console.log(`[CRON] 🗑 Deleting vendorId=${vendor.id}, userId=${vendor.userId}`);
      try {
        await prisma.user.delete({
          where: { id: vendor.userId },
        });
        console.log(`[CRON] ✅ Deleted userId=${vendor.userId}`);
      } catch (deleteError) {
        console.error(`[CRON] ❌ Error deleting userId=${vendor.userId}:`, deleteError);
      }
    }

    console.log('✅ [CRON] Vendor Cleanup Job - COMPLETED');

    return NextResponse.json({
      message: 'Inactive vendors cleaned up successfully',
      deletedCount: vendorsToDelete.length,
      runDate: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('❌ [CRON] Unexpected error during cleanup:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
