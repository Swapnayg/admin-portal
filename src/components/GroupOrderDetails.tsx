
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function GroupOrderDetails() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center gap-4">

      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

        <h1 className="text-2xl font-semibold text-gray-900">Group Order: #G123</h1>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">VENDORS INVOLVED</h3>
              <p className="text-gray-900">Acme, ToolHub</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">TOTAL</h3>
              <p className="text-2xl font-semibold text-gray-900">₹54,000</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">ITEMS</h3>
            <div className="space-y-2">
              <p className="text-gray-900">- Hammer X (Acme) – 50 units</p>
              <p className="text-gray-900">- BoltFast 200 (ToolHub) – 30 units</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8 justify-end">
            <Button variant="outline" className="bg-slate-600 text-white hover:bg-slate-700">
              Dispatch Individually
            </Button>
            <Button className="bg-slate-600 hover:bg-slate-700 text-white">
              Dispatch Together
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
