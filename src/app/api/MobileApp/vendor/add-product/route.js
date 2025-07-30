// app/api/app/vendor/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { notifyAdmins } from "@/lib/notifications";

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    console.log("📥 Incoming POST /vendor/product request");

    console.log("vendor details", user);

    const body = await req.json();
    console.log("✅ Parsed body:", JSON.stringify(body, null, 2));

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

    const vendorId = user.userId;
    const vendorName = user.email ?? "Unknown Vendor";

    if (!name || !description || !basePrice || !stock || !imageUrls?.length) {
      console.warn("⚠️ Missing required fields", {
        name, description, basePrice, stock, imageUrls
      });

      return NextResponse.json(
        { success: false, error: 'Missing required product fields.' },
        { status: 400 }
      );
    }

    let product;
    const isUpdate = !!id;

    if (isUpdate) {
      console.log("🛠 Updating existing product with ID:", id);

      // DELETE old images and compliance
      const deleteImages = await prisma.productImage.deleteMany({ where: { productId: id } });
      const deleteCompliance = await prisma.compliance.deleteMany({ where: { productId: id } });
      console.log("🧹 Deleted old images:", deleteImages.count);
      console.log("🧹 Deleted old compliance records:", deleteCompliance.count);

      // UPDATE product
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
        vendor: true, // ✅ include vendor relation
      },
    });

      console.log("✅ Product updated:", product.id);
    } else {
      console.log("✨ Creating new product");

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
      include: {
        vendor: true, // ✅ include vendor relation
      },
    });

      console.log("✅ Product created with ID:", product.id);
    }

    // Add images
    const imageInsert = await prisma.productImage.createMany({
      data: imageUrls.map((url) => ({
        productId: product.id,
        url,
        createdAt: new Date(),
      })),
    });
    console.log("🖼️ Images added:", imageInsert.count);

    // Add compliance
    if (compliance?.length) {
      const complianceInsert = await prisma.compliance.createMany({
        data: compliance.map((c) => ({
          productId: product.id,
          type: c.type,
          documentUrl: c.documentUrl,
        })),
      });
      console.log("📄 Compliance added:", complianceInsert.count);
    } else {
      console.log("ℹ️ No compliance documents provided.");
    }

    // Notify admins
    await notifyAdmins(
      "New Product Added",
      `A new product has been added by ${vendorName} and is pending review.`,
      "ADD_PRODUCT"
    );
    console.log("🔔 Admins notified");

    return NextResponse.json({
      success: true,
      message: isUpdate ? 'Product updated successfully' : 'Product created successfully',
      productId: product.id,
    });

  } catch (error) {
    console.error("❌ Error in POST /vendor/product:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
});
