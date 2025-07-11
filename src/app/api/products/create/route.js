import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { images, ...productData } = body;

    const {
      name,
      description,
      price,
      stock,
      defaultCommissionPct,
      vendorId,
      categoryId,
      status = 'APPROVED',
    } = productData;

    try {
      const product = await prisma.$transaction(async (tx) => {
        const createdProduct = await tx.product.create({
          data: {
            name,
            description,
            price,
            stock,
            defaultCommissionPct,
            vendorId,
            categoryId,
            status,
            images: {
              create: images.map((url) => ({ url })),
            },
          },
          include: {
            images: true,
          },
        });

        // 🧮 Calculate payout amount as stock * price
      const totalAmount = price * stock;
      const commissionRate = defaultCommissionPct || 0;
      const commissionAmount = parseFloat(((totalAmount * commissionRate) / 100).toFixed(2));
      const vendorPayoutAmount = parseFloat((totalAmount - commissionAmount).toFixed(2));


        await tx.payout.create({
          data: {
            vendorId,
            amount: vendorPayoutAmount,
            commissionAmount, // 🟢 Store how much commission platform earns
            status: 'PENDING',
          },
        });


        return createdProduct;
      });

      return NextResponse.json({ success: true, product });
    } catch (error) {
      console.error('[CREATE_PRODUCT_ERROR]', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
  }
  catch (error) {
    console.error('[CREATE_PRODUCT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
