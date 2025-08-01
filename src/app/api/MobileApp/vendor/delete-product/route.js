// app/api/app/vendor/delete-product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    console.log('[DELETE_PRODUCT] Request received');

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      console.warn('[DELETE_PRODUCT] Missing productId in request body');
      return NextResponse.json(
        { error: 'Missing required field: productId' },
        { status: 400 }
      );
    }

    console.log(`[DELETE_PRODUCT] Requested productId: ${productId}`);
    console.log(`[DELETE_PRODUCT] User ID: ${user.userId}`);

    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
    });

    if (!vendor) {
      console.warn('[DELETE_PRODUCT] Vendor not found for user');
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const vendorId = vendor.id;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      console.warn(`[DELETE_PRODUCT] Product not found with id: ${productId}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.vendorId !== vendorId) {
      console.warn(`[DELETE_PRODUCT] Unauthorized delete attempt by vendor ${vendorId} for product ${productId}`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    console.log(`[DELETE_PRODUCT] Product ${productId} deleted by vendor ${vendorId}`);

    return NextResponse.json({
      message: 'Product deleted successfully',
    });

  } catch (err) {
    console.error('[DELETE_PRODUCT_ERROR]', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
