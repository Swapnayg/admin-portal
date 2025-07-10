import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma"; // adjust this path if needed

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1');
  const sortKey = searchParams.get('sort') || 'id';
  const sortOrder = searchParams.get('order') === 'desc' ? 'desc' : 'asc';
  const role = searchParams.get('role') || 'all';
  const q = searchParams.get('q')?.toLowerCase() || '';

  const perPage = 10;
  const skip = (page - 1) * perPage;

  const excludeUserTypes = [
    'GENERAL',
    'DOCUMENTS',
    'TECHNICAL_ISSUE',
    'ACCOUNT_CLEARANCE',
    'REACTIVATE_ACCOUNT',
    'SUPPORT',
  ];

  // Example: get type from your `where` clause or logic

  const where ={
    AND: [],
  };

  // Role filter
  if (role === 'vendor') where.AND.push({ vendorId: { not: null } });
  if (role === 'customer') where.AND.push({ customerId: { not: null } });

  // Search filter (subject, name, vendor/customer name)
  if (q) {
    where.AND.push({
      OR: [
        { subject: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { vendor: { name: { contains: q, mode: 'insensitive' } } },
        { customer: { name: { contains: q, mode: 'insensitive' } } },
      ],
    });
  }

  const shouldExcludeUsers = excludeUserTypes.includes(where?.type ?? '');

  try {
    const include = shouldExcludeUsers
  ? {
      vendor: true,
      customer: true,
      messages: true, // ✅ always include messages
    }
  : {
      vendor: {
        include: {
          user: {
            select: { username: true },
          },
        },
      },
      customer: {
        include: {
          user: {
            select: { username: true },
          },
        },
      },
      messages: true, // ✅ always include messages
    };

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { [sortKey]: sortOrder },
      skip,
      take: perPage,
      include,
    });

    const total = await prisma.ticket.count({ where });

    return NextResponse.json({
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
  //return NextResponse.json({ success: 'success' }, { status: 200 });
}