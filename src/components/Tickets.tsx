'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { ArrowUpDown, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';
import TicketViewModal from './TicketViewModal';

interface Message {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
  isAdmin: boolean;
}


interface  Ticket {
  id: number;
  subject: string;
  message: string;
  type: 'GENERAL' | 'TECHNICAL_ISSUE' | 'ACCOUNT_CLEARANCE' | 'REACTIVATE_ACCOUNT' | 'SUPPORT' | string; // expand as per your enum
  status: 'OPEN' | 'RESPONDED' | 'CLOSED';
  name?: string | null;
  email?: string | null;
  fileUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  userId?: number | null;
  vendorId?: number | null;
  customerId?: number | null;
  vendor?: {
    user: {
      username: string;
    };
  } | null;
  customer?: {
    user: {
      username: string;
    };
  } | null;
  messages: Message[];
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'id' | 'status' | 'subject'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const perPage = 10;

  useEffect(() => {
    fetch(`/api/tickets/all-tickets?page=${page}&sort=${sortKey}&order=${sortOrder}`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.tickets);
      });      
  }, [page, sortKey, sortOrder]);


  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else setSortKey(key);
  };

  const getFromLabel = (ticket: Ticket) => {
    if (ticket.vendor) return `Vendor: ${ticket.vendor?.user?.username}`;
    if (ticket.customer) return `Cust: ${ticket.customer?.user?.username}`;
    return ticket.name || 'Anonymous';
  };

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'OPEN':
        return <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs">Open</span>;
      case 'RESPONDED':
        return <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs">Responded</span>;
      case 'CLOSED':
        return <span className="text-gray-600 bg-gray-200 px-2 py-1 rounded text-xs">Closed</span>;
    }
  };

  const handleExport = () => {
    const exportData = tickets.map(t => ({
      ID: `TKT-${t.id}`,
      From: getFromLabel(t),
      Subject: t.subject,
      Type: t.type,
      Status: t.status,
      Date: new Date(t.createdAt).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');
    XLSX.writeFile(workbook, 'Support_Tickets.xlsx');
  };

   const filteredTickets = tickets.filter((ticket) => {
    const subject = ticket.subject?.toLowerCase() || '';
    const type = ticket.type?.toLowerCase() || '';
    const status = ticket.status?.toLowerCase() || '';
    const from = getFromLabel(ticket)?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();

    return (
      subject.includes(term) ||
      from.includes(term) ||
      type.includes(term) ||
      status.includes(term)
    );
  });

  const handleOpenModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (ticketId: number, status: Ticket['status'], reply: string) => {
    await fetch(`/api/tickets/reply?ticketId=${ticketId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, reply }),
    });
    // Refresh tickets
    fetch(`/api/tickets/all-tickets?page=${page}&sort=${sortKey}&order=${sortOrder}`)
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets));
  };

  return (
    <div className="p-6 w-full max-w-full">
      <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-4 z-10 relative">
        <Select onValueChange={(val) => console.log('Role filter:', val)}>
          <SelectTrigger className="w-[200px] border border-gray-300 bg-white">All Roles</SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search..."
          className="w-full md:w-1/3 border border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button onClick={handleExport} className="bg-slate-600 hover:bg-slate-700 text-white cursor-pointer">
          Export Excel
        </Button>
      </div>

      <div className="overflow-x-auto w-full">
        <Table className="w-full border border-gray-200">
         <TableHeader>
          <TableRow className="border border-gray-200">
            <TableHead onClick={() => handleSort('id')} className="cursor-pointer border border-gray-200">
              TICKET ID <ArrowUpDown size={14} className="inline ml-1" />
            </TableHead>
            <TableHead className="border border-gray-200">FROM</TableHead>
            <TableHead onClick={() => handleSort('subject')} className="cursor-pointer border border-gray-200">
              SUBJECT <ArrowUpDown size={14} className="inline ml-1" />
            </TableHead>
            <TableHead className="border border-gray-200">TYPE</TableHead>
            <TableHead onClick={() => handleSort('status')} className="cursor-pointer border border-gray-200">
              STATUS <ArrowUpDown size={14} className="inline ml-1" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow key={ticket.id} className="border border-gray-200">
            <TableCell className="border border-gray-200">
              <button
                onClick={() => handleOpenModal(ticket)}
                className="text-blue-600 font-medium hover:underline cursor-pointer"
              >
                TKT-{ticket.id}
              </button>
            </TableCell>
              <TableCell className="border border-gray-200">{getFromLabel(ticket)}</TableCell>
              <TableCell className="border border-gray-200">{ticket.subject}</TableCell>
              <TableCell className="border border-gray-200">{ticket.type}</TableCell>
              <TableCell className="border border-gray-200">{getStatusBadge(ticket.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="ghost" className="text-sm cursor-pointer" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Previous
        </Button>
        <Button variant="ghost" className="text-sm cursor-pointer" onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
      <TicketViewModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={selectedTicket}
        onStatusChange={handleStatusChange}
      />

    </div>
    
  );
}
