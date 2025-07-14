"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthlySummary {
  month: string;
  vendors: number;
  products: number;
  customers: number;
  orders: number;
  revenue: number;
  commission: number;
  netRevenue: number;
}

interface SummaryData {
  monthWise: MonthlySummary[];
  total: {
    vendors: number;
    products: number;
    customers: number;
    orders: number;
    gross: number;
    commission: number;
    expenses: number;
    netRevenue: number;
  };
}

interface BreakdownItem { id: number; name: string; orders?: number; quantity?: number; revenue: number; commission?: number; netRevenue?: number; }
interface CurrentMonthData {
  label: string;
  vendorBreakdown: BreakdownItem[];
  productBreakdown: BreakdownItem[];
  categoryBreakdown: BreakdownItem[];
}

interface Vendor {
  id: number;
  businessName: string;
}

interface ProductCategory {
  id: number;
  name: string;
}

export default function AdminAccountSummaryPage() {
  const [from, setFrom] = useState<string>("2025-01-01");
  const [to, setTo] = useState<string>("2025-07-01");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [vendorCategory, setVendorCategory] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [currentMonthData, setCurrentMonthData] = useState<CurrentMonthData | null>(null);

  const fetchData = async () => {
    const query = new URLSearchParams({ from, to });
    if (vendorCategory) query.append("vendorCategory", vendorCategory);
    if (productCategory) query.append("productCategory", productCategory);
    const res = await fetch(`/api/admin/summary?${query.toString()}`);
    const data = await res.json();
    setSummary(data.summary);
    setCurrentMonthData(data.currentMonth);
  };


  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch("/api/products/metadata");
        const data = await res.json();
        setVendors(data.vendors || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load metadata", err);
      } finally {
        setMetaLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
  if (!from || !to) return;
  fetchData();
}, [from, to, vendorCategory, productCategory]);

  const exportToExcel = () => {
    if (!summary) return;

    const wsData = [
      ["Month", "Vendors", "Products", "Customers", "Orders", "Revenue (₹)", "Commission (₹)", "Net Revenue (₹)"],
      ...summary.monthWise.map((row) => [
        row.month,
        row.vendors,
        row.products,
        row.customers,
        row.orders,
        row.revenue,
        row.commission,
        row.netRevenue,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `AdminSummary_${from}_to_${to}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 w-full">
           <div className="overflow-x-auto">
        <div className="flex flex-nowrap items-end gap-x-4 border border-gray-300 p-4 rounded-md w-fit min-w-full">
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border-gray-300 min-w-[180px]"
          />
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border-gray-300 min-w-[180px]"
          />

          {/* Vendor Select Dropdown */}
          <Select
            onValueChange={(val) => setVendorCategory(val === "all" ? "" : val)}
            value={vendorCategory || "all"}
          >
            <SelectTrigger className="border-gray-300 bg-white min-w-[200px]">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[100]">
              <SelectItem value="all">All</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={String(vendor.id)}>
                  {vendor.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Product Category Select Dropdown */}
          <Select
            onValueChange={(val) => setProductCategory(val === "all" ? "" : val)}
            value={productCategory || "all"}
          >
            <SelectTrigger className="border-gray-300 bg-white min-w-[200px]">
              <SelectValue placeholder="Product Category" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[100]">
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={fetchData} className="bg-slate-800 hover:bg-slate-700 text-white border border-gray-300 min-w-[120px] cursor-pointer">
            Filter
          </Button>

          <Button
            onClick={exportToExcel}
            className="bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 min-w-[160px] cursor-pointer"
          >
            <Download size={16} /> Export to Excel
          </Button>
        </div>
      </div>

     {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <p>Vendors</p>
              <h2 className="text-2xl font-bold">{summary.total.vendors}</h2>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <p>Products</p>
              <h2 className="text-2xl font-bold">{summary.total.products}</h2>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <p>Customers</p>
              <h2 className="text-2xl font-bold">{summary.total.customers}</h2>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <p>Orders</p>
              <h2 className="text-2xl font-bold">{summary.total.orders}</h2>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <p>Gross</p>
              <h2 className="text-2xl font-bold text-green-600">
                ₹{summary.total.gross.toLocaleString()}
              </h2>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <p>Commission</p>
              <h2 className="text-2xl font-bold text-blue-600">
                ₹{summary.total.commission.toLocaleString()}
              </h2>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <p>Expenses</p>
              <h2 className="text-2xl font-bold text-red-600">
                ₹{summary.total.expenses.toLocaleString()}
              </h2>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <p>Net Revenue</p>
              <h2 className="text-2xl font-bold text-purple-600">
                ₹{summary.total.netRevenue.toLocaleString()}
              </h2>
            </CardContent>
          </Card>
        </div>
      )}
          <div>
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <Table>
            <TableHeader className="border-b-0">
              <TableRow className="bg-gray-50 text-slate-600 border-b border-gray-200">
                {/* Headers */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary?.monthWise.map((row, idx) => (
                <TableRow key={idx} className={`text-slate-700 ${idx < summary.monthWise.length - 1 ? "border-b border-gray-200" : ""}`}>
                  {/* Row cells */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Current Month Breakdown */}
      {currentMonthData && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Details for {currentMonthData.label}</h3>

          {/* Vendor Breakdown */}
          <div>
            <h4 className="font-semibold mb-2">Vendor-wise Breakdown</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-md mb-4">
              <Table>
                <TableHeader className="border-b-0">
                  <TableRow className="bg-gray-50 text-slate-600 border-b border-gray-200">
                    <TableHead>Vendor</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Revenue (₹)</TableHead>
                    <TableHead>Commission (₹)</TableHead>
                    <TableHead>Net Revenue (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMonthData.vendorBreakdown.map((v) => (
                    <TableRow key={v.id} className="text-slate-700 border-b border-gray-200">
                      <TableCell className="text-sm">{v.name}</TableCell>
                      <TableCell className="text-sm">{v.orders}</TableCell>
                      <TableCell className="text-sm">₹{v.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">₹{v.commission?.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">₹{v.netRevenue?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Product Breakdown */}
          <div>
            <h4 className="font-semibold mb-2">Product-wise Breakdown</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-md mb-4">
              <Table>
                <TableHeader className="border-b-0">
                  <TableRow className="bg-gray-50 text-slate-600 border-b border-gray-200">
                    <TableHead>Product</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Revenue (₹)</TableHead>
                    <TableHead>Commission (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMonthData.productBreakdown.map((p) => (
                    <TableRow key={p.id} className="text-slate-700 border-b border-gray-200">
                      <TableCell className="text-sm">{p.name}</TableCell>
                      <TableCell className="text-sm">{p.quantity}</TableCell>
                      <TableCell className="text-sm">₹{p.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">₹{p.commission?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="font-semibold mb-2">Category-wise Breakdown</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <Table>
                <TableHeader className="border-b-0">
                  <TableRow className="bg-gray-50 text-slate-600 border-b border-gray-200">
                    <TableHead>Category</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Revenue (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMonthData.categoryBreakdown.map((c) => (
                    <TableRow key={c.id} className="text-slate-700 border-b border-gray-200">
                      <TableCell className="text-sm">{c.name}</TableCell>
                      <TableCell className="text-sm">{c.quantity}</TableCell>
                      <TableCell className="text-sm">₹{c.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
