// app/api/app/vendor/approve-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import axios from 'axios';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        vendor: true,
        customer: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order || order.vendorId !== user.id) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized' },
        { status: 404 }
      );
    }

    // ✅ Fetch Shiprocket token from the api_key table
    const tokenEntry = await prisma.apiKey.findFirst({
      where: {
        name: 'shiprocket',
        role: 'ADMIN', // or whatever role is correct for the token
      },
      orderBy: { createdAt: 'desc' },
    });

    const token = tokenEntry?.token;
    if (!token) {
      return NextResponse.json({ error: 'Shiprocket token not found' }, { status: 500 });
    }

    const shipmentPayload = {
      order_id: `APP-${order.id}`,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: order.vendor.businessName || 'Default Pickup',
      billing_customer_name: order.customer.name,
      billing_address: order.shippingSnapshot?.address || '',
      billing_city: order.shippingSnapshot?.city || '',
      billing_pincode: order.shippingSnapshot?.pincode || '',
      billing_state: order.shippingSnapshot?.state || '',
      billing_country: 'India',
      billing_phone: order.customer.phone || '9999999999',
      order_items: order.items.map((item) => ({
        name: item.product.name,
        sku: `SKU-${item.productId}`,
        units: item.quantity,
        selling_price: item.basePrice,
        tax: item.taxAmount,
      })),
      payment_method: 'Prepaid',
      sub_total: order.subTotal,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
    };

    const srRes = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      shipmentPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { shipment_id, awb_code, courier_company_id, courier_name } = srRes.data;

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'SHIPPED',
        trackingNumber: awb_code,
        trackingPartner: courier_name || 'Shiprocket',
      },
    });

    await prisma.orderTracking.create({
      data: {
        orderId: order.id,
        status: 'SHIPPED',
        message: `Shipped via ${courier_name || 'Shiprocket'} (AWB: ${awb_code})`,
      },
    });

    return NextResponse.json({
      message: 'Order approved and shipped via Shiprocket',
      shiprocket: srRes.data,
      order: updatedOrder,
    });
  } catch (err) {
    console.error('[ShiprocketApproveAPI]', err?.response?.data || err);
    return NextResponse.json(
      { error: err?.response?.data?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});
