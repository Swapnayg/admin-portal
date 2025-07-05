
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface Rule {
  id: number;
  name: string;
  type: string;
  value: string;
  status: "Active" | "Inactive";
}

const mockRules: Rule[] = [
  { id: 1, name: "Standard VAT", type: "Tax", value: "20%", status: "Active" },
  { id: 2, name: "Sales Commission", type: "Commission", value: "5%", status: "Active" },
  { id: 3, name: "Discount Tax", type: "Tax", value: "10%", status: "Inactive" },
  { id: 4, name: "Referral Bonus", type: "Commission", value: "15%", status: "Active" },
  { id: 5, name: "Service Tax", type: "Tax", value: "8%", status: "Active" },
];

interface RuleTableProps {
  searchTerm: string;
}

const RuleTable = ({ searchTerm }: RuleTableProps) => {
  const filteredRules = mockRules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left p-4 font-medium text-slate-600 text-sm uppercase tracking-wide">#</th>
            <th className="text-left p-4 font-medium text-slate-600 text-sm uppercase tracking-wide">Rule Name</th>
            <th className="text-left p-4 font-medium text-slate-600 text-sm uppercase tracking-wide">Type</th>
            <th className="text-left p-4 font-medium text-slate-600 text-sm uppercase tracking-wide">Value</th>
            <th className="text-left p-4 font-medium text-slate-600 text-sm uppercase tracking-wide">Status</th>
            <th className="text-left p-4 font-medium text-slate-600 text-sm uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRules.map((rule) => (
            <tr key={rule.id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="p-4 text-slate-700">{rule.id}</td>
              <td className="p-4">
                <Link 
                  href={`/rules/view/${rule.id}`}
                  className="text-slate-800 hover:text-blue-600 font-medium"
                >
                  {rule.name}
                </Link>
              </td>
              <td className="p-4 text-slate-700">{rule.type}</td>
              <td className="p-4 text-slate-700">{rule.value}</td>
              <td className="p-4">
                <Badge 
                  variant={rule.status === "Active" ? "default" : "secondary"}
                  className={rule.status === "Active" 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-slate-100 text-slate-600 border-slate-200"
                  }
                >
                  {rule.status}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Link href={`/rules/edit/${rule.id}`}>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-red-600 hover:bg-red-700 text-white border-slate-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex justify-center gap-2">
          <Button variant="outline" className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300" disabled>
            Prev
          </Button>
          <Button className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300">1</Button>
          <Button variant="outline" className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300">2</Button>
          <Button variant="outline" className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300">3</Button>
          <Button variant="outline" className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RuleTable;
