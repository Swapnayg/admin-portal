import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req) {
  try {
    const rawCustomers = await prisma.customer.findMany({
      orderBy: { name: 'asc' },
      include: {
        user: {
          select: {
            email: true,
            status: true, // e.g., 'ACTIVE' | 'INACTIVE'
          },
        },
      },
    });

    const customers = rawCustomers.map((cust) => ({
      id: cust.id,
      name: cust.name,
      email: cust.user.email,
      phone: cust.phone,
      status: cust.user.status === 'ACTIVE' ? 'Active' : 'Inactive',
    }));

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json({ error: 'Error fetching customers' }, { status: 500 });
  }
}
