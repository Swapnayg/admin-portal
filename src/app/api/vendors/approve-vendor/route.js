// app/api/vendors/approve/route.ts
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
      data: { status: 'APPROVED' },
    });

    return NextResponse.redirect(new URL("/vendors", req.url)); 
  } catch (error) {
    console.error('Approve Vendor Error:', error);
    return NextResponse.json({ error: 'Failed to approve vendor' }, { status: 500 });
  }
}
