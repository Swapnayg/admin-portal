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
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      .then(setVendors);

    fetch('/api/analytics/products')
      .then((res) => res.json())
      .then(setProducts);
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
      .then(setAnalytics);
  }, [startDate, endDate, vendorId, productId]);

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </LocalizationProvider>
        <FormControl size="small" className="min-w-[200px]">
          <InputLabel>Vendor</InputLabel>
          <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)} label="Vendor">
            <MenuItem value="">All Vendors</MenuItem>
            {vendors.map((v) => (
              <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" className="min-w-[200px]">
          <InputLabel>Product</InputLabel>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)} label="Product">
            <MenuItem value="">All Products</MenuItem>
            {products.map((p) => (
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
              <Typography variant="h6">₹ {analytics.totalSales.toLocaleString()}</Typography>
            </CardContent></Card>
            <Card><CardContent>
              <Typography variant="subtitle2">Return Rate</Typography>
              <Typography variant="h6">{analytics.returnRate}%</Typography>
            </CardContent></Card>
            <Card><CardContent>
              <Typography variant="subtitle2">Top Vendor</Typography>
              <Typography variant="h6">{analytics.topVendor}</Typography>
            </CardContent></Card>
            <Card><CardContent>
              <Typography variant="subtitle2">Total Commission</Typography>
              <Typography variant="h6">₹ {analytics.totalCommission.toLocaleString()}</Typography>
            </CardContent></Card>
          </div>

          <div>
            <Typography variant="h6" gutterBottom>Revenue Over Months</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlySales}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <Typography variant="h6" gutterBottom>Products by Category</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {analytics.categoryBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042"][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <Typography variant="h6" gutterBottom>Top Products</Typography>
            <ul>
              {analytics.topProducts.map((p: any, i: number) => (
                <li key={i}>{p.name} - {p.sales} sales</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
