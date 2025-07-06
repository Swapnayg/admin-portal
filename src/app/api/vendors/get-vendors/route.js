// app/api/vendors/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // adjust the import if needed

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ vendors }, { status: 200 });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}
