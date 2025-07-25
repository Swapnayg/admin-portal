// app/api/app/vendor/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import { prisma } from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const {
      id,
      name,
      description,
      basePrice,
      taxRate,
      price,
      stock,
      categoryId,
      imageUrls,
      compliance,
    } = body;

    const vendorId = user.vendorId;
    if (!name || !description || !basePrice || !stock || !imageUrls?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required product fields.' },
        { status: 400 }
      );
    }

    let product;
    const isUpdate = !!id;

    if (isUpdate) {
      // DELETE old images and compliance if updating
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.compliance.deleteMany({ where: { productId: id } });

      // UPDATE main product
      product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          basePrice,
          taxRate,
          price,
          stock,
          categoryId,
          updatedAt: new Date(),
        },
      });
    } else {
      // CREATE new product
      product = await prisma.product.create({
        data: {
          name,
          description,
          basePrice,
          taxRate,
          price,
          stock,
          vendorId,
          categoryId,
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Add images
    await prisma.productImage.createMany({
      data: imageUrls.map((url) => ({
        productId: product.id,
        url,
        createdAt: new Date(),
      })),
    });

    // Add compliance documents
    if (compliance?.length) {
      await prisma.compliance.createMany({
        data: compliance.map((c) => ({
          productId: product.id,
          type: c.type,
          documentUrl: c.documentUrl,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: isUpdate ? 'Product updated successfully' : 'Product created successfully',
      productId: product.id,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
});
