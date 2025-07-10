import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { images, name, categoryId, vendorId, ...productData } = body;

    // 🔍 Check if product with same name, category, and vendor already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name,
        categoryId,
        vendorId,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with the same name, category, and vendor already exists.' },
        { status: 409 } // Conflict
      );
    }

    // ✅ Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        defaultCommissionPct: productData.defaultCommissionPct,
        vendorId,
        categoryId,
        status: productData.status || 'APPROVED',
        images: {
          create: images.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('[CREATE_PRODUCT_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
