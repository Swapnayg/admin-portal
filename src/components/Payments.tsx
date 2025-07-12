'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { parse, format } from 'date-fns';
import { useRouter } from 'next/navigation'; 

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Refunded' | 'Failed';
  buyer: string;
  vendor: string;
}

export default function PaymentsDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortKey, setSortKey] = useState<keyof Payment>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState<Payment[]>([]);
  const pageSize = 5;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('/api/payments/get-payments');
        const data = await res.json();
        setPayments(data);
      } catch (error) {
        console.error('Failed to fetch payments', error);
      }
    };

    fetchPayments();
  }, []);

  // Inside filtered useMemo:
  const filtered = useMemo(() => {
    return payments
      .filter((p) => {
        const searchLower = search.toLowerCase();
        const searchMatch =
          p.id.toLowerCase().includes(searchLower) ||
          p.date.toLowerCase().includes(searchLower) ||
          p.amount.toString().includes(searchLower) ||
          p.status.toLowerCase().includes(searchLower) ||
          p.buyer.toLowerCase().includes(searchLower) ||
          p.vendor.toLowerCase().includes(searchLower);

        const dateMatch =
          !selectedDate ||
          format(parse(p.date, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd') === selectedDate;

        return searchMatch && dateMatch;
      })
      .sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === 'number' && typeof bVal === 'number') return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        if (typeof aVal === 'string' && typeof bVal === 'string') return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        return 0;
      });
  }, [search, selectedDate, sortKey, sortOrder, payments]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const toggleSort = (key: keyof Payment) => {
    if (key === sortKey) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (key: keyof Payment) => {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? <ArrowUp className="inline ml-1 w-3 h-3" /> : <ArrowDown className="inline ml-1 w-3 h-3" />;
  };

  return (
    <div className="w-full px-6 py-4">
      <h1 className="text-xl font-semibold text-slate-800 mb-4">Payments Overview</h1>

      <div className="flex items-end gap-4 flex-wrap mb-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-48 border border-gray-300"
        />
        <Input
          placeholder="Search payments"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 border border-gray-300 ml-auto"
        />
      </div>

      <div className="border border-gray-300 rounded bg-white overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold">
            <tr>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('id')}>Payment ID {renderSortIcon('id')}</th>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('date')}>Date {renderSortIcon('date')}</th>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('amount')}>Amount {renderSortIcon('amount')}</th>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('status')}>Status {renderSortIcon('status')}</th>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('buyer')}>Buyer {renderSortIcon('buyer')}</th>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('vendor')}>Vendor {renderSortIcon('vendor')}</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
           {paginated.map((payment) => {
              // Extract clean numeric ID from formatted string like "#PAY001"
              const cleanId = parseInt(payment.id.replace('#PAY', ''), 10); // safe even if id is already numeric

              return (
                <tr key={payment.id} className="border-t border-gray-300">
                  <td className="px-4 py-2 font-medium text-slate-700">{payment.id}</td>
                  <td className="px-4 py-2 text-slate-600">{payment.date}</td>
                  <td className="px-4 py-2">₹ {payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <Badge
                      className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        payment.status === 'Paid' && 'bg-green-100 text-green-700',
                        payment.status === 'Refunded' && 'bg-yellow-100 text-yellow-700',
                        payment.status === 'Failed' && 'bg-red-100 text-red-700'
                      )}
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 capitalize">{payment.buyer}</td>
                  <td className="px-4 py-2 capitalize">{payment.vendor}</td>
                  <td
                    className="px-4 py-2 text-blue-600 font-medium cursor-pointer"
                    onClick={() => router.push(`/payments/${cleanId}/view`)}
                  >
                    View
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          className="border border-gray-300"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          className="border border-gray-300"
          onClick={() => setCurrentPage((p) => (p * pageSize < filtered.length ? p + 1 : p))}
          disabled={currentPage * pageSize >= filtered.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
