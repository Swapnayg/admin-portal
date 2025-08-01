import { NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';

// GET all general location zones (no vendor filtering)
export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    const locations = await prisma.locationZone.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        region: true,
      },
    });

    return NextResponse.json({
      message: 'All location zones fetched successfully',
      data: locations,
    });

  } catch (error) {
    console.error('[all-locations] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
