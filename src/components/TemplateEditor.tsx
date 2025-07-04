
import React, { useState } from 'react';
import { useRouter, useParams  } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Eye, Send } from 'lucide-react';
import Link from "next/link";

const TemplateEditor = () => {
  const router = useRouter();
  const params = useParams();
  
  const id = params.id;  
  const isEditing = !!id;
  const [templateData, setTemplateData] = useState({
    name: isEditing ? 'Order Shipped' : '',
    subject: isEditing ? 'Your order has been shipped!' : '',
    content: isEditing ? 'Hi {{customer_name}},\n\nYour order {{order_id}} has been shipped and will arrive soon.\n\nTracking: {{tracking_number}}\n\nBest regards,\nThe Team' : '',
    channel: isEditing ? 'email' : 'email'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTemplateData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saving template:', templateData);
  };

  const handlePreview = () => {
    console.log('Preview template:', templateData);
  };

  const handleTest = () => {
    console.log('Test template:', templateData);
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/template-management">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isEditing ? 'Edit Template' : 'Create Template'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Template Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Template Name
                  </label>
                  <Input
                    name="name"
                    value={templateData.name}
                    onChange={handleInputChange}
                    placeholder="Enter template name"
                    className="w-full border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Channel
                  </label>
                  <select
                    name="channel"
                    value={templateData.channel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="both">Email + SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject Line
                  </label>
                  <Input
                    name="subject"
                    value={templateData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter email subject"
                    className="w-full border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    name="content"
                    value={templateData.content}
                    onChange={handleInputChange}
                    placeholder="Enter your message content here..."
                    rows={12}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variables Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Variables</h3>
              <div className="space-y-2">
                <div className="p-2 bg-slate-50 rounded text-sm">
                  <code>{'{{customer_name}}'}</code>
                  <div className="text-xs text-slate-600 mt-1">Customer's name</div>
                </div>
                <div className="p-2 bg-slate-50 rounded text-sm">
                  <code>{'{{order_id}}'}</code>
                  <div className="text-xs text-slate-600 mt-1">Order ID</div>
                </div>
                <div className="p-2 bg-slate-50 rounded text-sm">
                  <code>{'{{tracking_number}}'}</code>
                  <div className="text-xs text-slate-600 mt-1">Tracking number</div>
                </div>
                <div className="p-2 bg-slate-50 rounded text-sm">
                  <code>{'{{vendor_name}}'}</code>
                  <div className="text-xs text-slate-600 mt-1">Vendor name</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="space-y-3">
                <Button 
                  onClick={handlePreview}
                  variant="outline" 
                  className="w-full text-slate-600 border-slate-200 hover:bg-slate-50"
                >
                  <Eye size={16} className="mr-2" />
                  Preview
                </Button>
                <Button 
                  onClick={handleTest}
                  variant="outline" 
                  className="w-full text-slate-600 border-slate-200 hover:bg-slate-50"
                >
                  <Send size={16} className="mr-2" />
                  Send Test
                </Button>
                <Button 
                  onClick={handleSave}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Save size={16} className="mr-2" />
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TemplateEditor;
