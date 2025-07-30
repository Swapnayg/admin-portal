// app/api/app/vendor/profile/route.ts
import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (_req, user) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: user.vendorId },
      include: {
        category: true,
        zone: true,
        kycDocuments: true,
      },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    }

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
        category: vendor.category
          ? { id: vendor.category.id, name: vendor.category.name }
          : null,
        zone: vendor.zone
          ? { id: vendor.zone.id, name: vendor.zone.name, country: vendor.zone.country }
          : null,
        kycDocuments: vendor.kycDocuments.map((doc) => ({
          id: doc.id,
          vendorId: doc.vendorId,
          type: doc.type,
          fileUrl: doc.fileUrl,
          verified: doc.verified,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
});
