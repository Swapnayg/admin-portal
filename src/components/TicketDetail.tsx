
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Paperclip, Check } from 'lucide-react';
import Link from "next/link";

const TicketDetail = () => {
  const [newMessage, setNewMessage] = useState('');

  const messages = [
    {
      sender: 'Acme',
      message: 'We have an urgent query regarding payout...',
      timestamp: 'Earlier'
    },
    {
      sender: 'Admin',
      message: 'Sure, let me check that for you.',
      timestamp: 'Just now'
    }
  ];

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Ticket: TKT-3201</h1>
              <Badge className="bg-orange-100 text-orange-800 mt-1">Open</Badge>
            </div>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="mb-4">
            <div className="text-sm text-slate-600 mb-1">From: <span className="font-medium text-slate-900">Vendor – Acme Tools</span></div>
            <div className="text-sm text-slate-600">Subject: <span className="font-medium text-slate-900">Missing Order Items</span></div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Message Thread:</h3>
          </div>
          
          <div className="p-6 space-y-6 min-h-96">
            {messages.map((msg, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    {msg.sender === 'Acme' ? '🏢' : '👤'}
                  </div>
                  <div className="font-medium text-sm text-slate-900">{msg.sender}:</div>
                </div>
                <div className="ml-10 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  "{msg.message}"
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a reply..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex flex-col justify-between">
                <Button variant="ghost" size="sm">
                  <Paperclip size={16} />
                  Attach File
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Check size={16} />
                  Mark as Resolved
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TicketDetail;
