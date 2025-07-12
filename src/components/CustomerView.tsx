'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, CreditCard, Percent, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export default function CustomerDashboard({ customerId }: { customerId: number }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/dashboard?id=${customerId}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) return <Skeleton className="w-full h-[80vh]" />;
  if (!data) return <div className="text-red-500">Failed to load dashboard.</div>;

  const { customer, recentOrders, topProducts, topVendors, totalSpend, totalCommissionEarned } = data;

  const getStatusColor = (status: string) => {
    return clsx('text-xs font-semibold px-2 py-1 rounded-full', {
      'bg-yellow-100 text-yellow-800': status === 'PENDING',
      'bg-blue-100 text-blue-800': status === 'SHIPPED',
      'bg-green-100 text-green-800': status === 'DELIVERED',
      'bg-violet-100 text-violet-800': status === 'RETURNED',
      'bg-red-100 text-red-800': status === 'CANCELLED',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Back Button */}
     {/* Header Row with Back Button and Badge */}
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
        <Button
        variant="ghost"
        className="text-sm text-slate-600 flex items-center gap-2 hover:text-slate-800 cursor-pointer"
        onClick={() => router.push('/customers')}
        >
        <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Button>
        <h1 className="text-3xl font-semibold text-slate-900">Customer Dashboard</h1>
    </div>
    <Badge className="text-sm bg-slate-200 text-slate-800">Customer ID: {customer.id}</Badge>
    </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard icon={<User className="w-6 h-6" />} title="Customer">
          <p className="text-base font-medium text-slate-800">{customer.name}</p>
          <p className="text-sm text-slate-500">{customer.email}</p>
        </InfoCard>

        <InfoCard icon={<CreditCard className="w-6 h-6" />} title="Total Spend">
          <p className="text-2xl font-bold text-green-600">₹{totalSpend.toFixed(2)}</p>
        </InfoCard>

        <InfoCard icon={<Percent className="w-6 h-6" />} title="Commission Earned">
          <p className="text-2xl font-bold text-indigo-600">₹{totalCommissionEarned.toFixed(2)}</p>
        </InfoCard>
      </div>

      {/* Recent Orders */}
      <Section title="Recent Orders">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recentOrders.map((order: any) => (
            <Card key={order.id} className="border border-slate-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-5 space-y-2">
                <div className="text-lg font-semibold text-slate-800">Order #{order.id}</div>
                <div className="text-sm text-slate-600">Vendor: {order.vendor.name}</div>
                <div className="text-sm text-slate-500">
                  Products: {order.items.length} | Date: {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-slate-700">Total: ₹{order.total.toFixed(2)}</div>
                <span className={getStatusColor(order.status)}>{order.status}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Top Products */}
      <Section title="Top Products">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProducts.map((product: any) => (
            <Card key={product.id} className="border border-slate-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-5 flex gap-4 items-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded object-cover border border-gray-200"
                />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-800">{product.name}</div>
                  <div className="text-sm text-green-600">₹{product.price.toFixed(2)}</div>
                  <div className="text-sm text-yellow-500">★ {product.avgRating?.toFixed(1) ?? 'N/A'}</div>
                  <div className="text-xs text-slate-500">Ordered: {product.quantityOrdered}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Top Vendors */}
      <Section title="Top Vendors">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topVendors.map((vendor: any) => (
            <Card key={vendor.id} className="border border-slate-200 shadow-sm hover:shadow-md transition">
              <CardContent className="p-5 space-y-2">
                <div className="text-base font-semibold text-slate-800">{vendor.businessName}</div>
                <div className="text-sm text-slate-600">
                  {vendor.city}, {vendor.state}
                </div>
                <div className="text-sm text-slate-500">Total Orders: {vendor.ordersCount}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5 flex items-start gap-4 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="p-2 rounded-full bg-slate-100 text-slate-800">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold text-slate-600 mb-1">{title}</h4>
        {children}
      </div>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}
