
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar } from "lucide-react";

const payments = [
  {
    id: "#PAY001",
    date: "2023-10-26",
    amount: "₹ 1,500",
    status: "Paid",
    buyer: "Alice Johnson",
    vendor: "Tech Innovations",
  },
  {
    id: "#PAY002",
    date: "2023-10-25",
    amount: "₹ 800",
    status: "Processing",
    buyer: "Bob Williams",
    vendor: "Fashion Hub",
  },
  {
    id: "#PAY003",
    date: "2023-10-24",
    amount: "₹ 3,200",
    status: "Paid",
    buyer: "Charlie Brown",
    vendor: "Home Essentials",
  },
  {
    id: "#PAY004",
    date: "2023-10-23",
    amount: "₹ 450",
    status: "Failed",
    buyer: "Diana Prince",
    vendor: "Book Nook",
  },
  {
    id: "#PAY005",
    date: "2023-10-22",
    amount: "₹ 2,100",
    status: "Paid",
    buyer: "Eve Adams",
    vendor: "Global Gadgets",
  },
];

export default function Payments() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Payments Overview</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="dd-mm-yyyy"
            className="pl-10 w-40 border border-gray-200 font-semibold"
          />
        </div>
        <Button
          variant="outline"
          className="border border-gray-200 font-semibold"
        >
          Status
        </Button>
        <Button
          variant="outline"
          className="border border-gray-200 font-semibold"
        >
          Buyer
        </Button>
        <Button
          variant="outline"
          className="border border-gray-200 font-semibold"
        >
          Vendor
        </Button>
      </div>
      {/* Payments Table */}
      <Card className="border-none shadow-none">
        <CardContent className="p-0 border border-none">
          <div className="overflow-x-auto border border-gray-200">
           <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="text-left p-4 font-medium text-gray-700">Payment ID</th>
                <th className="text-left p-4 font-medium text-gray-700">Date</th>
                <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Buyer</th>
                <th className="text-left p-4 font-medium text-gray-700">Vendor</th>
                <th className="text-left p-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-800">{payment.id}</td>
                  <td className="p-4 text-gray-600">{payment.date}</td>
                  <td className="p-4 font-medium text-gray-800">{payment.amount}</td>
                  <td className="p-4">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="p-4 text-gray-600">{payment.buyer}</td>
                  <td className="p-4 text-gray-600">{payment.vendor}</td>
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
