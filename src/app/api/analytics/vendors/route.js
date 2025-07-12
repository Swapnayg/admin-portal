// File: app/api/vendors/options/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        id: true,
        businessName: true,
      },
      orderBy: {
        businessName: 'asc',
      },
    });

    const formatted = vendors.map((v) => ({
      id: v.id,
      name: v.businessName,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[GET_VENDOR_OPTIONS_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
