'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';

interface Order {
  id: number;
  createdAt: string;
  customer: { name: string };
  vendor: { name: string };
  status: OrderStatus;
  total: number;
}

const statusColors: Record<string, string> = {
  SHIPPED: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-orange-100 text-orange-700',
  RETURNED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const statusTabs = ['All Orders', 'Pending', 'Shipped', 'Delivered', 'Returned'];

const dummyOrders: Order[] = Array.from({ length: 20 }, (_, i) => ({
  id: 2400 + i,
  createdAt: `2025-07-${(i % 30 + 1).toString().padStart(2, '0')}`,
  customer: { name: `Customer ${i + 1}` },
  vendor: { name: `Vendor ${i % 5 + 1}` },
  status: ['PENDING', 'SHIPPED', 'DELIVERED', 'RETURNED', 'CANCELLED'][i % 5] as OrderStatus,
  total: Math.floor(Math.random() * 5000 + 1000),
}));

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [sortField, setSortField] = useState<'id' | 'createdAt' | 'total' | 'customer' | 'vendor' | 'status'>('id');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredOrders = useMemo(() => {
    let filtered = [...dummyOrders];

    if (statusFilter !== 'All Orders') {
      filtered = filtered.filter((o) => o.status === statusFilter.toUpperCase());
    }

    if (search.trim()) {
      filtered = filtered.filter((o) =>
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.vendor.name.toLowerCase().includes(search.toLowerCase()) ||
        o.status.toLowerCase().includes(search.toLowerCase()) ||
        o.total.toString().includes(search)
      );
    }

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'customer') {
        aValue = a.customer.name;
        bValue = b.customer.name;
      }
      if (sortField === 'vendor') {
        aValue = a.vendor.name;
        bValue = b.vendor.name;
      }
      if (sortField === 'status') {
        aValue = a.status;
        bValue = b.status;
      }

      if (typeof aValue === 'string') {
        return sortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortAsc ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [search, statusFilter, sortField, sortAsc]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="p-6 w-full bg-white rounded shadow">
      <div className="flex flex-wrap gap-2 justify-end mb-4">
        {statusTabs.map((tab) => (
          <Button
            key={tab}
            variant={statusFilter === tab ? 'default' : 'outline'}
            onClick={() => setStatusFilter(tab)}
            className={cn(
              'cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-gray-300',
              statusFilter === tab && 'bg-slate-700 text-white hover:bg-slate-800'
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders, status, total..."
          className="w-80 border border-gray-300 cursor-pointer"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead>
            <tr className="bg-gray-50 text-slate-600">
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('id')}>
                Order # {sortField === 'id' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('createdAt')}>
                Date {sortField === 'createdAt' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('customer')}>
                Buyer {sortField === 'customer' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('vendor')}>
                Vendor {sortField === 'vendor' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('status')}>
                Status {sortField === 'status' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('total')}>
                Total {sortField === 'total' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="border-t border-gray-200">
                <td className="px-4 py-2">#{order.id}</td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{order.customer.name}</td>
                <td className="px-4 py-2">{order.vendor.name}</td>
                <td className="px-4 py-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded", statusColors[order.status])}>{order.status}</span>
                </td>
                <td className="px-4 py-2">₹{order.total}</td>
                <td className="px-4 py-2">
                 <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-sm font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
        <div>
          Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-slate-100 border border-gray-300 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="bg-slate-100 border border-gray-300 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
