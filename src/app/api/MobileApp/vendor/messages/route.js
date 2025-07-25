import { withRole } from '@/lib/withRole';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = withRole(['VENDOR'], async (req, user) => {
  try {
    const vendorId = user.vendorId;

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID not found in user' }, { status: 400 });
    }

    const customers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        customer: {
          orders: {
            some: {
              orderItems: {
                some: {
                  product: {
                    vendorId: vendorId,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        customer: {
          include: {
            orders: {
              include: {
                orderItems: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const chats = await prisma.chat.findMany({
      where: { vendorId },
      include: {
        messages: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    const unreadCountMap = {};

    for (const chat of chats) {
      const customerUserId = chat.customer.user.id;

      const unreadMessages = chat.messages.filter(
        (m) => m.senderId !== user.id // messages from the customer
      );

      unreadCountMap[customerUserId] = unreadMessages.length;
    }

    const formatted = customers.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      password: '',
      tempPassword: null,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      unreadCount: unreadCountMap[u.id] || 0,
      reviews: [],
      notifications: [],
      vendor: null,
      customer: u.customer || null,
      admin: null,
      tickets: [],
      messages: [],
      apiKeys: [],
      auditLogs: [],
      passwordReset: [],
      usages: [],
      pages: [],
    }));

    return NextResponse.json({ customers: formatted });
  } catch (err) {
    console.error('[GET /vendor/customers] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
