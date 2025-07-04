
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, Plus , Download, ChevronDown} from "lucide-react";

const vendors = [
  {
    name: "Acme Ltd",
    email: "acme@example.com",
    status: "Active",
    joined: "Jan 2024",
  },
  {
    name: "ToolHub",
    email: "tool@example.com",
    status: "Pending",
    joined: "Feb 2024",
  },
];

export default function Vendors() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
        <div className="flex items-center gap-4">
          <Button className="bg-slate-600 hover:bg-slate-700 gap-2 text-white">
            <Plus className="h-4 w-4" />
            Add New Vendor
          </Button>
          <div className="relative border border-gray-200">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 " />
            <Input
              placeholder="Search"
              className="pl-10 w-64 border border-gray-200"
            />
          </div>
          <Button className="gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-100">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 hover:bg-slate-100">
                STATUS/CATEGORY
                <ChevronDown size={16} />
              </button>
              <Button size="sm" className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
                <Download size={14} />
                Export
              </Button>
            </div>
        </div>
      </div>

      {/* Vendors Table */}
      <Card className="w-full border border-gray-200 rounded-md shadow-none">
        <CardContent className="p-0 overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 font-medium text-gray-600">Email</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Joined</th>
                  <th className="text-left p-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, index) => (
                  <tr
                    key={index}
                    className="bg-white border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{vendor.name}</td>
                    <td className="p-4 text-gray-600">{vendor.email}</td>
                    <td className="p-4">
                      <StatusBadge status={vendor.status} />
                    </td>
                    <td className="p-4 text-gray-600">{vendor.joined}</td>
                    <td className="p-4">
                      <Button className="text-blue-600 hover:text-blue-700 px-2 py-1 text-sm bg-transparent shadow-none">
                        {vendor.status === "Pending" ? "Review" : "View >"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}