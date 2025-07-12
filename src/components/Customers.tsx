'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}


export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'email' | 'phone' | 'status'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const pageSize = 5;

  useEffect(() => {
    fetch('/api/customers/get-customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers);
      })
      .catch(err => console.error('Error loading customers', err));
}, []);

  const filtered = useMemo(() => {
    let result = [...customers];

    if (search.trim()) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.status.toLowerCase().includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortAsc ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return result;
  }, [customers, search, sortField, sortAsc]); // ✅ Added `customers`

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="p-6 w-full bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-slate-800">Customers</h1>
        <Link href="/customers/new">
          <Button className="bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">+ Add Customer</Button>
        </Link>
      </div>

      <div className="flex justify-end mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-80 border border-gray-300"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-50 text-slate-700">
            <tr>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => {
                setSortField('name'); setSortAsc(sortField === 'name' ? !sortAsc : true);
              }}>Name {sortField === 'name' && (sortAsc ? '↑' : '↓')}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => {
                setSortField('email'); setSortAsc(sortField === 'email' ? !sortAsc : true);
              }}>Email {sortField === 'email' && (sortAsc ? '↑' : '↓')}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => {
                setSortField('phone'); setSortAsc(sortField === 'phone' ? !sortAsc : true);
              }}>Phone {sortField === 'phone' && (sortAsc ? '↑' : '↓')}</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => {
                setSortField('status'); setSortAsc(sortField === 'status' ? !sortAsc : true);
              }}>Status {sortField === 'status' && (sortAsc ? '↑' : '↓')}</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((cust) => (
              <tr key={cust.id} className="border-t border-gray-200">
                <td className="px-4 py-2 font-medium text-slate-700 capitalize">{cust.name}</td>
                <td className="px-4 py-2">{cust.email}</td>
                <td className="px-4 py-2">{cust.phone}</td>
                <td className="px-4 py-2">
                  <Badge className={cust.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {cust.status}
                  </Badge>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" className="bg-slate-100 text-slate-700 border border-gray-300 hover:bg-slate-200">View</Button>
                  <Link href={`/customers/${cust.id}/edit`}>
                    <Button size="sm" className="bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-500">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
        <div>
          Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="bg-slate-100 border border-gray-300 text-slate-700 hover:bg-slate-200">
            Prev
          </Button>
          <Button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="bg-slate-100 border border-gray-300 text-slate-700 hover:bg-slate-200">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

