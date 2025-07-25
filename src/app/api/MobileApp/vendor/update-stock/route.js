import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  const body = await req.json();
  const { productId, newStock } = body;

  if (!productId || typeof newStock !== 'number') {
    return NextResponse.json({
      success: false,
      message: 'Missing or invalid productId or newStock',
    }, { status: 400 });
  }

  // Validate ownership of product
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      vendorId: user.id,
    },
  });

  if (!product) {
    return NextResponse.json({
      success: false,
      message: 'Product not found or not authorized',
    }, { status: 404 });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      stock: newStock,
      updatedAt: new Date(), // explicitly update updatedAt
    },
  });

  await prisma.stockMovement.create({
    data: {
      productId,
      vendorId: user.id,
      quantity: newStock - product.stock,
    },
  });

  // Fetch top 5 recently updated products
  const recentUpdates = await prisma.product.findMany({
    where: { vendorId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      stock: true,
      updatedAt: true,
      images: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
  });

  return NextResponse.json({
    success: true,
    message: 'Stock updated successfully',
    data: {
      updatedProduct,
      recentUpdates,
    },
  });
});
