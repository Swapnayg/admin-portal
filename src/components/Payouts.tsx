
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar, Search, Filter } from "lucide-react";

const payouts = [
  {
    id: "#PAYOUT001",
    date: "2023-10-26",
    amount: "₹ 1,200",
    status: "Completed",
    vendor: "Tech Innovations",
  },
  {
    id: "#PAYOUT002",
    date: "2023-10-25",
    amount: "₹ 750",
    status: "Pending",
    vendor: "Fashion Hub",
  },
  {
    id: "#PAYOUT003",
    date: "2023-10-24",
    amount: "₹ 2,800",
    status: "Completed",
    vendor: "Home Essentials",
  },
  {
    id: "#PAYOUT004",
    date: "2023-10-23",
    amount: "₹ 300",
    status: "Failed",
    vendor: "Book Nook",
  },
  {
    id: "#PAYOUT005",
    date: "2023-10-22",
    amount: "₹ 1,900",
    status: "Completed",
    vendor: "Global Gadgets",
  },
];

export default function Payouts() {
  return (
    
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Payouts Overview</h1>
        <div className="flex items-center gap-4 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search payouts..."
              className="pl-10 w-64  border border-gray-200"
            />
          </div>
          <Button variant="outline" className="gap-2  border border-gray-200">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filters */}
     <div className="flex gap-4 items-center font-semibold">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="dd-mm-yyyy"
          className="pl-10 w-40 border border-gray-200 font-semibold"
        />
      </div>
      <Button variant="outline" className="border border-gray-200 font-semibold">
        Status
      </Button>
      <Button variant="outline" className="border border-gray-200 font-semibold">
        Vendor
      </Button>
    </div>

      {/* Payouts Table */}
      <Card className="border-none shadow-none">
        <CardContent className="p-0 border border-none">
          <div className="overflow-x-auto">
           <table className="w-full border-separate border-spacing-0  border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-300">Vendor</th>
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-300">Amount</th>
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-300">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-300">Requested On</th>
                  <th className="text-left p-4 font-medium text-gray-600 border-b border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{payout.vendor}</td>
                    <td className="p-4 font-medium">{payout.amount}</td>
                    <td className="p-4">
                      <StatusBadge status={payout.status} />
                    </td>
                    <td className="p-4 text-gray-600">{payout.date}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
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
