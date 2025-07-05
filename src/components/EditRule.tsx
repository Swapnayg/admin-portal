
import { useRouter, useParams  } from 'next/navigation';
import { Button } from "@/components/ui/button";
import RuleForm from "@/components/RuleForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const EditRule = () => {
  const params = useParams();
  const id = params.id;  

  if (typeof id !== "string") return null;

  return (
    <div className="min-h-screen max-w-full w-full bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/rules">
            <Button variant="outline" className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rules
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800">Edit Rule #{id}</h1>
            <p className="text-slate-600 mt-2">Modify the existing rule configuration</p>
          </div>

          <div className="p-6">
            <RuleForm mode="edit" ruleId={id} />;
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRule;
