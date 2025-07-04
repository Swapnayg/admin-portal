
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter } from "lucide-react";

const orders = [
  {
    id: "#2401",
    date: "1 Jul 2025",
    buyer: "Swapna G",
    vendor: "Acme Ltd",
    status: "Shipped",
    total: "₹5400",
  },
  {
    id: "#2402",
    date: "2 Jul 2025",
    buyer: "Ravi P",
    vendor: "ToolHub",
    status: "Pending",
    total: "₹1200",
  },
];

const statusTabs = ["All Orders", "Pending", "Shipped", "Delivered", "Returned"];

export default function Orders() {
  const [activeTab, setActiveTab] = useState("All Orders");

  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <div className="flex items-center gap-4">
          <div className="relative border border-gray-200">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-10 w-64 border border-gray-200"
            />
          </div>
          <Button variant="outline" className="gap-2 border border-gray-200">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {statusTabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "bg-blue-600 hover:bg-blue-700 text-white" : "border border-gray-200 font-semibold"}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="w-full border border-gray-200 rounded-md shadow-none">
        <CardContent className="p-0 overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 font-medium text-gray-600">Order #</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">Buyer</th>
                  <th className="text-left p-4 font-medium text-gray-600">Vendor</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Total</th>
                  <th className="text-left p-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="bg-white border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4 text-gray-600">{order.date}</td>
                    <td className="p-4 text-gray-600">{order.buyer}</td>
                    <td className="p-4 text-gray-600">{order.vendor}</td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 font-medium">{order.total}</td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
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
