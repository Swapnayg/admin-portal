// File: app/(dashboard)/payouts/view/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PayoutDetail {
  id: string;
  vendor: string;
  amount: number;
  status: "Approved" | "Pending" | "Rejected";
  commissionAmount: number;
  method?: string;
  date: string;
}

export default function PayoutViewPage({ payoutId }: { payoutId: number }) {
  const { id } = useParams();
  const [payout, setPayout] = useState<PayoutDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPayout = async () => {
      try {
        const res = await fetch(`/api/payouts/get-payout?id=${id}`);
        const data = await res.json();
        setPayout(data);
      } catch (error) {
        console.error("Failed to fetch payout", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayout();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!payout) return <p className="p-4 text-red-600">Payout not found.</p>;

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-3xl mx-auto bg-white p-6 pt-8 rounded shadow border border-gray-200 mt-20">
            <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Payout Details</h2>
          <Link
            href="/payouts"
            className="text-slate-800 hover:underline text-sm font-medium"
          >
            ← Back to Payouts
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Payout ID</p>
            <p className="font-medium">{payout.id}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Date</p>
            <p className="font-medium">{payout.date}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Vendor</p>
            <p className="font-medium">{payout.vendor}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Amount</p>
            <p className="font-medium">₹{payout.amount.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Commission</p>
            <p className="font-medium">₹{payout.commissionAmount.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Status</p>
            <Badge
              className={cn(
                "text-xs px-2 py-0.5 rounded",
                payout.status === "Approved" && "bg-green-100 text-green-700",
                payout.status === "Pending" && "bg-yellow-100 text-yellow-700",
                payout.status === "Rejected" && "bg-red-100 text-red-700"
              )}
            >
              {payout.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
