import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing customer ID' }, { status: 400 });
  }

  try {
    const { name, email, phone, address, status } = await req.json();

    const customer = await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        name,
        phone,
        address,
      },
    });

    await prisma.user.update({
      where: { id: customer.userId },
      data: {
        email,
        status,
      },
    });

    return NextResponse.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
