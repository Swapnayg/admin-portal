"use client";

import { SetStateAction, useEffect, useState } from "react";
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductViewModal from "./ProductViewModal";

const STATUS_COLORS = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-orange-100 text-orange-700",
  REJECTED: "bg-red-100 text-red-700",
  SUSPENDED: "bg-gray-200 text-gray-700",
};

interface Product {
  type: any;
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  stock: number;
  vendor: {
    user: {
      username: string;
    };
  };
    category?: {
    id: number;
    name: string;
  };
  defaultCommissionPct: number;
  createdAt: string; 
  compliance: {
    id: number;
    type: string;
    fileUrl: string;
  }[];
}

export default function Products() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const limit = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/get-products?page=${page}&limit=${limit}&status=${statusFilter}&search=${search}`);
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(Math.ceil(data.total / limit));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, limit, statusFilter, search]);


  const getSortableValue = (product: Product, key: string) => {
      switch (key) {
        case 'name':
          return product.name.toLowerCase();
        case 'category':
          return product.category?.name.toLowerCase() || '';
        case 'price':
          return product.price;
        case 'status':
          return product.status.toLowerCase();
        case 'vendor':
          return product.vendor?.user?.username.toLowerCase() || '';
        default:
          return '';
      }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const getValue = (product: Product, field: string) => {
      switch (field) {
        case "name":
          return product.name;
        case "price":
          return product.price;
        case "vendor":
          return product.vendor.user.username;
        case "category":
          return product.category?.name || "";
        case "status":
          return product.status;
        default:
          return "";
      }
    };

    const aVal = getValue(a, sortBy);
    const bVal = getValue(b, sortBy);

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    // Ensure both values are strings before comparing
    return sortOrder === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });


  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="w-full p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
       <Link href="/products/add">
          <Button className="bg-slate-600 hover:bg-slate-700 text-white cursor-pointer">
            + Add New Product
          </Button>
        </Link> 
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-4">
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3 border border-gray-300"
          />

          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-48 border border-gray-300 bg-white">
              {statusFilter === "ALL" ? "Filter by Status" : statusFilter}
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table className="w-full border border-gray-200 table-fixed">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr className="divide-x divide-gray-200">
          <th onClick={() => handleSort('name')} className="cursor-pointer px-4 py-2">
            Product Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('category')} className="cursor-pointer px-4 py-2">
            Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('vendor')} className="cursor-pointer px-4 py-2">
            Vendor {sortBy === 'vendor' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('price')} className="cursor-pointer px-4 py-2">
            Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th className="px-4 py-2 text-center">Compliance</th>
          <th onClick={() => handleSort('status')} className="cursor-pointer px-4 py-2">
            Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <TableBody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : 
              sortedProducts.map((p) => (
                <TableRow key={p.id} className="divide-x divide-gray-200">
                  <TableCell className="px-4 py-2 capitalize">
                    <ProductViewModal product={p} />
                  </TableCell>

                  <TableCell className="px-4 py-2 capitalize">{p.category?.name || <span className="text-gray-400 italic">N/A</span>}</TableCell>
                  <TableCell className="px-4 py-2 capitalize">{p.vendor.user.username}</TableCell>
                   <TableCell className="px-4 py-2">₹{p.price}</TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {p.compliance?.length > 0 ? (
                      <span className="text-green-600">MSDS ✓</span>
                    ) : (
                      <span className="text-red-500">X</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        STATUS_COLORS[p.status as keyof typeof STATUS_COLORS] || 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </TableCell>       
                  <TableCell className="px-4 py-2">
                    <Button variant="link" className={`text-sm ${p.status === "PENDING" ? "text-orange-500" : "text-blue-600"}`}>
                      {p.status === "PENDING" ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            className="text-sm cursor-pointer"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          <Button
            variant="ghost"
            className="text-sm cursor-pointer"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
