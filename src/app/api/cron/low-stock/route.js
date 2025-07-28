// app/api/cron/check-low-stock/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { notifyAdmins } from '@/lib/notifications';
import { notifyUser } from '@/lib/notifyUser'; // ✅ Your vendor notification function

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('secret');

  console.log('[CRON] Low Stock Check - Token received:', token);
  console.log('[CRON] Expected token:', process.env.CRON_SECRET_TOKEN);

  // 🔐 Security
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔁 Cron Job: Low Stock Check - Started');

    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lte: 5 },
        status: 'APPROVED', // Optional: only notify for visible listings
      },
      include: {
        vendor: {
          include: {
            user: true, // Required to get `userId`
          },
        },
      },
    });

    console.log(`[CRON] Found ${lowStockProducts.length} low-stock product(s).`);

    for (const product of lowStockProducts) {
      const message = `Stock for product "${product.name}" is critically low (${product.stock} units).`;

      // ✅ Notify Admin
      await notifyAdmins(
        "Low Stock Alert",
        `${message} Vendor: ${product.vendor.name}.`,
        "LOW_STOCK"
      );

      // ✅ Notify Vendor using your notifyUser() format
      await notifyUser({
        title: "Low Stock Warning",
        message: `${message} Please restock soon to avoid unavailability.`,
        type: "LOW_STOCK",
        userId: product.vendor.user.id,
        vendorId: product.vendorId,
        productId: product.id,
      });

      console.log(`[CRON] Notifications sent for productId=${product.id}`);
    }

    console.log('✅ Cron Job: Low Stock Check - Completed');

    return NextResponse.json({
      message: 'Low stock notifications sent',
      count: lowStockProducts.length,
      runDate: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('❌ Cron Job: Low Stock Check - Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
