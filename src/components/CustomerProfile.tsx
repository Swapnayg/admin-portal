'use client'; 
import React from 'react';
import { useRouter, useParams  } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingCart, Package, Star } from 'lucide-react';
import Link from "next/link";

const CustomerProfile = () => {
  const router = useRouter();
  const params = useParams();

  const id = params.id;  
  
  const customer = {
    id: id || '1',
    name: 'John Doe',
    email: 'john@email.com',
    phone: '9999999999',
    status: 'Active',
    registeredOn: '01 Jan 2024',
    avatar: '/lovable-uploads/cb047ea6-0915-4c95-aaad-1c2e9c027cb5.png'
  };

  const orders = [
    {
      id: '#1001',
      date: '12-Jun-24',
      total: '₹5,000',
      status: 'Delivered'
    },
    {
      id: '#1003',
      date: '18-Jun-24',
      total: '₹3,200',
      status: 'Cancelled'
    }
  ];

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-700 hover:bg-slate-50">
              <ArrowLeft size={16} className="mr-2" />
              Back to Customers List
            </Button>
          </Link>
        </div>

        {/* Customer Profile Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100">
              <img 
                src={customer.avatar} 
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">{customer.name}</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={16} />
                  <span>Email: {customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={16} />
                  <span>Phone: {customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} />
                  <span>Registered on: {customer.registeredOn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">{customer.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Orders History</h3>
          </div>
          
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className={index > 0 ? 'border-t border-slate-200' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{order.total}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={order.status === 'Delivered' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

  );
};

export default CustomerProfile;
