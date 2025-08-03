// app/api/app/vendor/mark-rejected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { notifyAdmins } from '@/lib/notifications';
import { notifyUser } from '@/lib/notifications';

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

    const vendor = await prisma.vendor.findUnique({
          where: { userId: user.userId },
    });
    const vendorId = vendor.id;

    // Check if order exists and belongs to the vendor
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order || order.vendorId !== vendorId) {
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
  `Vendor ${vendor.businessName} has been rejected. Admin may follow up.`,
  "VENDOR_REJECTED"
);

await notifyUser({
  title: 'Order Rejected',
  message: `We’re sorry, but your order for "${order.productName}" has been rejected.`,
  type: 'ORDER_STATUS',
  userId: order.customerId,
  vendorId: order.vendorId,
  productId: order.productId,
});



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
