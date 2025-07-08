// components/vendor-table/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, CheckCircle } from "lucide-react";
import Link from 'next/link';

export type VendorRow = {
  businessName: any;
  id: number;
  createdAt: string; // ISO string or Date
  status: string;
  category: string | null;
  username: string;
  email: string;
};


export const columns: ColumnDef<VendorRow>[] = [
  {
    accessorKey: "businessName",
    header: "Business",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("businessName")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    enableSorting: true,
    cell: ({ row }) =>
      row.getValue("category") || <span className="text-gray-400">—</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Joined On",
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <span>{format(date, "MMM yyyy")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      const statusColor = {
        APPROVED: "bg-green-100 text-green-800",
        PENDING: "bg-sky-100 text-sky-800",
        REJECTED: "bg-red-100 text-red-800",
        SUSPENDED: "bg-gray-100 text-gray-800",
      };

      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            statusColor[value as keyof typeof statusColor] ??
            "bg-gray-100 text-gray-700"
          }`}
        >
          {value}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const vendorId = row.original.id; 

      if (status === "REJECTED") return null; 
      const isPending = status === "PENDING";
      const buttonLabel = isPending ? "Review" : "View";
      const buttonHref = isPending
        ? `/vendors/${vendorId}/review`
        : `/vendors/${vendorId}/view`;

      return (
        <Link href={buttonHref} passHref>
          <Button
            className={`cursor-pointer px-4 py-1 h-9 text-sm font-medium rounded-md shadow-sm ${
              isPending
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {buttonLabel}
          </Button>
        </Link>
      );
    },
  },
];
