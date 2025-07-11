// File: /app/api/products/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { notifyUser } from '@/lib/notifications'; // adjust import path as needed

export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const productId = parseInt(searchParams.get('id') || '');
  const { status } = await req.json();

  if (!productId || isNaN(productId)) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  if (!['APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { status },
      include: {
        vendor: {
          include: {
            user: true,
          },
        },
      },
    });

    // ✅ Notify vendor using notifyUser
    await notifyUser({
      title: 'Product Status Updated',
      message: `Your product "${product.name}" has been marked as ${status}.`,
      type: 'PRODUCT_STATUS',
      userId: product.vendor.user.id,
      vendorId: product.vendorId,
      productId: product.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[UPDATE_PRODUCT_STATUS_ERROR]', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
