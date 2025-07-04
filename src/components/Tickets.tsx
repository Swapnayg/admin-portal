
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ChevronDown } from 'lucide-react';
import Link from "next/link";

const Tickets = () => {
  const tickets = [
    {
      id: 'TKT-3201',
      from: 'Vendor: Acme',
      subject: 'Missing Order',
      status: 'Open',
      statusColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'TKT-3202',
      from: 'Cust: Ravi',
      subject: 'Refund Delay',
      status: 'Responded',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm">All</Button>
            <Button variant="ghost" size="sm">Open</Button>
            <Button variant="ghost" size="sm">Closed</Button>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option>All Vendors</option>
            </select>
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option>All Customers</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button size="sm" className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
              <Download size={14} />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Support Tickets Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Support Tickets</h2>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">TICKET ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">FROM</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">SUBJECT</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">STATUS</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tickets.map((ticket, index) => (
                <tr key={ticket.id} className={index > 0 ? 'border-t border-slate-200' : ''}>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/tickets/${ticket.id.split('-')[1]}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {ticket.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{ticket.from}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{ticket.subject}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={ticket.statusColor}>{ticket.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default Tickets;
