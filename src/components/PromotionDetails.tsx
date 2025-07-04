
import React from 'react';
import { useRouter, useParams  } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";

const PromotionDetails = () => {
  const params = useParams();
 
  const id = params.id;  
  
  const promotion = {
    id: id || '1',
    name: 'NewYear50',
    type: 'Coupon',
    discount: '50',
    validFrom: '01 Jan - 31 Jan 2025',
    appliesTo: 'All Products',
    status: 'Active',
    description: '50% off on all products for New Year celebration.',
    eligibleUsers: [
      'John Doe',
      'Industrial Co. Ltd'
    ]
  };

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/promotions">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-700 hover:bg-slate-50">
              <ArrowLeft size={16} className="mr-2" />
              Back to Promotions
            </Button>
          </Link>
        </div>

        {/* Promotion Details */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Promotion: {promotion.name}</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <span className="text-slate-600">Type: </span>
                  <span className="text-slate-900 font-medium">{promotion.type}</span>
                </div>
                <div className="mb-4">
                  <span className="text-slate-600">Discount: </span>
                  <span className="text-slate-900 font-medium">{promotion.discount}%</span>
                </div>
                <div className="mb-4">
                  <span className="text-slate-600">Validity: </span>
                  <span className="text-slate-900 font-medium">{promotion.validFrom}</span>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <span className="text-slate-600">Applies to: </span>
                  <span className="text-slate-900 font-medium">{promotion.appliesTo}</span>
                </div>
                <div className="mb-4">
                  <span className="text-slate-600">Status: </span>
                  <Badge className="bg-green-100 text-green-800">{promotion.status}</Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <span className="text-slate-600">Description: </span>
              <p className="text-slate-900 mt-2">{promotion.description}</p>
            </div>
          </div>
        </div>

        {/* Eligible Users */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Eligible Users</h3>
          <div className="space-y-2">
            {promotion.eligibleUsers.map((user, index) => (
              <div key={index} className="text-slate-900">
                {user}
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default PromotionDetails;
