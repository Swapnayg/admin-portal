import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');

  const orderId = parseInt(idParam || '', 10);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: { name: true }
        },
        vendor: {
          select: {
            businessName: true,
            city: true,
            state: true
          }
        },
        items: {
            include: {
                product: {
                select: {
                    name: true,
                    description: true,
                    price: true,
                    images: {
                    select: {
                        url: true
                    }
                    }
                }
                }
            }
            },
        trackingEvents: true,
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const result = {
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      shippingSnapshot: order.shippingSnapshot,
      customer: order.customer,
      vendor: order.vendor,
      payment: order.payment,
      items: order.items.map(item => ({
        id: item.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        commissionPct: item.commissionPct,
        commissionAmt: item.commissionAmt,
        productImages: item.product.images?.map(img => img.url) ?? [] // safely map URLs
        })),
      trackingEvents: order.trackingEvents
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('Order fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
