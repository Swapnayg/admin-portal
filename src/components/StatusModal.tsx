'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useState } from 'react';

interface StatusModalProps {
  productId: number;
  currentStatus: string;
  onStatusChange: (id: number, status: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'text-green-600 border-green-600 hover:bg-green-50',
  REJECTED: 'text-red-600 border-red-600 hover:bg-red-50',
  SUSPENDED: 'text-gray-600 border-gray-400 hover:bg-gray-100',
  PENDING: 'text-orange-600 border-orange-500 hover:bg-orange-50',
};

export default function StatusModal({ productId, currentStatus, onStatusChange }: StatusModalProps) {
  const [status, setStatus] = useState(currentStatus);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
    try {
        setLoading(true);
        const res = await fetch(`/api/products/update-status?id=${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        });

        if (!res.ok) {
        const err = await res.json();
        console.error('Failed to update status:', err);
        return;
        }

        onStatusChange(productId, status);
        setOpen(false);
    } catch (error) {
        console.error('Error updating product status:', error);
    } finally {
        setLoading(false);
    }
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`h-8 px-3 text-xs border ${STATUS_STYLES[currentStatus] || 'text-blue-600 border-slate-300 hover:bg-blue-50'}`}
        >
          {currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6 rounded-xl shadow-xl border border-gray-200 bg-white">
        <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-800">
            Update Product Status
            </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-5">
            {/* Status Selection Section */}
            <div>
            <Label className="block text-sm font-medium text-slate-700 mb-3">
                Select New Status
            </Label>
            <Select value={status} onValueChange={(val) => setStatus(val)}>
                <SelectTrigger className="w-full h-10 rounded-md border border-slate-300 bg-white text-sm">
                {status}
                </SelectTrigger>
                <SelectContent className="bg-white z-[9999]">
                <SelectItem value="APPROVED">✅ Approved</SelectItem>
                <SelectItem value="REJECTED">❌ Rejected</SelectItem>
                <SelectItem value="SUSPENDED">⛔ Suspended</SelectItem>
                </SelectContent>
            </Select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="h-9 px-5 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-md cursor-pointer disabled:opacity-60"
                    >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
        </DialogContent>

    </Dialog>
  );
}
