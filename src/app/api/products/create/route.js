import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { images, compliance = [], ...productData } = body;

    const {
      name,
      description,
      basePrice,
      taxRate,
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
            basePrice,
            taxRate,
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

        // Insert compliance entries
        if (compliance.length > 0) {
          await tx.compliance.createMany({
            data: compliance.map((c) => ({
              productId: createdProduct.id,
              type: c.type,
              fileUrl: c.fileUrl,
            })),
          });
        }

        // Calculate payouts based on basePrice (not priceWithTax)
        const totalBaseAmount = basePrice * stock;
        const commissionRate = defaultCommissionPct || 0;
        const commissionAmount = parseFloat(((totalBaseAmount * commissionRate) / 100).toFixed(2));
        const vendorPayoutAmount = parseFloat((totalBaseAmount - commissionAmount).toFixed(2));

        await tx.payout.create({
          data: {
            vendorId,
            amount: vendorPayoutAmount,
            commissionAmount,
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
  } catch (error) {
    console.error('[CREATE_PRODUCT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to parse request' }, { status: 500 });
  }
}
