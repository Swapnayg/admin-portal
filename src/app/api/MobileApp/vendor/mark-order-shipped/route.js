// app/api/app/vendor/mark-shipped/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { notifyAdmins } from "@/lib/notifications";

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { orderId, trackingPartner, trackingNumber } = body;

    if (!orderId || !trackingPartner || !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if order exists and belongs to the vendor
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order || order.vendorId !== user.id) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized access' },
        { status: 404 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'SHIPPED',
        trackingPartner,
        trackingNumber,
      },
    });

    await notifyAdmins(
  "Order Shipped",
  `Order #${orderId} has been marked as shipped by ${vendorName}.`,
  "ORDER_SHIPPED"
);

    return NextResponse.json({
      message: 'Order marked as shipped successfully',
      order: updated,
    });
  } catch (err) {
    console.error('[MarkShippedAPI]', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
