
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const roles = [
  { name: "Super Admin", permissions: "Full Access" },
  { name: "Moderator", permissions: "Read + Write" },
  { name: "Viewer", permissions: "Read Only" },
];

const permissions = [
  { id: "view-vendors", label: "View Vendors", checked: true },
  { id: "edit-products", label: "Edit Products", checked: true },
  { id: "approve-payouts", label: "Approve Payouts", checked: false },
];

export default function RoleManagement() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative border border-gray-200">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Roles"
              className="pl-10 w-64 border border-gray-200"
            />
          </div>
          <Button className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
        </div>
      </div>

    <Card className="border-none shadow-none">
      <CardContent className="p-0 border-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="text-left p-4 font-medium text-gray-600">ROLE NAME</th>
                <th className="text-left p-4 font-medium text-gray-600">PERMISSIONS</th>
                <th className="text-left p-4 font-medium text-gray-600">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {roles.map((role) => (
                <tr key={role.name} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-medium">{role.name}</td>
                  <td className="p-4 text-gray-600">{role.permissions}</td>
                  <td className="p-4">
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <Card className="border-none shadow-none">
      <CardContent className="p-6 border-none">
        <h3 className="text-lg font-semibold mb-4">Role: Moderator</h3>
        <div className="space-y-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-3">
              <Checkbox 
                id={permission.id}
                checked={permission.checked}
              />
              <label htmlFor={permission.id} className="text-sm font-medium">
                {permission.label}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button className="gap-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold">
            Save Role
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
