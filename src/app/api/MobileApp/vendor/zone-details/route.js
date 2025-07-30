// app/api/app/vendor/update-zone/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { name, country, region } = body;

    // 1. Find vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id: user.vendorId },
      select: { id: true },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    }

    // 2. Update LocationZone by vendorId
    const updatedZone = await prisma.locationZone.update({
      where: {
        vendorId: vendor.id,
      },
      data: {
        name,
        country,
        region,
      },
    });

    // 3. Update Vendor.zoneId to match updated LocationZone.id
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        zoneId: updatedZone.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Zone updated and linked successfully',
      updatedZone,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
});
