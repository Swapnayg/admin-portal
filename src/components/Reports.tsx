'use client';

import { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function SalesAnalyticsDashboard() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [vendorId, setVendorId] = useState<number | ''>('');
  const [productId, setProductId] = useState<number | ''>('');
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics/vendors')
      .then((res) => res.json())
      .then((data) => setVendors(data || []))
      .catch(() => setVendors([]));

    fetch('/api/analytics/products')
      .then((res) => res.json())
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const params = new URLSearchParams({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      ...(vendorId && { vendorId: vendorId.toString() }),
      ...(productId && { productId: productId.toString() }),
    });

    fetch(`/api/analytics/sales?${params}`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data || null))
      .catch(() => setAnalytics(null));
  }, [startDate, endDate, vendorId, productId]);

  const lineChartData = MONTHS.map((month) => {
    const match = analytics?.monthlySales?.find((m: any) => m.month === month);
    return {
      month,
      value: match?.value ?? 0,
    };
  });

  return (
    <div className="w-full px-6 py-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 w-full">
        <div className="w-full sm:w-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date || dayjs())}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </LocalizationProvider>
        </div>

        <div className="w-full sm:w-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date || dayjs())}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </LocalizationProvider>
        </div>

        <FormControl size="small" className="min-w-[300px] w-full sm:w-[300px]">
          <InputLabel>Vendor</InputLabel>
          <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)} label="Vendor" fullWidth>
            <MenuItem value="">All Vendors</MenuItem>
            {vendors?.map((v) => (
              <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className="min-w-[250px] w-full sm:w-[250px]">
          <InputLabel>Product</InputLabel>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)} label="Product" fullWidth>
            <MenuItem value="">All Products</MenuItem>
            {products?.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent>
              <Typography variant="subtitle2">Total Sales</Typography>
              <Typography variant="h6">₹ {analytics.totalSales?.toLocaleString?.() || 0}</Typography>
            </CardContent></Card>
            <Card><CardContent>
              <Typography variant="subtitle2">Return Rate</Typography>
              <Typography variant="h6">{analytics.returnRate ?? 0}%</Typography>
            </CardContent></Card>
            <Card><CardContent>
              <Typography variant="subtitle2">Top Vendor</Typography>
              <Typography variant="h6">{analytics.topVendor || 'N/A'}</Typography>
            </CardContent></Card>
            <Card><CardContent>
              <Typography variant="subtitle2">Total Commission</Typography>
              <Typography variant="h6">₹ {analytics.totalCommission?.toLocaleString?.() || 0}</Typography>
            </CardContent></Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="h6" gutterBottom>Revenue Over Months</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <XAxis dataKey="month">
                    <Label value="Months" offset={-5} position="insideBottom" />
                  </XAxis>
                  <YAxis tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}>
                    <Label angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} value="Revenue" />
                  </YAxis>
                  <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} label />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <Typography variant="h6" gutterBottom>Products by Category</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryBreakdown || []}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={(entry) => `${entry.category}: ${entry.value}`}
                  >
                    {(analytics.categoryBreakdown || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042"][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <Typography variant="h6" gutterBottom>Top Products</Typography>
            <div className="border rounded-md divide-y bg-gray-100 border-gray-300 divide-gray-300">
              {(analytics.topProducts || []).map((p: any, i: number) => {
                const isHigh = p.commissionEarned > 10000;
                const badge = isHigh ? <Chip label="High" size="small" color="success" className="ml-2" /> : <Chip label="Normal" size="small" className="ml-2" />;
                const total = (p.price || 0) * (p.sales || 0);

                return (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-4 ${
                      isHigh ? 'bg-green-50 border-l-4 border-green-500' : ''
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center">{p.name || 'Unnamed'} {badge}</div>
                      <div className="text-sm text-gray-600">
                        ₹ {p.price?.toLocaleString?.() || 0} × {p.sales || 0} units = ₹ {total.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-700">
                      <div>Commission: {p.commissionRate ?? 0}%</div>
                      <div className="font-semibold text-green-700">₹ {p.commissionEarned?.toLocaleString?.() || 0}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
