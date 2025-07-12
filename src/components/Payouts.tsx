'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation'; 

interface Payout {
  id: number;
  vendor: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
}

export default function PayoutsDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortKey, setSortKey] = useState<keyof Payout>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const pageSize = 5;

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await fetch('/api/payouts/get-payouts');
        const data = await res.json();
        console.log(data);
        setPayouts(data);
      } catch (error) {
        console.error('Failed to fetch payouts', error);
      }
    };
    fetchPayouts();
  }, []);

  const filtered = useMemo(() => {
    return payouts
      .filter((p) => {
        const searchLower = search.toLowerCase();

        const searchMatch =
          p.vendor.toLowerCase().includes(searchLower) ||
          p.amount.toString().includes(searchLower) ||
          p.status.toLowerCase().includes(searchLower) ||
          p.date.toLowerCase().includes(searchLower);

        const selectedFormatted = selectedDate
          ? format(new Date(selectedDate), 'dd-MM-yyyy')
          : '';

        const dateMatch =
          !selectedDate || selectedFormatted === p.date;

        return searchMatch && dateMatch;
      })
      .sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return 0;
      });
  }, [search, selectedDate, sortKey, sortOrder, payouts]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const toggleSort = (key: keyof Payout) => {
    if (key === sortKey) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (key: keyof Payout) => {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? <ArrowUp className="inline ml-1 w-3 h-3" /> : <ArrowDown className="inline ml-1 w-3 h-3" />;
  };

  return (
    <div className="w-full px-6 py-4">
      <h1 className="text-xl font-semibold text-slate-800 mb-4">Payouts Overview</h1>

      <div className="flex items-end gap-4 flex-wrap mb-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-48 border border-gray-300"
        />
        <Input
          placeholder="Search payouts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 border border-gray-300 ml-auto"
        />
      </div>

      <div className="border border-gray-300 rounded bg-white overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold">
            <tr>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('vendor')}>Vendor {renderSortIcon('vendor')}</th>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('amount')}>Amount {renderSortIcon('amount')}</th>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('status')}>Status {renderSortIcon('status')}</th>
              <th className="cursor-pointer px-4 py-2" onClick={() => toggleSort('date')}>Requested On {renderSortIcon('date')}</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((payout, idx) => (
              <tr key={idx} className="border-t border-gray-300">
                <td className="px-4 py-2 font-medium text-slate-700 capitalize">{payout.vendor}</td>
                <td className="px-4 py-2">₹ {payout.amount.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <Badge
                    className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      payout.status === 'Approved' && 'bg-green-100 text-green-700',
                      payout.status === 'Pending' && 'bg-yellow-100 text-yellow-700',
                      payout.status === 'Rejected' && 'bg-red-100 text-red-700'
                    )}
                  >
                    {payout.status}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-slate-600">{payout.date}</td>
                <td
                    className="px-4 py-2 text-blue-600 font-medium cursor-pointer"
                    onClick={() => router.push(`/payouts/${payout.id}/view`)}
                  >
                    View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          className="border border-gray-300 cursor-pointer"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          className="border border-gray-300 cursor-pointer"
          onClick={() => setCurrentPage((p) => (p * pageSize < filtered.length ? p + 1 : p))}
          disabled={currentPage * pageSize >= filtered.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
