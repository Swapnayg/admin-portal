// /api/MobileApp/vendor/track-details/route.ts
import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Missing orderId' }, { status: 400 });
    }

    // Get all tracking entries
    const trackingEntries = await prisma.orderTracking.findMany({
      where: { orderId: Number(orderId) },
      orderBy: { createdAt: 'asc' },
    });

    if (!trackingEntries || trackingEntries.length === 0) {
      return NextResponse.json({ success: false, message: 'No tracking data found' }, { status: 404 });
    }

    const latest = trackingEntries[trackingEntries.length - 1];

    return NextResponse.json({
      success: true,
      data: {
        status: latest.status,
        location: {
          latitude: latest.latitude,
          longitude: latest.longitude,
        },
        history: trackingEntries.map(entry => ({
          status: entry.status,
          message: entry.message,
          time: entry.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('[track-details-error]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});
