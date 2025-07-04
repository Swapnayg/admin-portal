
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit } from "lucide-react";
import Link from "next/link";

const pages = [
  {
    id: "safety",
    title: "Industry Safety Guidelines",
    slug: "/safety",
    lastModified: "2 days ago",
    status: "Published"
  },
  {
    id: "terms",
    title: "Terms and Conditions",
    slug: "/terms",
    lastModified: "1 week ago",
    status: "Published"
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    slug: "/privacy",
    lastModified: "3 days ago",
    status: "Draft"
  }
];

export default function PageSearch() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Pages</h1>
        <Link href="/">
          <Button className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
            <Plus className="h-4 w-4" />
            Create Page
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4  border-gray-200">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search pages..."
          className="pl-10  border-gray-200"
        />
      </div>
    <Card className="border border-gray-200">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">Title</th>
                <th className="text-left p-4 font-medium text-gray-600">Slug</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Last Modified</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{page.title}</td>
                  <td className="p-4 text-gray-600">{page.slug}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{page.lastModified}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/cms/editor/${page.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    </div>
  );
}
