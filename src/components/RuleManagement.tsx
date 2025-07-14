"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

interface Rule {
  id: number;
  name: string;
  type: "TAX" | "COMMISSION";
  value: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function RuleManagementPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Rule | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editRule, setEditRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    type: "TAX",
    value: "",
    status: "ACTIVE",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const perPage = 3;

  const fetchRules = async () => {
    const res = await fetch("/api/rules/get-rules");
    const data = await res.json();
    setRules(data);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
  if (alert) {
    const timer = setTimeout(() => {
      setAlert(null);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }
}, [alert]);

  const filtered = rules.filter((r) =>
    Object.values(r)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const sorted = sortField
    ? [...filtered].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1;
        return 0;
      })
    : filtered;

  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  const handleSort = (field: keyof Rule) => {
    if (sortField === field) setSortAsc((prev) => !prev);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Rule name is required.";
    if (!formData.value.trim()) errors.value = "Value is required.";
    else if (!/^\d+(\.\d+)?%$/.test(formData.value.trim())) errors.value = "Enter a valid percentage (e.g. 10%).";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrEdit = async () => {
    setIsSubmitting(true);

    const cleanedValue = parseFloat(formData.value.replace('%', ''));
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name,
      type: formData.type,
      value: cleanedValue,
      status: formData.status,
    };

    try {
      if (editRule) {
        await fetch(`/api/rules/update?id=${editRule.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setAlert({ type: "success", message: "Rule updated successfully." });
      } else {
        await fetch("/api/rules/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setAlert({ type: "success", message: "Rule created successfully." });
      }

      await fetchRules();
      setModalOpen(false);
      setEditRule(null);
      setFormData({ id: 0, name: "", type: "TAX", value: "", status: "ACTIVE" });
      setFormErrors({});
    } catch (err) {
      setAlert({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-4 w-full">
        <h2 className="text-xl font-semibold text-slate-800">Tax & Commission Rules</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 border border-gray-300"
          />
          <Button
            className="cursor-pointer border border-gray-300 bg-slate-800 hover:bg-slate-700 text-white"
            onClick={() => setModalOpen(true)}
          >
            + Add Rule
          </Button>
        </div>
      </div>

      {alert && (
        <Alert
            className="mb-4 border border-gray-300"
            variant={alert.type === "success" ? "default" : "destructive"}
          >
            {alert.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
      )}

      <div className="rounded-lg overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 border-collapse">
          <thead className="bg-gray-100 text-left text-slate-600">
            <tr>
              {["#", "RULE NAME", "TYPE", "VALUE", "STATUS"].map((col, index) => {
                const field = ["id", "name", "type", "value", "status"][index] as keyof Rule;
                return (
                  <th
                    key={index}
                    onClick={() => handleSort(field)}
                    className={cn(
                      "p-4 font-medium border-b border-gray-300 cursor-pointer",
                      sortField === field && "text-slate-800"
                    )}
                  >
                    {col} {sortField === field && (sortAsc ? "↑" : "↓")}
                  </th>
                );
              })}
              <th className="p-4 font-medium border-b border-gray-300">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((rule) => (
              <tr key={rule.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 text-slate-700">{rule.id}</td>
                <td className="p-4 text-slate-700">{rule.name}</td>
                <td className="p-4 text-slate-600">{rule.type}</td>
                <td className="p-4 text-slate-600">{rule.value}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded font-medium",
                      rule.status === "ACTIVE"
                        ? "text-green-700 bg-green-100"
                        : "text-gray-600 bg-gray-100"
                    )}
                  >
                    {rule.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="cursor-pointer"
                      onClick={() => {
                        setEditRule(rule);
                        setFormData({
                          id: rule.id,
                          name: rule.name,
                          type: rule.type.toUpperCase() as "TAX" | "COMMISSION",
                          value: rule.value,
                          status: rule.status.toUpperCase() as "ACTIVE" | "INACTIVE",
                        });
                        setModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={async () => {
                        await fetch(`/api/rules/delete?id=${rule.id}`, { method: "DELETE" });
                        await fetchRules();
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="cursor-pointer border border-gray-300"
        >
          Prev
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="cursor-pointer border border-gray-300"
        >
          Next
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRule ? "Edit Rule" : "Add Rule"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Rule Name</Label>
              <Input
                className="border border-gray-300"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter rule name"
              />
              {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as "TAX" | "COMMISSION" })}
              >
                <SelectTrigger className="w-full border border-gray-300 bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="TAX">Tax</SelectItem>
                  <SelectItem value="COMMISSION">Commission</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                className="border border-gray-300"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g. 10%"
              />
              {formErrors.value && <p className="text-sm text-red-600 mt-1">{formErrors.value}</p>}
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "ACTIVE" | "INACTIVE" })}
              >
                <SelectTrigger className="w-full border border-gray-300 bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
                className="bg-slate-700 text-white cursor-pointer border border-gray-300"
                onClick={handleAddOrEdit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (editRule ? "Updating..." : "Creating...")
                  : (editRule ? "Update" : "Create")}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
