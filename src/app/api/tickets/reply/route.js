import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma"; // Update based on your Prisma client location
import { getSessionUser } from '@/lib/getSessionUser';
import { sendTicketEmail } from '@/lib/vendor-mails';

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const ticketId = Number(searchParams.get('ticketId'));

  if (!ticketId || isNaN(ticketId)) {
    return NextResponse.json({ error: 'Invalid or missing ticketId' }, { status: 400 });
  }

  const { status, reply } = await req.json();

  if (!reply || !status) {
    return NextResponse.json({ error: 'Missing status or reply' }, { status: 400 });
  }

  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.id;

  // ✅ Now you can use userId
  console.log('User ID:', userId);

  try {

        // Fetch ticket with user info
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        vendor: { include: { user: true } },
        customer: { include: { user: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }


    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status,
        messages: {
          create: {
            content: reply,
            isAdmin: true,
            userId: Number(userId),
          },
        },
      },
    });

    let recipientEmail = '';
    let recipientName = '';

    if (ticket.vendor?.user) {
      recipientEmail = ticket.vendor.user.email;
      recipientName = ticket.vendor.user.name;
    } else if (ticket.customer?.user) {
      recipientEmail = ticket.customer.user.email;
      recipientName = ticket.customer.user.name;
    } else {
      // General ticket (not vendor or customer)
      recipientEmail = ticket.email || '';  // assumes ticket model has email field
      recipientName = ticket.name || 'User'; // assumes ticket model has name field
    }
    // ✅ Send email reply
    if (recipientEmail) {
      const baseHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="margin-top: 0; color: #1e293b;">Support Ticket #${ticketId} – ${status === 'CLOSED' ? 'Closed' : 'Response'}</h2>

            <p>Hi <strong>${recipientName}</strong>,</p>
      `;

      const repliedHtml = `
        <p>We’ve responded to your support ticket. Please find the details below:</p>

        <div style="border-left: 4px solid #0f172a; padding-left: 12px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Subject:</strong> ${ticket.subject}</p>
          <p style="margin: 8px 0 0; font-size: 14px; color: #334155;"><strong>Message:</strong></p>
          <p style="margin: 4px 0; font-style: italic; color: #475569;">${reply}</p>
          <p style="margin-top: 12px; font-size: 14px;"><strong>Status:</strong> ${status}</p>
        </div>

        <p>You can reply directly to this email to continue the conversation. Your response will automatically be attached to your support thread.</p>
      `;

      const closedHtml = `
        <p>We’d like to inform you that your support ticket has been marked as <strong>Closed</strong>.</p>

        <div style="border-left: 4px solid #0f172a; padding-left: 12px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Subject:</strong> ${ticket.subject}</p>
          <p style="margin: 8px 0 0; font-size: 14px; color: #334155;"><strong>Final Response:</strong></p>
          <p style="margin: 4px 0; font-style: italic; color: #475569;">${reply}</p>
        </div>

        <p>If you believe this was closed in error or need further assistance, feel free to create a new support request.</p>
      `;

      const footer = `
          <p style="margin-top: 24px;">Thank you,<br/>Support Team</p>
          </div>

          <p style="font-size: 12px; text-align: center; color: #94a3b8; margin-top: 24px;">
            This is an automated message regarding your support ticket. Do not share sensitive information in your email replies.
          </p>
        </div>
      `;

      const fullHtml = baseHtml + (status === 'CLOSED' ? closedHtml : repliedHtml) + footer;

      await sendTicketEmail({
        to: recipientEmail,
        subject: status === 'CLOSED'
          ? `Support Ticket #${ticketId} Closed`
          : `Support Ticket #${ticketId} Reply`,
        html: fullHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ticket reply error:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
