
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ChevronDown, Ban } from 'lucide-react';

const SuspendedVendors = () => {
  const suspendedVendors = [
    {
      id: 1,
      name: 'Blocked Corp',
      email: 'blocked***@example.com',
      suspensionReason: 'Policy Violation',
      suspensionDate: '15 Mar 2023',
      originalRegistration: '10 Jan 2023'
    },
    {
      id: 2,
      name: 'Suspended Ltd',
      email: 'suspended***@example.com',
      suspensionReason: 'Fraudulent Activity',
      suspensionDate: '20 Mar 2023',
      originalRegistration: '05 Feb 2023'
    },
    {
      id: 3,
      name: 'Banned Solutions',
      email: 'banned***@example.com',
      suspensionReason: 'Multiple Violations',
      suspensionDate: '25 Mar 2023',
      originalRegistration: '15 Jan 2023'
    }
  ];

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ban className="text-red-600" size={24} />
            <h1 className="text-2xl font-semibold text-slate-900">Suspended Vendors</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search suspended vendors..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 hover:bg-slate-100">
                REASON
                <ChevronDown size={16} />
              </button>
              <Button size="sm" className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
                <Download size={14} />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Suspended Vendors Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Vendor Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Suspension Reason</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Suspension Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Original Registration</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {suspendedVendors.map((vendor, index) => (
                <tr key={vendor.id} className={index > 0 ? 'border-t border-slate-200' : ''}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{vendor.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{vendor.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className="bg-red-100 text-red-800">{vendor.suspensionReason}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{vendor.suspensionDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{vendor.originalRegistration}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
                        Review
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Reactivate
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

export default SuspendedVendors;
