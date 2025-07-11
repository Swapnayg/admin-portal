"use client";

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  commissionPct?: number;
  commissionAmt?: number;
}

interface OrderTracking {
  id: number;
  status: string;
  message?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

interface Order {
  id: number;
  customer: { name: string };
  vendor: { name: string };
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  trackingEvents: OrderTracking[];
}

const statusColors: Record<string, string> = {
  SHIPPED: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-orange-100 text-orange-700',
  RETURNED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const mockOrder: Order = {
  id: 1234,
  customer: { name: 'John Doe' },
  vendor: { name: 'ABC Supplies' },
  status: 'DELIVERED',
  total: 4599,
  createdAt: '2025-07-10T12:34:56',
  items: [
    {
      id: 1,
      productName: 'Industrial Drill Machine',
      quantity: 2,
      price: 1800,
      commissionPct: 10,
      commissionAmt: 360,
    },
    {
      id: 2,
      productName: 'Welding Helmet',
      quantity: 1,
      price: 999,
      commissionPct: 8,
      commissionAmt: 79.92,
    },
  ],
  trackingEvents: [
    {
      id: 1,
      status: 'PENDING',
      message: 'Order placed',
      latitude: 28.6139,
      longitude: 77.209,
      createdAt: '2025-07-10T12:00:00',
    },
    {
      id: 2,
      status: 'SHIPPED',
      message: 'Dispatched from warehouse',
      latitude: 28.6448,
      longitude: 77.2167,
      createdAt: '2025-07-11T08:00:00',
    },
    {
      id: 3,
      status: 'DELIVERED',
      message: 'Delivered to customer',
      latitude: 28.7041,
      longitude: 77.1025,
      createdAt: '2025-07-12T14:30:00',
    },
  ],
};

interface OrderViewPageProps {
  id: number;
}

export default function OrderViewPage({ id }: OrderViewPageProps) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    setTimeout(() => setOrder(mockOrder), 1000);
  }, []);

  if (!order) {
    return (
      <div className="p-6 w-full flex justify-center items-center">
        <Loader className="animate-spin text-slate-600" /> Loading...
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Order #{order.id}</h2>
          <p className="text-sm text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge
          className={cn(
            'text-sm px-3 py-1 rounded',
            statusColors[order.status] || 'bg-gray-100 text-gray-700'
          )}
        >
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <p className="text-gray-500 mb-1">Customer</p>
          <p className="text-slate-700 font-medium">{order.customer.name}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Vendor</p>
          <p className="text-slate-700 font-medium">{order.vendor.name}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Total Amount</p>
          <p className="text-slate-700 font-medium">₹{order.total}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">Items</h3>
      <div className="overflow-x-auto border border-gray-200 rounded mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-slate-700">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Commission (%)</th>
              <th className="px-4 py-2 text-left">Commission (₹)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">₹{item.price}</td>
                <td className="px-4 py-2">{item.commissionPct ?? '-'}%</td>
                <td className="px-4 py-2">₹{item.commissionAmt?.toFixed(2) ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">Order Tracking</h3>
      <div className="space-y-3 mb-6">
        {order.trackingEvents.map((track) => (
          <div key={track.id} className="border border-gray-200 p-3 rounded">
            <div className="text-slate-700 font-medium">{track.status}</div>
            <div className="text-sm text-slate-500">{track.message}</div>
            <div className="text-xs text-slate-400">
              {new Date(track.createdAt).toLocaleString()} |
              Lat: {track.latitude} | Lng: {track.longitude}
            </div>
          </div>
        ))}
      </div>

      <div className="h-[400px] w-full">
        <iframe
          title="Tracking Map"
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyCGM5FJdnGW5gQXYvBk6Xp6tvrFhbKlsAE&origin=${order.trackingEvents[0].latitude},${order.trackingEvents[0].longitude}&destination=${order.trackingEvents[order.trackingEvents.length - 1].latitude},${order.trackingEvents[order.trackingEvents.length - 1].longitude}`}
        ></iframe>
      </div>
    </div>
  );
}
