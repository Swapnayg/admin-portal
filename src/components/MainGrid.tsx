"use client";

import useSWR from "swr";
import { useState } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar
} from "recharts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const colors = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#F472B6"];

export default function DashboardPage() {
  const [from, setFrom] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [url, setUrl] = useState(`/api/dashboard/data?from=${from}&to=${to}`);

  const { data, error, isLoading } = useSWR(url, fetcher);

  const handleRefresh = () => {
    setUrl(`/api/dashboard/data?from=${from}&to=${to}`);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load data</div>;

  const metrics = [
    { label: "Users", value: data?.users },
    { label: "Orders", value: data?.orders },
    { label: "Tickets", value: data?.tickets },
    { label: "Products", value: data?.products },
    { label: "Active Promotions", value: data?.activePromotions },
    { label: "Revenue", value: `₹${data?.revenue?.toFixed(2)}` },
    { label: "Commission", value: `₹${data?.commission?.toFixed(2)}` },
  ];

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <span className="mx-1">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-slate-600 text-white rounded shadow"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => (
          <Card key={idx} className="border border-gray-300">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-300">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Weekly Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.weeklyRevenue}>
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#34D399" fill="#BBF7D0" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-gray-300">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Top Product Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.categoryBreakdown}
                  dataKey="_count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name} (${entry._count})`}
                >
                  {data?.categoryBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-300">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Vendor Leaderboard</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.vendorBreakdown} layout="vertical">
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="name" fontSize={12} width={150} />
              <Tooltip />
              <Bar dataKey="_sum.total" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border border-gray-300">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Top Products (Revenue & Quantity)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <XAxis type="number" dataKey="_sum.price" name="Revenue" unit="₹" />
              <YAxis type="number" dataKey="_sum.quantity" name="Qty" />
              <ZAxis type="number" dataKey="_sum.commissionAmt" range={[60, 200]} name="Commission" />
              <Tooltip
                formatter={(value: any, name: any, props: any) => {
                  return [value, name];
                }}
                labelFormatter={(label: any, payload: any) => payload?.[0]?.payload?.name}
              />
              <Scatter data={data?.productRevenue} fill="#F59E0B" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
