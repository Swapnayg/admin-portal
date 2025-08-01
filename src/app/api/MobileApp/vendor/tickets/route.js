import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  console.log('[DEBUG] Vendor ticket fetch API called');

  try {
    console.log('[DEBUG] Request user received:', user);

    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
    });

    const vendorId = vendor.id;

    if (!vendorId) {
      console.warn('[WARN] Missing vendorId in request body');
      return NextResponse.json({ success: false, message: 'vendorId is required' }, { status: 400 });
    }

    console.log('[DEBUG] Fetching tickets for vendorId:', vendorId);

    const tickets = await prisma.ticket.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    console.log('[DEBUG] Tickets fetched:', tickets.length);

  
    const formatted = tickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      message: t.message,
      type: t.type,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      messages: t.messages.map((m) => ({
        id: m.id,
        content: m.content,
        isAdmin: m.isAdmin,
        ticketId: m.ticketId,
        userId: m.userId,
        createdAt: m.createdAt,
        isRead: m.isRead,
      })),
    }));

    console.log('[DEBUG] Tickets formatted for response');

    return NextResponse.json({
      success: true,
      message: 'Tickets fetched successfully',
      tickets: formatted,
      user,
      request: user,
    });
  } catch (error) {
    console.error('[VENDOR_TICKETS_GETALL_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
});
