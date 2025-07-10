'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ErrorDialog } from "@/components/ErrorDialog";

interface Message {
  id: number;
  content: string;
  isAdmin: boolean;
  userId?: number;
  createdAt: string;
}

interface Ticket {
  id: number;
  subject: string;
  message: string;
  type: string;
  status: 'OPEN' | 'RESPONDED' | 'CLOSED';
  vendor?: { user: { name: string } };
  customer?: { user: { name: string } };
  messages: Message[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onStatusChange: (
    ticketId: number,
    status: Ticket['status'],
    reply: string
  ) => void;
}

export default function TicketViewModal({
  open,
  onClose,
  ticket,
  onStatusChange,
}: Props) {
    const [reply, setReply] = useState('');
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<Ticket['status']>('OPEN');

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setReply('');
    }
  }, [ticket]);

  if (!ticket) return null;

  const isReplied = ticket?.messages?.some((msg) => msg.isAdmin) ?? false;

  const getFrom = () =>
    ticket.vendor
      ? `Vendor: ${ticket.vendor.user.name}`
      : ticket.customer
      ? `Customer: ${ticket.customer.user.name}`
      : 'Anonymous';


    const handleSubmit = async () => {
        if (!ticket) return;

        const trimmedReply = reply.trim();

        if (!trimmedReply) {
            setErrorMessage('Reply message cannot be empty.');
            setErrorDialogOpen(true);
            return;
        }

        if (status === 'OPEN') {
            setErrorMessage('Please select a valid status (RESPONDED or CLOSED) before submitting.');
            setErrorDialogOpen(true);
            return;
        }

        setIsLoading(true);

        try {
            await onStatusChange(ticket.id, status, trimmedReply);
            onClose();
        } catch (error) {
            console.error('Error during reply submission:', error);
            setErrorMessage('An unexpected error occurred while submitting your reply.');
            setErrorDialogOpen(true);
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border border-gray-200 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Ticket #{ticket.id}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">{getFrom()}</p>
        </DialogHeader>

        {/* Subject */}
        <div className="mt-2 mb-2 border border-gray-300 bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-500 font-semibold mb-1">Subject:</p>
          <p className="text-sm text-gray-800">{ticket.subject}</p>
          
          <p className="text-xs text-gray-500 font-semibold mt-4">Message:</p>
            <p className="text-sm text-gray-700">{ticket.message}</p>
          <p className="text-xs mt-2 text-slate-500 uppercase">
            Type: {ticket.type}
          </p>
        </div>

        {ticket.messages && ticket.messages.length > 0 && (
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded p-3 bg-white space-y-2">
                {ticket.messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`p-2 rounded text-sm border border-gray-200 ${
                    msg.isAdmin
                        ? 'bg-slate-50 ml-auto text-right'
                        : 'bg-gray-100 text-left'
                    }`}
                >
                    <div className="font-medium">
                    {msg.isAdmin ? 'Admin' : 'User'}:
                    </div>
                    <div>{msg.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                    </div>
                </div>
                ))}
            </div>
            )}

        {ticket.status !== 'CLOSED' && (
            <div className="mt-4 space-y-2">
                {/* Reply Box */}
                <Textarea
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="border border-gray-300"
                />

                {/* Status Dropdown */}
                <Select
            onValueChange={(val: Ticket['status']) => setStatus(val)}
            value={status}
            >
            <SelectTrigger className="w-full border border-gray-300 bg-white">
                {status}
            </SelectTrigger>

            <SelectContent className="bg-white z-[100]">
                {status !== 'RESPONDED' && (
                <SelectItem value="RESPONDED">RESPONDED</SelectItem>
                )}
                <SelectItem value="CLOSED">CLOSED</SelectItem>
            </SelectContent>
            </Select>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
            {/* Footer */}
                <DialogFooter className="mt-4">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="border border-gray-300 cursor-pointer"
                >
                    Close
                </Button>

              <Button
                  onClick={handleSubmit}
                  className="bg-slate-600 text-white hover:bg-slate-700 cursor-pointer"
                  disabled={isLoading}
              >
                  {isLoading ? 'Submitting...' : 'Submit'}
              </Button>

                </DialogFooter>
            </div>
        </div>
        )}
      </DialogContent>
    <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="Registration Failed"
        description={errorMessage}
    />
    </Dialog>
    
  );
}
