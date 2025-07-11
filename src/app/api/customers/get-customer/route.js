import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing customer ID' }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            email: true,
            status: true, // Assuming status is a string like 'ACTIVE' or 'INACTIVE'
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Format to desired interface
    const formattedCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.user.email,
      phone: customer.phone,
      status: customer.user.status === 'ACTIVE' ? 'Active' : 'Inactive',
    };

    return NextResponse.json({ customer: formattedCustomer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
