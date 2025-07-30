import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { notifyAdmins } from "@/lib/notifications";

export const POST = withRole(['VENDOR'], async (req, user) => {
  const body = await req.json();
  const { productId, newStock } = body;

  const vendor = await prisma.vendor.findUnique({
    where: { userId: user.userId },
  });
  var vendorName = vendor.businessName;

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
      vendorId: vendor.id,
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
      vendorId: vendor.id,
      quantity: newStock - product.stock,
    },
  });

  // Fetch top 5 recently updated products
  const recentUpdates = await prisma.product.findMany({
    where: { vendorId: vendor.id },
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

  await notifyAdmins(
  "Stock Updated",
  `The stock for product ${recentUpdates.name} was updated by ${vendorName}.`,
  "UPDATE_PRODUCT_STOCK"
);

  return NextResponse.json({
    success: true,
    message: 'Stock updated successfully',
    data: {
      updatedProduct,
      recentUpdates,
    },
  });
});
