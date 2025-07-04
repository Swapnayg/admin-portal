
import React, { useState } from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Edit } from 'lucide-react';

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const promotions = [
    {
      id: 1,
      name: 'NewYear50',
      type: 'Coupon',
      status: 'Active',
      validity: 'Till 31 Jan'
    },
    {
      id: 2,
      name: 'FlashSale',
      type: 'Category',
      status: 'Expired',
      validity: 'Till 15 Mar'
    },
    {
      id: 3,
      name: 'SummerDiscount',
      type: 'Product',
      status: 'Active',
      validity: 'Till 31 Aug'
    },
    {
      id: 4,
      name: 'LoyaltyBonus',
      type: 'User Group',
      status: 'Expired',
      validity: 'Till 30 Apr'
    }
  ];

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Promotions</h1>
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
            <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/promotions/create">
                <Plus size={16} className="mr-2" />
                Create Promotion
              </Link>
            </Button>
          </div>
        </div>

        {/* Promotions Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Validity</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion, index) => (
                <tr key={promotion.id} className={index > 0 ? 'border-t border-slate-200' : ''}>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-medium text-slate-900">{promotion.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{promotion.type}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={promotion.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {promotion.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{promotion.validity}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="border-slate-200 text-slate-600 hover:bg-slate-50">
                        <Link href={`/promotions/${promotion.id}`}>
                          <Eye size={14} className="mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="bg-slate-900 text-white hover:bg-slate-800">
                        <Link href={`/promotions/edit/${promotion.id}`}>
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
        </div>
      </div>
  );
};

export default Promotions;
