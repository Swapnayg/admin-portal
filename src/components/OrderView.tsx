"use client";

import { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, string> = {
  SHIPPED: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-orange-100 text-orange-700',
  RETURNED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

interface OrderViewPageProps {
  id: number;
}

export default function OrderViewPage({ id }: OrderViewPageProps) {
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/orders/get-order?id=${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error('Order load error:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const exportPDF = () => {
    if (!invoiceRef.current) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice Order #${order?.id ?? 'unknown'}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; }
            img { width: 40px; height: 40px; object-fit: cover; }
            h3 { margin-bottom: 10px; }
            .section { margin-top: 30px; }
            iframe { margin-top: 10px; width: 100%; height: 300px; border: none; }
          </style>
        </head>
        <body>
          <h3>Invoice - Order #${order?.id ?? 'unknown'}</h3>
          ${invoiceRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading) {
    return (
      <div className="p-6 w-full flex justify-center items-center">
        <Loader className="animate-spin text-slate-600" /> Loading...
      </div>
    );
  }

  if (!order) {
    return <div className="text-red-500 p-6">Failed to load order.</div>;
  }

  return (
    <div className="p-6 w-full bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-1"
        >
          ← Back to Orders
        </Button>
        <Button 
          variant="outline" 
          onClick={exportPDF} 
          className="text-sm cursor-pointer border border-slate-300 text-white bg-slate-800 hover:bg-slate-700"
        >
          Export PDF
        </Button>
      </div>

      <div ref={invoiceRef}>
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Order #{order?.id ?? '-'}</h2>
            <p className="text-sm text-slate-500">
              Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <Badge
            className={cn(
              'text-sm px-4 py-1 rounded-full font-semibold',
              statusColors[order?.status] || 'bg-gray-100 text-gray-700'
            )}
          >
            {order?.status ?? 'Unknown'}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-sm mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <p className="text-gray-500 mb-1">Customer</p>
            <p className="text-slate-700 font-semibold">{order?.customer?.name ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Vendor</p>
            <p className="text-slate-700 font-semibold">{order?.vendor?.businessName ?? 'N/A'}</p>
            <p className="text-xs text-slate-500">{order?.vendor?.city ?? '—'}, {order?.vendor?.state ?? '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Total Amount</p>
            <p className="text-slate-700 font-semibold">₹{order?.total?.toFixed(2) ?? '0.00'}</p>
          </div>
          {order?.payment && (
            <div>
              <p className="text-gray-500 mb-1">Payment</p>
              <p className="text-slate-700 font-semibold">
                {order?.payment?.method ?? '—'} - ₹{order?.payment?.amount?.toFixed(2) ?? '0.00'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Product Items</h3>
          <div className="overflow-x-auto border border-gray-200 rounded-lg p-4 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Commission (%)</th>
                  <th className="px-4 py-2 text-left">Commission (₹)</th>
                </tr>
              </thead>
              <tbody>
                {order?.items?.map((item: any) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-700">{item.productName ?? '—'}</td>
                    <td className="px-4 py-2">
                      {item.productImages.length > 0 ? (
                        <img src={item.productImages[0]} alt="Product" className="w-12 h-12 rounded object-cover border border-slate-200 shadow-sm" />
                      ) : '—'}
                    </td>
                    <td className="px-4 py-2">{item.quantity ?? '—'}</td>
                    <td className="px-4 py-2">₹{item.price?.toFixed(2) ?? '0.00'}</td>
                    <td className="px-4 py-2">{item.commissionPct ?? '—'}%</td>
                    <td className="px-4 py-2">₹{item.commissionAmt?.toFixed(2) ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {order?.shippingSnapshot && (
          <div className="section bg-slate-50 border border-slate-200 rounded-lg p-4 mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Shipping Address</h4>
            <div className="text-sm text-slate-600 space-y-1">
              {Object.entries(order.shippingSnapshot).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-slate-700">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order?.trackingEvents?.length > 0 && (
          <div className="section mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Tracking History</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.trackingEvents?.map((track: any) => (
                <div key={track.id} className="border border-gray-200 p-3 rounded-lg bg-white shadow-sm">
                  <div className="text-slate-700 font-semibold">{track.status}</div>
                  <div className="text-sm text-slate-500">{track.message}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(track.createdAt).toLocaleString()} |
                    Lat: {track.latitude} | Lng: {track.longitude}
                  </div>
                </div>
              ))}
            </div>
            {order?.trackingEvents?.length >= 2 && (
              <div className="mt-4">
                <iframe
                  title="Tracking Map"
                  width="100%"
                  height="400"
                  loading="lazy"
                  allowFullScreen
                  style={{ border: '0' }}
                  src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyCGM5FJdnGW5gQXYvBk6Xp6tvrFhbKlsAE&origin=${order.trackingEvents[0].latitude},${order.trackingEvents[0].longitude}&destination=${order.trackingEvents[order.trackingEvents.length - 1].latitude},${order.trackingEvents[order.trackingEvents.length - 1].longitude}`}
                ></iframe>
              </div>
            )}
          </div>
        )}

        {order?.trackingEvents?.some((e: any) => e.status === 'RETURNED') && (
          <div className="section mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Return History</h3>
            <div className="space-y-3">
              {order.trackingEvents
                .filter((e: any) => e.status === 'RETURNED')
                .map((event: any) => (
                  <div key={event.id} className="border border-gray-200 p-3 rounded-lg bg-white shadow-sm">
                    <div className="text-slate-700 font-semibold">Returned</div>
                    <div className="text-sm text-slate-500">{event.message}</div>
                    <div className="text-xs text-slate-400">
                      {new Date(event.createdAt).toLocaleString()} |
                      Lat: {event.latitude} | Lng: {event.longitude}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
