// app/api/app/vendor/track-live/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // Fetch order and check vendor access
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order || order.vendorId !== user.userId) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized access' },
        { status: 404 }
      );
    }

    if (!order.awbCode) {
      return NextResponse.json({ error: 'AWB code not found for this order' }, { status: 400 });
    }

    // Get Shiprocket API token from api_key table
    const apiKey = await prisma.apiKey.findFirst({
      where: { name: 'shiprocket' },
      orderBy: { createdAt: 'desc' },
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'Shiprocket token not found' }, { status: 401 });
    }

    // Call Shiprocket tracking API
    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${order.awbCode}`, {
      headers: {
        Authorization: `Bearer ${apiKey.key}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.tracking_data) {
      return NextResponse.json({ error: 'Failed to fetch tracking data', details: data }, { status: 500 });
    }

    const tracking = data.tracking_data;

    // Save latest tracking info (optional)
    await prisma.orderTracking.create({
      data: {
        orderId: order.id,
        status: tracking.track_status || 'In Transit',
        message: tracking.status || 'Status updated',
      },
    });

    // Return live tracking info
    return NextResponse.json({
      message: 'Live tracking fetched',
      tracking: {
        status: tracking.track_status,
        activity: tracking.track_activity,
        expectedDelivery: tracking.etd,
        lastUpdated: tracking.last_status_time,
        history: tracking.shipment_track_activities ?? [],
      },
    });
  } catch (err) {
    console.error('[TrackLiveAPI]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
