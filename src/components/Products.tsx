
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus } from "lucide-react";

const products = [
  {
    name: "Hammer X",
    vendor: "ToolHub",
    status: "Approved",
    price: "₹299",
    compliance: "MSDS ✓",
    action: "View",
  },
  {
    name: "DrillPro 100",
    vendor: "Acme",
    status: "Pending",
    price: "₹1999",
    compliance: "✗",
    action: "Review",
  },
];

export default function Products() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <div className="flex items-center gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
          <Button variant="outline" className="gap-2 bg-orange-100 text-orange-800 hover:bg-orange-200">
            Pending Approvals 4
          </Button>
          <div className="relative  border border-gray-200">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 w-64  border border-gray-200"
            />
          </div>
          <Button variant="outline" className="gap-2  border border-gray-200">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Card className="w-full border border-gray-200 rounded-md shadow-none">
        <CardContent className="p-0 overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4 font-medium text-gray-600">Product Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Vendor</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Price</th>
                <th className="text-left p-4 font-medium text-gray-600">Compliance</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.vendor}</td>
                  <td className="p-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="p-4 font-medium">{product.price}</td>
                  <td className="p-4">
                    <span className={product.compliance === "MSDS ✓" ? "text-green-600" : "text-red-600"}>
                      {product.compliance}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={product.action === "Review" ? "text-orange-600 hover:text-orange-700" : "text-blue-600 hover:text-blue-700"}
                    >
                      {product.action}
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
