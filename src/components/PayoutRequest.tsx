
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import Link from "next/link";

export default function PayoutRequest() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Payout Request</h1>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-gray-200 pb-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">VENDOR DETAILS</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Vendor:</span> GearPro</p>
                <p><span className="font-medium">Request Date:</span> 20 Jun 2025</p>
                <p><span className="font-medium">Amount:</span> ₹12,000</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <StatusBadge status="Pending" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">BANK DETAILS</h3>
              <div className="space-y-2">
                <p><span className="font-medium">A/C:</span> XXXX-2245</p>
                <p><span className="font-medium">IFSC:</span> HDFC0001234</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-b border-gray-200 pb-6">
            <h3 className="text-sm font-medium text-gray-500">COMMENT BOX</h3>
            <Textarea 
              placeholder="Add your comments here..."
              className="min-h-32 border border-gray-200"
            />
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <Button variant="destructive"  className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">Reject</Button>
            <Button  className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">Approve Payout</Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
