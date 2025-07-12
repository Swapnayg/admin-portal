'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PaymentDetail {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Processing' | 'Failed';
  method: string;
  buyer: string;
  vendor: string;
}

export default function PaymentViewPage({ paymentId }: { paymentId: number }) {
  const { id } = useParams();
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPayment = async () => {
      try {
        const res = await fetch(`/api/payments/get-payment?id=${id}`);
        const data = await res.json();
        setPayment(data);
      } catch (error) {
        console.error('Failed to fetch payment details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!payment) return <p className="p-4 text-red-600">Payment not found.</p>;

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-3xl mx-auto bg-white p-6 pt-8 rounded shadow border border-gray-200 mt-20">
      <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Payment Details</h2>
            <Link
                href="/payments"
                className="text-slate-800 hover:underline text-sm font-medium"
            >
                ← Back to Payments
            </Link>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Payment ID</p>
          <p className="font-medium">{payment.id}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">Date</p>
          <p className="font-medium">{payment.date}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">Amount</p>
          <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">Status</p>
          <Badge
            className={cn(
              'text-xs px-2 py-0.5 rounded',
              payment.status === 'Paid' && 'bg-green-100 text-green-700',
              payment.status === 'Processing' && 'bg-yellow-100 text-yellow-700',
              payment.status === 'Failed' && 'bg-red-100 text-red-700'
            )}
          >
            {payment.status}
          </Badge>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">Payment Method</p>
          <p className="font-medium">{payment.method}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">Buyer</p>
          <p className="font-medium">{payment.buyer}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">Vendor</p>
          <p className="font-medium">{payment.vendor}</p>
        </div>
      </div>
    </div>
    </div>
  );
}
