// app/api/app/vendor/update-kyc/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { panCardFile, addressProofFile, gstCertificateFile } = body;

    if (!panCardFile || !addressProofFile) {
      return NextResponse.json({ success: false, error: 'PAN card and Address Proof are required' }, { status: 400 });
    }

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId: user.userId,
      },
      include: {
        category: true,
        zone: true,
        bankAccount: true,
        kycDocuments: true,
        products: true,
      },
    });
    // Delete previous KYC docs
    await prisma.kYC.deleteMany({
      where: { vendorId: vendor.id },
    });

    const newDocuments = [
      { vendorId: vendor.id, type: 'PAN', fileName: panCardFile },
      { vendorId: vendor.id, type: 'ADDRESS', fileName: addressProofFile },
    ];

    if (gstCertificateFile) {
      newDocuments.push({ vendorId: vendor.id, type: 'GST', fileName: gstCertificateFile });
    }

    const createdDocs = await prisma.kYC.createMany({
      data: newDocuments,
    });

    return NextResponse.json({
      success: true,
      message: 'KYC documents updated successfully',
      createdCount: createdDocs.count,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
