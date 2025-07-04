
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Eye, Edit, FileText, Clock } from 'lucide-react';

const TermsEditor = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(`
## Terms of Service

### 1. Acceptance of Terms
By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.

### 2. User Accounts
- Users must provide accurate and complete information when creating an account
- Users are responsible for maintaining the confidentiality of their account credentials
- Users must notify us immediately of any unauthorized use of their account

### 3. Vendor Obligations
- Vendors must provide accurate product information
- All products must comply with applicable laws and regulations
- Vendors are responsible for fulfilling orders in a timely manner

### 4. Payment Terms
- All payments are processed securely through our platform
- Platform fees are deducted from vendor payouts
- Refunds are subject to our refund policy

### 5. Prohibited Activities
- Fraudulent or deceptive practices
- Violation of intellectual property rights
- Harassment or abuse of other users
- Selling prohibited or illegal items

### 6. Platform Rights
We reserve the right to:
- Suspend or terminate accounts that violate these terms
- Modify these terms with proper notice
- Remove content that violates our policies

### 7. Limitation of Liability
The platform is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our services.

### 8. Contact Information
For questions about these terms, please contact us at legal@platform.com
  `);

  const documents = [
    { id: 'terms', name: 'Terms of Service', lastModified: '2 days ago', status: 'Published' },
    { id: 'privacy', name: 'Privacy Policy', lastModified: '1 week ago', status: 'Published' },
    { id: 'vendor', name: 'Vendor Agreement', lastModified: '3 days ago', status: 'Draft' },
    { id: 'cookie', name: 'Cookie Policy', lastModified: '1 month ago', status: 'Published' }
  ];

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-slate-600" />
            <h1 className="text-2xl font-semibold text-slate-900">Terms & Policies Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className='border border-gray-200 font-semibold'>
              <Eye size={14} />
              Preview
            </Button>
            <Button size="sm" className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
              <Save size={14} />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Document List Sidebar */}
          <div className="w-80 bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="font-medium text-slate-900 mb-4">Documents</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeTab === doc.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setActiveTab(doc.id)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-slate-900">{doc.name}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doc.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={12} className="text-slate-400" />
                    <p className="text-xs text-slate-500">{doc.lastModified}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4 border border-gray-200 font-semibold" variant="outline">
              + Add New Document
            </Button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-white rounded-lg border border-slate-200">
            {/* Editor Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {documents.find(d => d.id === activeTab)?.name}
                </h2>
                <p className="text-sm text-slate-500">
                  Last modified {documents.find(d => d.id === activeTab)?.lastModified}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className='border border-gray-200 font-semibold'
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit size={14} />
                {isEditing ? 'Stop Editing' : 'Edit'}
              </Button>
            </div>

            {/* Editor Content */}
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 p-4 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your content here..."
                />
              ) : (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {content}
                  </div>
                </div>
              )}
            </div>

            {/* Editor Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                {isEditing ? 'Editing mode' : 'Read-only mode'}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className='border border-gray-200 font-semibold'>
                  Discard Changes
                </Button>
                <Button size="sm" className='className="gap-2 bg-slate-700 hover:bg-slate-800 text-white'>
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TermsEditor;
