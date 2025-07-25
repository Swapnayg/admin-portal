import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  const { orderId, status, message, latitude, longitude } = await req.json();

  if (!orderId || !status) {
    return NextResponse.json({ success: false, message: 'Missing orderId or status' }, { status: 400 });
  }

  try {
    const entry = await prisma.orderTracking.create({
      data: {
        orderId: Number(orderId),
        status,
        message,
        latitude,
        longitude,
      },
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    console.error('[update-tracking-error]', err);
    return NextResponse.json({ success: false, message: 'Failed to update tracking' }, { status: 500 });
  }
});
