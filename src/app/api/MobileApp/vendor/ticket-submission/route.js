import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { notifyAdmins } from '@/lib/notifications';
import { TicketType } from '@prisma/client'; 

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

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId: user.userId,
      },
      include: {
        category: true,
        zones: true,
        bankAccount: true,
        kycDocuments: true,
        products: true,
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found.' },
        { status: 404 }
      );
    }

    const vendorId = vendor.id;
    const sorted_type = type?.split('.').pop();

    if (!Object.values(TicketType).includes(sorted_type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ticket type.' },
        { status: 400 }
      );
    }

    const newTicket = await prisma.ticket.create({
      data: {
        subject,
        message,
        type: sorted_type,
        vendorId: vendorId,
        fileUrl: fileUrl || null,
      },
    });

    await notifyAdmins(
      'New Vendor Support Ticket',
      `${vendor.businessName} has submitted a support ticket: ${subject}.`,
      'SUBMIT_TICKET'
    );

    return NextResponse.json({
      success: true,
      message: 'Ticket submitted successfully',
      data: newTicket,
      user,
      request: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
});
