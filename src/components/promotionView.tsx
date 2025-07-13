'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Card
} from '@/components/ui/card';
import {
  Button
} from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import {
  ArrowLeft
} from 'lucide-react';
import clsx from 'clsx';

export default function PromotionViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<{ promotion: any; usages: any[] }>({ promotion: null, usages: [] });

  useEffect(() => {
    if (!id) return;

    fetch(`/api/promotions/view?id=${id}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => {});
  }, [id]);

  const totalBenefit = data.usages.reduce((sum, usage) => sum + usage.benefit, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700';
      case 'EXPIRED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const typeBadge = (type: string) => (
    <span className="inline-block bg-blue-100 text-blue-700 text-sm px-2 py-0.5 rounded-full">
      {type.replaceAll('_', ' ')}
    </span>
  );

  return (
    <div className="p-6 w-full">
      <div className="w-[90%] mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">🎁 Promotion Details</h1>
          <Button variant="secondary" onClick={() => router.push('/dashboard/promotions')} className="text-slate-700">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>

        {data.promotion && (
          <Card className="p-6 space-y-4 border border-gray-200 bg-white shadow-md rounded-xl">
            <div className="grid grid-cols-2 gap-4 text-slate-700">
              <div><strong>Title:</strong> {data.promotion.title}</div>
              <div><strong>Code:</strong> <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded">{data.promotion.code}</span></div>
              <div><strong>Type:</strong> {typeBadge(data.promotion.type)}</div>
              <div><strong>Discount:</strong> <span className="text-emerald-600 font-semibold">{data.promotion.discount}%</span></div>
              <div><strong>Valid From:</strong> {format(new Date(data.promotion.validFrom), 'dd MMM yyyy')}</div>
              <div><strong>Valid To:</strong> {format(new Date(data.promotion.validTo), 'dd MMM yyyy')}</div>
              <div>
                <strong>Status:</strong>
                <span className={clsx('ml-2 text-sm px-2 py-0.5 rounded-full font-medium', getStatusColor(data.promotion.status))}>
                  {data.promotion.status}
                </span>
              </div>
              <div>
                <strong>Total Benefit Given:</strong>
                <span className="text-lg text-green-700 font-bold ml-2">₹{totalBenefit.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4 border border-gray-200 bg-white shadow-sm rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">📊 Usage History</h2>
          {data.usages.length === 0 ? (
            <p className="text-slate-500">No usage data available.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b border-slate-300">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Used On</TableHead>
                  <TableHead>Amount Spent</TableHead>
                  <TableHead>Commission Earned</TableHead>
                  <TableHead>Promotion Benefit</TableHead>
                  <TableHead>Total Benefit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.usages.map((usage, index) => (
                  <TableRow
                    key={usage.id}
                    className={clsx(
                      'border-b border-slate-200 hover:bg-slate-50 transition-colors',
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    )}
                  >
                    <TableCell>{usage.user.username}</TableCell>
                    <TableCell>{usage.user.email}</TableCell>
                    <TableCell>{format(new Date(usage.usedAt), 'dd MMM yyyy')}</TableCell>
                    <TableCell>₹{usage.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>₹{usage.commission.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600 font-medium">₹{usage.benefit.toLocaleString()}</TableCell>
                    <TableCell className="text-sky-600">₹{usage.totalUserPromotionBenefit?.toLocaleString() ?? '0'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
