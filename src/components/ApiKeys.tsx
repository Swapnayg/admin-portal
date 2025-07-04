
import React from 'react';
import { Button } from '@/components/ui/button';
import { Key, FileText, Copy, Trash2 } from 'lucide-react';

const ApiKeys = () => {
  const apiKeys = [
    {
      id: 1,
      name: 'Default Key',
      key: '••••••••••••••••••••••••••••••abcd',
      created: '2023-01-15'
    },
    {
      id: 2,
      name: 'Development Key',
      key: '••••••••••••••••••••••••••••••efgh',
      created: '2023-02-10'
    },
    {
      id: 3,
      name: 'Production Key',
      key: '••••••••••••••••••••••••••••••ijkl',
      created: '2023-03-05'
    }
  ];

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="text-slate-600" size={24} />
            <h1 className="text-2xl font-semibold text-slate-900">API Keys Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2 border border-gray-200">
              <FileText size={16} />
              View API Docs
            </Button>
            <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white">
              + Generate API Key
            </Button>
          </div>
        </div>

        {/* API Keys Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {apiKeys.map((apiKey, index) => (
                <tr key={apiKey.id} className={index > 0 ? 'border-t border-slate-200' : ''}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {apiKey.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {apiKey.key}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Copy size={14} />
                        Copy
                      </Button>
                      <Button variant="destructive" size="sm" className="flex items-center gap-1">
                        <Trash2 size={14} />
                        Revoke
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default ApiKeys;
