import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withRole(['VENDOR', 'CUSTOMER'], async (req, user) => {
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get('vendorId');
  const customerId = searchParams.get('customerId');

  if (!vendorId || !customerId) {
    return NextResponse.json({ message: 'vendorId and customerId are required' }, { status: 400 });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        vendorId_customerId: {
          vendorId: parseInt(vendorId),
          customerId: parseInt(customerId),
        },
      },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            contactName: true,
            contactEmail: true,
            contactPhone: true,
          },
        },
        customer: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        messages: {
          orderBy: { sentAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!chat) return NextResponse.json({ message: 'Chat not found' }, { status: 404 });

    const formatted = {
      id: chat.id,
      vendor: {
        id: chat.vendor.id,
        businessName: chat.vendor.businessName,
        contactName: chat.vendor.contactName,
        contactEmail: chat.vendor.contactEmail,
        contactPhone: chat.vendor.contactPhone,
      },
      customer: {
        id: chat.customer.id,
        username: chat.customer.user.username,
        email: chat.customer.user.email,
      },
      messages: chat.messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sentAt: msg.sentAt,
        sender: {
          id: msg.sender.id,
          username: msg.sender.username,
          email: msg.sender.email,
          role: msg.sender.role,
        },
      })),
    };

    return NextResponse.json({ success: true, chat: formatted });
  } catch (error) {
    console.error('[Chat Details API Error]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
