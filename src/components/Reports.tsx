
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCardReport } from "@/components/StatCardReport";
import { Calendar } from "lucide-react";

export default function Reports() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="dd-mm-yyyy"
            className="pl-10 w-44 text-base font-semibold border border-gray-200"
          />
        </div>
        <Button
          variant="outline"
          className="border border-gray-200 text-base font-semibold px-4 py-2"
        >
          Vendor
        </Button>
        <Button
          variant="outline"
          className="border border-gray-200 text-base font-semibold px-4 py-2"
        >
          Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardReport title="Total Sales" value="₹ 1,250,000" className="border border-gray-200" />
        <StatCardReport title="Return Rates" value="5.2%" className="border border-gray-200" />
        <StatCardReport title="Top Vendor" value="Global Gadgets" className="border border-gray-200" />
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <Card className="w-full  border border-gray-200">
          <CardHeader>
            <CardTitle>Revenue over months</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Line Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card className=" border border-gray-200">
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Bar Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
