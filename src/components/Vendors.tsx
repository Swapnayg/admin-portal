
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import VendorTable from "@/components/vendor-table/vendor-table";
import { Search, Filter, Plus , Download, ChevronDown} from "lucide-react";
import { useRouter } from 'next/navigation';


export default function Vendors() {
  const router = useRouter();
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
    
      {/* Vendors Table */}
      <VendorTable/>
    </div>
  );
}