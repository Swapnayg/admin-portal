import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { categoryId, zoneIds } = body; // zoneIds: number[], categoryId: number

    if (!Array.isArray(zoneIds) || zoneIds.length === 0) {
      return NextResponse.json({ success: false, error: 'zoneIds must be a non-empty array' }, { status: 400 });
    }

    // 1. Find vendor
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
      select: { id: true },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    }

    // 2. Update vendor's categoryId
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        categoryId, // will set it to null if categoryId is null
      },
    });

    // 3. Delete all existing VendorZone entries
    await prisma.vendorZone.deleteMany({
      where: { vendorId: vendor.id },
    });

    // 4. Create new VendorZone entries
    await prisma.vendorZone.createMany({
      data: zoneIds.map((zoneId) => ({
        vendorId: vendor.id,
        zoneId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Vendor category and zones updated successfully',
      vendorId: vendor.id,
      categoryId,
      zoneIds,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
});
