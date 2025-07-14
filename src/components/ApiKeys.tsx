'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Role = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

interface ApiKey {
  id: number;
  name: string;
  key: string;
  role: Role;
}

export default function ApiKeyManagementPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]); 
  const [open, setOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newRole, setNewRole] = useState<Role>('CUSTOMER');
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await fetch('/api/ApiKeys/get-apis'); // adjust endpoint as needed
        const data = await res.json();
        console.log(data);
        setKeys(data); // assuming the response is an array of ApiKey
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
        alert('Failed to load API keys');
      }
    };

    fetchKeys();
  }, []);

  function generateApiKey(length = 32): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
    for (let i = 0; i < length; i++) {
      const randomChar = charset[Math.floor(Math.random() * charset.length)];
      apiKey += randomChar;
    }
    return apiKey;
  }

  const handleGenerate = async () => {
    setIsGenerating(true); // start loading

    const generatedKey = generateApiKey();
    const newKeyData = {
      name: newKeyName,
      key: generatedKey,
      role: newRole,
    };

    try {
      const res = await fetch('/api/ApiKeys/create-api', {
        method: 'POST',
        body: JSON.stringify(newKeyData),
        headers: { 'Content-Type': 'application/json' },
      });

      const createdKey = await res.json();
      setKeys((prev) => [...prev, createdKey]);

      alert('API Key generated successfully');
      setNewKeyName('');
      setNewRole('CUSTOMER');
      setOpen(false);
    } catch (error) {
      console.error('Failed to generate key:', error);
      alert('Failed to generate key');
    } finally {
      setIsGenerating(false); // stop loading
    }
  };


  const handleRevoke = async (id: number) => {
    try {
      await fetch(`/api/ApiKeys/delete-api?id=${id}`, {
        method: 'DELETE',
      });

      setKeys(keys.filter((k) => k.id !== id));
      alert('API Key revoked');
    } catch (error) {
      console.error('Failed to revoke key:', error);
      alert('Failed to revoke key');
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      toast({ title: 'API Key copied to clipboard' });
    });
  };

  return (
    <div className="p-6 w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">
          API Keys Management
        </h2>
        <Button
          variant="ghost"
          className="text-slate-600 underline underline-offset-2 cursor-pointer"
          onClick={() => {
            window.location.href = '/settings';
          }}
        >
          ← Back to Settings
        </Button>
      </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-slate-700 border border-slate-300 hover:bg-slate-100 cursor-pointer"
            onClick={() => setDocsOpen(true)}
          >
            View API Docs
          </Button>
          <Button
            onClick={() => setOpen(true)}
            className="bg-slate-700 text-white hover:bg-slate-800 cursor-pointer"
          >
            + Generate API Key
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-slate-600 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Key</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  No API keys found.
                </td>
              </tr>
            ) : (
              keys.map(({ id, name, key, role }) => (
                <tr key={id} className="border-t border-gray-200">
                  <td className="p-4 text-slate-700">{name}</td>
                  <td className="p-4 text-slate-600">{role}</td>
                  <td className="p-4 text-slate-600">
                    {'*'.repeat(20) + key.slice(-4)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-slate-700 border-slate-300 cursor-pointer"
                        onClick={() => handleCopy(key)}
                      >
                        <Copy className="w-4 h-4 mr-1" /> Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 cursor-pointer"
                        onClick={() => handleRevoke(id)}
                      >
                        <Trash className="w-4 h-4 mr-1" /> Revoke
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Generate Key Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter key name"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={newRole} onValueChange={(value: Role) => setNewRole(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[9999]">
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="VENDOR">VENDOR</SelectItem>
                  <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-slate-700 text-white hover:bg-slate-800 cursor-pointer"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Docs Modal */}
      <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>API Documentation</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              This API allows you to access various endpoints using your API key. Use the appropriate HTTP method and headers as shown below.
            </p>
            <div>
              <h3 className="font-semibold mb-1">🔐 Authentication</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
Authorization: Bearer YOUR_API_KEY
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-1">📥 Example: Get Products</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
GET /api/products
Host: api.yourdomain.com
Authorization: Bearer YOUR_API_KEY
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-1">📤 Example Response</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
{`{
  "data": [
    {
      "id": 1,
      "name": "Drill Machine",
      "price": 2599
    }
  ]
}`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-1">📄 Notes</h3>
              <ul className="list-disc pl-5">
                <li>Use your API key securely. Do not share it publicly.</li>
                <li>Each key may have rate limits depending on usage tier.</li>
                <li>Contact admin for key rotation or revocation.</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDocsOpen(false)} className="bg-slate-700 text-white hover:bg-slate-800 cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
