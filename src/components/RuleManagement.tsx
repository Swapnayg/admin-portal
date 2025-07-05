
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RuleTable from "@/components/RuleTable";
import { Plus } from "lucide-react";

const RuleManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 max-w-full w-full px-6 py-6 space-y-6">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Tax & Commission Rules</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <Input
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md border-slate-300"
              />
              
              <Link href="/rules/create">
                <Button className="bg-slate-600 hover:bg-slate-700 text-white border border-slate-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Rule
                </Button>
              </Link>
            </div>
          </div>

          <RuleTable searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
};

export default RuleManagement;
