import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { notifyAdmins } from "@/lib/notifications";

export const POST = withRole(['VENDOR', 'CUSTOMER'], async (req, user) => {
  const body = await req.json();
  const { vendorId, customerId, content } = body;

  if (!vendorId || !customerId || !content) {
    return NextResponse.json({ message: 'vendorId, customerId, and content are required' }, { status: 400 });
  }

  try {
    // Step 1: Get or create the chat thread
    let chat = await prisma.chat.findUnique({
      where: {
        vendorId_customerId: {
          vendorId,
          customerId,
        },
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          vendorId,
          customerId,
        },
      });
    }

    // Step 2: Save the message
    const message = await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        senderId: user.id,
        content,
      },
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
    });

    await notifyAdmins(
  "Message from Vendor",
  `${vendorName} has sent a message: "${messageContent}".`,
  "MESSAGE_FROM_VENDOR"
);

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        sentAt: message.sentAt,
        sender: message.sender,
      },
    });
  } catch (error) {
    console.error('[Send Message Error]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
