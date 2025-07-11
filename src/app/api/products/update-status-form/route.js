// app/api/products/update-status-form/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { notifyUser } from '@/lib/notifications';

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    const formData = await req.formData();
    const status = formData.get('status');

    if (!id || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          include: { user: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.update({
      where: { id },
      data: { status },
    });

    await notifyUser({
      title: 'Product Status Updated',
      message: `Your product "${product.name}" has been marked as ${status}.`,
      type: 'PRODUCT_STATUS',
      userId: product.vendor.user.id,
      vendorId: product.vendorId,
      productId: product.id,
    });

    return NextResponse.redirect(new URL('/products', req.url));
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
