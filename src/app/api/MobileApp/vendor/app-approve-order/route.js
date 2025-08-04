// app/api/app/vendor/approve-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { notifyAdmins, notifyUser } from '@/lib/notifications';

export const POST = withRole(['VENDOR'], async (req, user) => {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      console.warn('[Validation Error] Missing orderId');
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.userId },
    });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        vendor: true,
        customer: true,
        items: { include: { product: true } },
        payment: true,
      },
    });

    if (!order) {
      console.warn('[DB Error] Order not found');
    } else if (order.vendorId !== vendor.id) {
      console.warn('[Unauthorized] Vendor mismatch', {
        vendorId: order.vendorId,
        currentUser: user.userId,
      });
    }

    if (!order || order.vendorId !== vendor.id) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized' },
        { status: 404 }
      );
    }

    if (!order.customer?.name || !order.customer?.phone) {
      return NextResponse.json({ error: 'Customer details incomplete' }, { status: 400 });
    }

    if (!order.items || order.items.length === 0) {
      return NextResponse.json({ error: 'Order has no items' }, { status: 400 });
    }

    if (!order.shippingSnapshot) {
      console.warn('[Missing Shipping Info]', { orderId: order.id });
      return NextResponse.json({ error: 'Shipping address is missing for this order' }, { status: 400 });
    }

    const tokenEntry = await prisma.apiKey.findFirst({
      where: {
        name: 'shiprocket',
        role: 'ADMIN',
      },
      orderBy: { createdAt: 'desc' },
    });

    const token = tokenEntry?.key;
    if (!token) {
      console.error('[Shiprocket] Token not found in DB');
      return NextResponse.json({ error: 'Shiprocket token not found' }, { status: 500 });
    }

    const paymentMode = order.payment?.mode;
    const paymentMethod = paymentMode === 'COD' ? 'COD' : 'Prepaid';

    const shipmentPayload = {
      order_id: `APP-${order.id}`,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: order.vendor.businessName || 'Default Pickup',
      billing_customer_name: order.customer.name,
      billing_address: order.shippingSnapshot.address || '',
      billing_city: order.shippingSnapshot.city || '',
      billing_pincode: order.shippingSnapshot.pincode || '',
      billing_state: order.shippingSnapshot.state || '',
      billing_country: 'India',
      billing_phone: order.customer.phone || '9999999999',
      order_items: order.items.map((item) => ({
        name: item.product.name,
        sku: `SKU-${item.productId}`,
        units: item.quantity,
        selling_price: item.basePrice,
        tax: item.taxAmount,
      })),
      payment_method: paymentMethod,
      sub_total: order.subTotal,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
    };

    console.log('[Final Payment Mode]', paymentMethod);
    console.log('[Final Payload]', JSON.stringify(shipmentPayload, null, 2));

    try {
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

      const {
        shipment_id,
        awb_code,
        courier_company_id,
        courier_name,
      } = srRes.data;

      console.log('[✅ Shiprocket Success Response]', JSON.stringify(srRes.data, null, 2));

      if (!awb_code) {
        console.warn('[Shiprocket Response Missing AWB]', srRes.data);
        return NextResponse.json({
          message: 'Shiprocket order created, but AWB not available',
          shiprocket: srRes.data,
        }, { status: 202 });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'SHIPPED',
          trackingNumber: awb_code,
          trackingPartner: courier_name || 'Shiprocket',
        },
      });

      console.log('[Order Updated]', updatedOrder);

      await prisma.orderTracking.create({
        data: {
          orderId: order.id,
          status: 'SHIPPED',
          message: `Shipped via ${courier_name || 'Shiprocket'} (AWB: ${awb_code})`,
        },
      });

      console.log('[Tracking Entry Created]');

      await notifyAdmins(
        'Vendor Approved',
        `Vendor ${order.vendor.businessName} has approved order #${order.id}.`,
        'VENDOR_APPROVAL'
      );
      console.log('[Admin Notified]');

      const productNames = order.items.map((i) => i.product.name).join(', ');

      await notifyUser({
        title: 'Order Approved',
        message: `Your order for "${productNames}" has been approved by the vendor.`,
        type: 'ORDER_STATUS',
        userId: order.customerId,
        vendorId: order.vendorId,
        productId: order.productId,
      });
      console.log('[User Notified]');

      return NextResponse.json({
        message: 'Order approved and shipped via Shiprocket',
        shiprocket: srRes.data,
        order: updatedOrder,
      });

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        console.error('[❌ Shiprocket Error]', JSON.stringify(errorData, null, 2));
        return NextResponse.json({
          error: errorData?.message || 'Shiprocket API failed',
          details: errorData?.errors || null,
        }, { status: 400 });
      } else {
        console.error('[❌ Unknown Shiprocket Error]', err);
        return NextResponse.json({ error: 'Unexpected error during shipping' }, { status: 500 });
      }
    }

  } catch (err) {
    console.error('[ShiprocketApproveAPI Error]', err?.response?.data || err);
    return NextResponse.json(
      { error: err?.response?.data?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});
