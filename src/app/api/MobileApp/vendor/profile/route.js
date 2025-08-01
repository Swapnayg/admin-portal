import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (_req, user) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
      include: {
        category: {
          select: { id: true, name: true },
        },
        zones: {
          include: {
            zone: { // ← gets the actual LocationZone from VendorZone
              select: { id: true, name: true, country: true, region: true },
            },
          },
        },
        kycDocuments: {
          select: {
            id: true,
            vendorId: true,
            type: true,
            fileUrl: true,
            verified: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const assignedZones = vendor.zones.map((vz) => vz.zone); // ← extract LocationZone[]

    return NextResponse.json({
      success: true,
      vendor: {
        id: vendor.id,
        userId: vendor.userId,
        businessName: vendor.businessName,
        gstNumber: vendor.gstNumber,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        zipcode: vendor.zipcode,
        website: vendor.website,
        contactName: vendor.contactName,
        contactEmail: vendor.contactEmail,
        contactPhone: vendor.contactPhone,
        designation: vendor.designation,
        status: vendor.status,
        createdAt: vendor.createdAt,
        isActive: vendor.isActive,
        deactivatedAt: vendor.deactivatedAt,
        category: vendor.category,
        zones: assignedZones, // ← send only the LocationZones
        kycDocuments: vendor.kycDocuments,
      },
    });
  } catch (error) {
    console.error('[GET_VENDOR_PROFILE_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
});
