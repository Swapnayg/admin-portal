import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { vendorId } = body;

    if (!vendorId) {
      return NextResponse.json({ success: false, message: 'vendorId is required' }, { status: 400 });
    }

    const tickets = await prisma.ticket.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = tickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      message: t.message,
      type: t.type,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      message: 'Tickets fetched successfully',
      data: formatted,
      user,
      request: body,
    });
  } catch (error) {
    console.error('[VENDOR_TICKETS_GETALL_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
});
