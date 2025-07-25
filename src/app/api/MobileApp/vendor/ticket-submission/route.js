import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { subject, message, type, fileUrl } = body;

    if (!subject || !message || !type) {
      return NextResponse.json(
        { success: false, message: 'Subject, message, and type are required.' },
        { status: 400 }
      );
    }

    const newTicket = await prisma.ticket.create({
      data: {
        subject,
        message,
        type,
        vendorId: user.vendorId,
        fileUrl: fileUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket submitted successfully',
      data: newTicket,
      user,
      request: body,
    });
  } catch (error) {
    console.error('[VENDOR_TICKET_SUBMIT_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
});
