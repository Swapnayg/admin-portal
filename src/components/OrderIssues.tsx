
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const issues = [
  {
    orderId: "#2345",
    product: "Hammer X",
    reason: "Damaged",
    resolved: true,
  },
  {
    orderId: "#2349",
    product: "BoltMaster",
    reason: "Wrong item",
    resolved: false,
  },
];

export default function OrderIssues() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Order Issues</h1>
        <Button className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-500">STATUS</label>
          <Select defaultValue="all border border-gray-200">
            <SelectTrigger className="w-40 border border-gray-200">
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
          <label className="text-sm font-medium text-gray-500">DATE RANGE</label>
          <div className="relative border border-gray-200">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Select Date Range" className="pl-10 w-48 border border-gray-200" />
          </div>
        </div>
      </div>

      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-200">ORDER ID</th>
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-200">PRODUCT</th>
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-200">REASON</th>
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-200">RESOLVED</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr
                    key={issue.orderId}
                    className="border-b border-gray-200 bg-white hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{issue.orderId}</td>
                    <td className="p-4 text-gray-600">{issue.product}</td>
                    <td className="p-4 text-gray-600">{issue.reason}</td>
                    <td className="p-4">
                      {issue.resolved ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-green-600">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-white text-xs">✕</span>
                          </div>
                          <span className="text-red-600">No</span>
                        </div>
                      )}
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
