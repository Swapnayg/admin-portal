
import React, { useState } from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Search, ChevronDown, Edit, Eye } from 'lucide-react';

const TemplateManagement = () => {
  const templates = [
    {
      event: 'Order Shipped',
      channel: 'Email + SMS',
      id: 1,
      status: 'Active'
    },
    {
      event: 'Vendor Approved',
      channel: 'Email',
      id: 2,
      status: 'Active'
    },
    {
      event: 'Payment Confirmation',
      channel: 'Email + SMS',
      id: 3,
      status: 'Draft'
    }
  ];

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="text-slate-600" size={24} />
            <h1 className="text-2xl font-semibold text-slate-900">Template Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search templates..."
                className="pl-10 w-64 bg-slate-50 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                Filter: Event Type
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </div>
            <Link href="/template-editor">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                + Create Template
              </Button>
            </Link>
          </div>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {templates.map((template, index) => (
                <tr key={template.id} className={index > 0 ? 'border-t border-slate-200' : ''}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {template.event}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {template.channel}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={template.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }>
                      {template.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Link href={`/template-details/${template.id}`}>
                        <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/template-editor/${template.id}`}>
                        <Button size="sm" className="bg-slate-600 hover:bg-slate-700 text-white">
                          <Edit size={16} className="mr-1" />
                          Edit Template
                        </Button>
                      </Link>
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

export default TemplateManagement;
