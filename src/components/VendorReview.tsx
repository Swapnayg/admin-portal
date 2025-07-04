
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from "next/link";

const VendorReview = () => {
  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">New Vendor Review</h1>
        </div>

        {/* Review Card */}
        <div className="max-w-5xl w-full mx-auto bg-white rounded-lg border border-slate-200 p-8">
          <div className="text-center mb-8 overflow-x-auto">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Company: GearPro Pvt. Ltd.</h2>
            <Badge className="bg-orange-100 text-orange-800">
              <AlertTriangle size={14} className="mr-1" />
              Status: Pending
            </Badge>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">KYC Docs:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={18} />
                <span className="text-sm text-slate-700">GST Certificate</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={18} />
                <span className="text-sm text-slate-700">PAN Card</span>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="text-red-600" size={18} />
                <span className="text-sm text-slate-700">Address Proof</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Approve
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8">
              Reject
            </Button>
            <Button variant="outline" className="px-8 gap-2 bg-slate-700 hover:bg-slate-800 text-white">
              Request More Info
            </Button>
          </div>
        </div>
      </div>
  );
};

export default VendorReview;
