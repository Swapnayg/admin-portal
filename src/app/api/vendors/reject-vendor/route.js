// app/api/vendors/reject/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 });
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: parseInt(id) },
      data: { status: 'REJECTED' },
    });

    return NextResponse.redirect(new URL("/vendors", req.url)); 
  } catch (error) {
    console.error('Reject Vendor Error:', error);
    return NextResponse.json({ error: 'Failed to reject vendor' }, { status: 500 });
  }
}
