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

  // Update stock
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });

  // Optional: Log stock movement
  await prisma.stockMovement.create({
    data: {
      productId,
      vendorId: user.id,
      quantity: newStock - product.stock,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'Stock updated successfully',
    data: updatedProduct,
  });
});
