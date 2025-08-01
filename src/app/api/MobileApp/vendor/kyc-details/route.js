import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    console.log('[KYC] Incoming request from user:', user.userId);

    const body = await req.json();
    console.log('[KYC] Request body:', body);

    const { panCardFile, addressProofFile, gstCertificateFile } = body;

    if (!panCardFile || !addressProofFile) {
      console.warn('[KYC] Missing mandatory files:', { panCardFile, addressProofFile });
      return NextResponse.json(
        { success: false, error: 'PAN card and Address Proof are required' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
      include: {
        category: true,
        zones: true,
        bankAccount: true,
        kycDocuments: true,
        products: true,
      },
    });

    if (!vendor) {
      console.error('[KYC] Vendor not found for user:', user.userId);
      return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    }

    console.log('[KYC] Found vendor:', vendor.id);

    // Delete previous KYC docs
    const deleteResult = await prisma.kYC.deleteMany({
      where: { vendorId: vendor.id },
    });
    console.log('[KYC] Deleted previous KYC docs count:', deleteResult.count);

    const newDocuments = [
      { vendorId: vendor.id, type: 'PAN', fileUrl: panCardFile },
      { vendorId: vendor.id, type: 'ADDRESS', fileUrl: addressProofFile },
    ];

    if (gstCertificateFile) {
      newDocuments.push({ vendorId: vendor.id, type: 'GST', fileUrl: gstCertificateFile });
    }

    console.log('[KYC] New documents to create:', newDocuments);

    const createdDocs = await prisma.kYC.createMany({
      data: newDocuments,
    });

    console.log('[KYC] Created new KYC docs count:', createdDocs.count);

    return NextResponse.json({
      success: true,
      message: 'KYC documents updated successfully',
      createdCount: createdDocs.count,
    });
  } catch (error) {
    console.error('[KYC] Error during update:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
