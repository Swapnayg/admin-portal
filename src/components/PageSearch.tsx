
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download, Eye, Trash2 } from 'lucide-react';
import Link from "next/link";

const CMSPage = () => {
  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft size={16} />
              Back to Page List
            </Link>
          </Button>
          <div className="text-sm text-slate-500">
            Dashboard / CMS / View Page
          </div>
        </div>

        {/* Page Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="mb-4">
                <span className="text-sm text-slate-600">Page Title:</span>
                <div className="font-semibold text-slate-900">Safety Rules</div>
              </div>
              <div>
                <span className="text-sm text-slate-600">Last Modified:</span>
                <div className="text-slate-900">01 July 2025</div>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <span className="text-sm text-slate-600">URL Slug:</span>
                <div className="font-semibold text-slate-900">/safety</div>
              </div>
              <div>
                <span className="text-sm text-slate-600">Status:</span>
                <div>
                  <Badge className="bg-green-100 text-green-800">Published</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Content Preview</h3>
          </div>
          <div className="p-6">
            <div className="bg-slate-50 p-6 rounded-lg font-mono text-sm">
              "Welcome to the Safety Rules page. Please follow all the guidelines mentioned here to ensure compliance with our operational procedures."
              <br /><br />
              - Rule 1: Always wear safety gear<br />
              - Rule 2: Maintain clean workspaces<br />
              - Rule 3: Report incidents immediately
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
            <Edit size={16} />
            Edit Page
          </Button>
          <Button variant="outline" className="border border-gray-200 bg-gray-200">
            <Download size={16} />
            Export
          </Button>
          <Button variant="outline" className="border border-gray-200 bg-gray-200">
            <Eye size={16} />
            Preview Live
          </Button>
          <Button variant="destructive" className="gap-2 bg-red-700 hover:bg-red-800 text-white">
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>
  );
};

export default CMSPage;