// app/api/app/vendor/mark-rejected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { notifyAdmins } from "@/lib/notifications";

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { orderId, reason } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
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
        status: 'CANCELLED',
      },
    });

    // Optionally, store rejection reason as an OrderTracking event
    if (reason) {
      await prisma.orderTracking.create({
        data: {
          orderId: order.id,
          status: 'CANCELLED',
          message: reason,
        },
      });
    }

    await notifyAdmins(
  "Vendor Rejected",
  `Vendor ${vendorName} has been rejected. Admin may follow up.`,
  "VENDOR_REJECTED"
);


    return NextResponse.json({
      message: 'Order marked as cancelled successfully',
      order: updated,
    });
  } catch (err) {
    console.error('[MarkRejectedAPI]', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
