
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, Package, CreditCard, ShoppingCart, CheckCircle } from 'lucide-react';
import Link from "next/link";

const VendorProfile = () => {
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
          <h1 className="text-2xl font-semibold text-slate-900">Vendor Profile: Acme Tools</h1>
        </div>

        {/* Vendor Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-slate-200 rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/cb047ea6-0915-4c95-aaad-1c2e9c027cb5.png" 
                alt="Vendor" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact Info:</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-700">Email: acme@example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-700">Phone: +91 999...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-700">Joined: 12 Jan 2024</span>
                  </div>
                </div>
              </div>
              
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Suspend Vendor
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                Product Summary
              </button>
              <button className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900">
                Payouts
              </button>
              <button className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900">
                Orders
              </button>
              <button className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900">
                KYC
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-slate-400" />
                <div>
                  <div className="text-2xl font-semibold text-slate-900">20</div>
                  <div className="text-sm text-slate-600">Active Products</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-slate-400" />
                <div>
                  <div className="text-2xl font-semibold text-slate-900">₹45,000</div>
                  <div className="text-sm text-slate-600">Total Revenue</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-slate-400" />
                <div>
                  <div className="text-2xl font-semibold text-slate-900">210</div>
                  <div className="text-sm text-slate-600">Orders</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <div>
                  <div className="text-lg font-semibold text-slate-900">Verified</div>
                  <div className="text-sm text-slate-600">KYC Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default VendorProfile;
