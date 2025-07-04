
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Trophy } from "lucide-react";

const orderIssues = [
  { id: "#2345", product: "Hammer X", reason: "Damaged", resolved: true },
  { id: "#2349", product: "BoltMaster", reason: "Wrong Item", resolved: false },
];

const topVendors = [
  { name: "Acme Tools", amount: "₹4.5L" },
  { name: "ToolHub", amount: "₹3.8L" },
];

const topProducts = [
  { name: "DrillPro 100", amount: "₹1.2L" },
  { name: "Hammer X", amount: "₹98K" },
];

export default function SalesAnalytics() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Sales Analytics</h1>
        <Button className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">STATUS</label>
          <Select defaultValue="all border border-gray-200">
            <SelectTrigger className="w-32 border border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border border-gray-200">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">DATE RANGE</label>
          <Select defaultValue="select border border-gray-200">
            <SelectTrigger className="w-48 border border-gray-200">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent className="border border-gray-200">
              <SelectItem value="select">Select Date Range</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Order Issues */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Order Issues</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600">ORDER ID</th>
                  <th className="text-left p-4 font-medium text-gray-600">PRODUCT</th>
                  <th className="text-left p-4 font-medium text-gray-600">REASON</th>
                  <th className="text-left p-4 font-medium text-gray-600">RESOLVED</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orderIssues.map((issue) => (
                  <tr key={issue.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-medium">{issue.id}</td>
                    <td className="p-4 text-gray-700">{issue.product}</td>
                    <td className="p-4 text-gray-700">{issue.reason}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {issue.resolved ? (
                          <>
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-green-600">Yes</span>
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-red-600">No</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Vendors and Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Vendors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topVendors.map((vendor) => (
              <div
                key={vendor.name}
                className="flex items-center justify-between border-b border-gray-100 pb-2"
              >
                <span className="text-gray-900">{vendor.name}</span>
                <span className="font-semibold">{vendor.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between border-b border-gray-100 pb-2"
              >
                <span className="text-gray-900">{product.name}</span>
                <span className="font-semibold">{product.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
