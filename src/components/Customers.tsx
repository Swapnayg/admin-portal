
import React, { useState } from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, Eye, Edit } from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@email.com',
      phone: '9999999999',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@email.com',
      phone: '8888888888',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert@email.com',
      phone: '7777777777',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@email.com',
      phone: '6666666666',
      status: 'Active'
    }
  ];

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-slate-50 border-slate-200"
              />
            </div>
            <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
            <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/customers/create">
                <Plus size={16} className="mr-2" />
                Add Customer
              </Link>
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id} className={index > 0 ? 'border-t border-slate-200' : ''}>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-medium text-slate-900">{customer.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className="bg-green-100 text-green-800">
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="border-slate-200 text-slate-600 hover:bg-slate-50">
                        <Link href={`/customers/${customer.id}`}>
                          <Eye size={14} className="mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="bg-slate-900 text-white hover:bg-slate-800">
                        <Link href={`/customers/edit/${customer.id}`}>
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-600">Page 1 of 5</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="border-slate-200 text-slate-400">Prev</Button>
              <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">Next</Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Customers;
