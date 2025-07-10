import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { TicketStatus, TicketType } from "@prisma/client";
import { sendAcknowledgementEmail } from '@/lib/vendor-mails'; // import at top

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      subject,
      message,
      type = TicketType.GENERAL,
      userId,
      vendorId,
      customerId,
    } = body;

    // Validate required fields
    if (!subject || !message || !type) {
      return NextResponse.json({ error: 'Subject, message and type are required.' }, { status: 400 });
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        name: name || null,
        email: email || null,
        subject,
        message,
        type,
        status: TicketStatus.OPEN,
        userId: userId || null,
        vendorId: vendorId || null,
        customerId: customerId || null,
      },
    });
    if (email) {
        await sendAcknowledgementEmail({
            to: email,
            name,
            subject,
        });
    }

    return NextResponse.json({ message: 'Ticket created successfully.', ticket }, { status: 201 });
  } catch (error) {
    console.error('[TICKET_POST_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
