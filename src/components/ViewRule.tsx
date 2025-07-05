
import { useRouter, useParams  } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

const ViewRule = () => {
  const params = useParams();
  const id = params.id;  
  
  // Mock data - in a real app, this would come from an API
  const rule = {
    id: id,
    name: "Standard VAT",
    type: "Tax",
    value: "20%",
    status: "Active",
    description: "Standard VAT rate applied to most goods and services",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
    createdBy: "Admin User"
  };

  return (
    <div className="min-h-screen max-w-full w-full bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4">
          <Link href="/rules">
            <Button variant="outline" className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rules
            </Button>
          </Link>
          
          <Link href={`/rules/edit/${id}`}>
            <Button className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300">
              <Edit className="h-4 w-4 mr-2" />
              Edit Rule
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{rule.name}</h1>
                <p className="text-slate-600 mt-2">Rule #{rule.id}</p>
              </div>
              <Badge 
                variant={rule.status === "Active" ? "default" : "secondary"}
                className={rule.status === "Active" 
                  ? "bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1" 
                  : "bg-slate-100 text-slate-600 border-slate-200 text-sm px-3 py-1"
                }
              >
                {rule.status}
              </Badge>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Rule Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Rule Name</label>
                    <p className="text-slate-800 mt-1">{rule.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Type</label>
                    <p className="text-slate-800 mt-1">{rule.type}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Value</label>
                    <p className="text-slate-800 mt-1 text-lg font-semibold">{rule.value}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Description</label>
                    <p className="text-slate-800 mt-1">{rule.description}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Metadata</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Created Date</label>
                    <p className="text-slate-800 mt-1">{rule.createdAt}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Last Updated</label>
                    <p className="text-slate-800 mt-1">{rule.updatedAt}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Created By</label>
                    <p className="text-slate-800 mt-1">{rule.createdBy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRule;
