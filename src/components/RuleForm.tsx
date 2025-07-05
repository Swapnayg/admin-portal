
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface RuleFormProps {
  mode: "create" | "edit";
  ruleId?: string;
}

const RuleForm = ({ mode, ruleId }: RuleFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: mode === "edit" ? "Standard VAT" : "",
    type: mode === "edit" ? "Tax" : "",
    value: mode === "edit" ? "20" : "",
    status: mode === "edit" ? "Active" : "Active",
    description: mode === "edit" ? "Standard VAT rate applied to most goods and services" : ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock API call
    toast({
      title: mode === "create" ? "Rule Created" : "Rule Updated",
      description: `${formData.name} has been ${mode === "create" ? "created" : "updated"} successfully.`,
    });
    
    router.push("/rules");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Rule Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter rule name"
            required
            className="border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger className="border-slate-300">
              <SelectValue placeholder="Select rule type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-300">
              <SelectItem value="Tax">Tax</SelectItem>
              <SelectItem value="Commission">Commission</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Value *</Label>
          <div className="flex">
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => handleChange("value", e.target.value)}
              placeholder="Enter value"
              required
              className="border-slate-300 rounded-r-none"
            />
            <div className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-md text-slate-600">
              %
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger className="border-slate-300">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-300">
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter rule description (optional)"
          rows={4}
          className="border-slate-300"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit"
          className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300"
        >
          {mode === "create" ? "Create Rule" : "Update Rule"}
        </Button>
        
        <Button 
          type="button"
          variant="outline"
          onClick={() => router.push("/rules")}
          className="bg-slate-600 hover:bg-slate-700 text-white border-slate-300"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default RuleForm;
