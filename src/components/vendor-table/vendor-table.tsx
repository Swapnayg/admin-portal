// components/vendor-table/vendor-table.tsx
"use client";

import { columns, VendorRow } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import { Select } from "@/components/ui/select";
import { SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus , Download, ChevronDown} from "lucide-react";
import Link from 'next/link';
import * as XLSX from "xlsx";


export default function VendorTable() {
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [filtered, setFiltered] = useState<VendorRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  const handleExport = () => {
    if (!filtered || filtered.length === 0) return;

    // Helper to capitalize business name
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    // Prepare data for Excel
    const worksheetData = filtered.map((row: VendorRow) => ({
      ID: row.id,
      Business: capitalize(row.businessName),
      Username: capitalize(row.username),
      Email: row.email,
      Status: row.status,
      Category: row.category ?? "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");

    // Create and download Excel file
    XLSX.writeFile(workbook, "vendors.xlsx");
  };

  useEffect(() => {
    const fetchVendors = async () => {
      const res = await fetch("/api/vendors/get-vendors");
      const data = await res.json();
      console.log(data);
      const formatted = data.vendors.map((v: any) => ({
        id: v.id,
        businessName: v.businessName,
        status: v.status,
        category: v.category?.name || null,
        username: v.user?.username,
        email: v.user?.email,
        createdAt:v.createdAt,
      }));

      setVendors(formatted);
      setFiltered(formatted);

      const uniqueCategories = [
        ...new Set(formatted.map((v: { category: any; }) => v.category).filter(Boolean)),
      ] as string[];
      setCategories(uniqueCategories);
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    let filteredData = vendors;

    if (statusFilter) {
      filteredData = filteredData.filter((v) => v.status === statusFilter);
    }

    if (categoryFilter) {
      filteredData = filteredData.filter((v) => v.category === categoryFilter);
    }

    setFiltered(filteredData);
  }, [statusFilter, categoryFilter, vendors]);

  return (
<div className="space-y-4">
  {/* Top Bar: Title on Left, Filters + Buttons on Right */}
  <div className="flex justify-between items-end flex-wrap gap-4 mb-4">
    {/* Left: Heading */}
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
    </div>

    {/* Right: Filters + Buttons */}
    <div className="flex gap-4 flex-wrap items-end">
      {/* Status Filter */}
      <div>
        <Label className="text-sm mb-1 block">Status</Label>
        <Select
          onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
          value={statusFilter || "all"}
        >
          <SelectTrigger className="w-[200px] h-9 px-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>

          <SelectContent className="z-50 bg-white border border-gray-300 shadow-md">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="APPROVED">APPROVED</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="REJECTED">REJECTED</SelectItem>
            <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div>
        <Label className="text-sm mb-1 block">Category</Label>
        <Select
          onValueChange={(val) => setCategoryFilter(val === "all" ? "" : val)}
          value={categoryFilter || "all"}
        >
          <SelectTrigger className="w-[200px] h-9 px-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>

          <SelectContent className="z-50 bg-white border border-gray-300 shadow-md">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add Vendor Button */}
      <div className="pt-5">
        <Link
          href="/vendor-registration"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Add New Vendor
        </Link>
      </div>

      {/* Export Button */}
      <div className="pt-5">
      <Button
        size="sm"
        onClick={handleExport}
        className="cursor-pointer gap-2 bg-slate-700 hover:bg-slate-800 text-white"
      >
        <Download size={14} />
        Export
      </Button>
      </div>
    </div>
  </div>

  {/* Data Table */}
  <DataTable
    columns={columns}
    data={filtered}
    filterBy={["businessName" as keyof VendorRow, "email" as keyof VendorRow]}
  />
</div>


  );
}
