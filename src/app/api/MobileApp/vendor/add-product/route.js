// app/api/app/vendor/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { notifyAdmins } from "@/lib/notifications";

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

    const userId = user.userId;
    const vendorName = user.email ?? "Unknown Vendor";

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId: userId,
      },
      include: {
        category: true,
        zone: true,
        bankAccount: true,
        kycDocuments: true,
        products: true,
      },
    });

    if (!name || !description || !basePrice || !stock || !imageUrls?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required product fields.' },
        { status: 400 }
      );
    }

    let product;
    const isUpdate = !!id;

    if (isUpdate) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.compliance.deleteMany({ where: { productId: id } });

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
        include: {
          vendor: true,
        },
      });
    } else {
      product = await prisma.product.create({
        data: {
          name,
          description,
          basePrice,
          taxRate,
          price,
          stock,
          vendorId: vendor.id,
          categoryId,
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          vendor: true,
        },
      });
    }

    await prisma.productImage.createMany({
      data: imageUrls.map((url) => ({
        productId: product.id,
        url,
        createdAt: new Date(),
      })),
    });

    if (compliance?.length) {
      await prisma.compliance.createMany({
        data: compliance.map((c) => ({
          productId: product.id,
          type: c.type,
          documentUrl: c.documentUrl,
        })),
      });
    }

    await notifyAdmins(
      "New Product Added",
      `A new product has been added by ${vendor.businessName} and is pending review.`,
      "ADD_PRODUCT"
    );

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
