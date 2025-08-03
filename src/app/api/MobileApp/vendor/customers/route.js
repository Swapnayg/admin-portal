import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId: user.userId,
      },
      include: {
        category: true,
        zones: true,
        bankAccount: true,
        kycDocuments: true,
        products: true,
      },
    });
    const vendorId = vendor.id;

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID not found in user' }, { status: 400 });
    }

    const customers = await prisma.user.findMany({
        where: {
            customer: {
            orders: {
                some: {
                vendorId: vendorId,
                },
            },
            },
        },
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            customer: {
            select: {
                id: true,
                name: true,
                phone: true,
                address: true,
            },
            },
        },
    });

    return NextResponse.json({ customers: customers });
  } catch (err) {
    console.error('[GET /vendor/customers] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
