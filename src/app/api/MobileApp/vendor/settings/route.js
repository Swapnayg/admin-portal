import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch bank details for the vendor
export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
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
    const vendorId = vendor.id;

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID missing in token' }, { status: 400 });
    }

    const bankAccount = await prisma.bankAccount.findUnique({
      where: { vendorId },
    });

    return NextResponse.json({
      bankAccount,
    });
  } catch (error) {
    console.error('[GET /vendor/bank-account] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST - Create or update bank details for the vendor
export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
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
    const vendorId = vendor.id;

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID missing in token' }, { status: 400 });
    }

    const data = await req.json();
    const {
      accountHolder,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      upiId,
      upiQrUrl,
    } = data;

    // Check if bank details already exist
    const existing = await prisma.bankAccount.findUnique({
      where: { vendorId },
    });

    if (existing) {
      const updated = await prisma.bankAccount.update({
        where: { vendorId },
        data: {
          accountHolder,
          accountNumber,
          ifscCode,
          bankName,
          branchName,
          upiId,
          upiQrUrl,
        },
      });

      return NextResponse.json({
        message: 'Bank details updated',
        bankAccount: updated,
      });
    } else {
      const created = await prisma.bankAccount.create({
        data: {
          vendorId,
          accountHolder,
          accountNumber,
          ifscCode,
          bankName,
          branchName,
          upiId,
          upiQrUrl,
        },
      });

      return NextResponse.json({
        message: 'Bank details created',
        bankAccount: created,
      });
    }
  } catch (error) {
    console.error('[POST /vendor/bank-account] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
