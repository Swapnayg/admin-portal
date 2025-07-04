
import React from 'react';
import { useRouter, useParams  } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Copy, BarChart3 } from 'lucide-react';
import Link from "next/link";

const TemplateDetails = () => {
  const router = useRouter();
  const params = useParams();
  
  const id = params.id;  
  
  // Mock data - in real app this would be fetched based on ID
  const template = {
    id: id,
    event: 'Order Shipped',
    channel: 'Email + SMS',
    subject: 'Your order has shipped!',
    emailBody: 'Dear {{name}},\n\nGreat news! Your order #{{orderId}} has been shipped and is on its way to you.\n\nYou can track your package using the link below:\n[Tracking Link]\n\nExpected delivery: {{deliveryDate}}\n\nThank you for shopping with us!\n\nBest regards,\nThe Team',
    smsBody: 'Hi {{name}}, your order #{{orderId}} has shipped! Track: [link] Expected delivery: {{deliveryDate}}',
    status: 'Active',
    created: '2024-01-15',
    lastModified: '2024-01-20',
    sentCount: 1247,
    openRate: '68%',
    clickRate: '12%'
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/template-management">
              <Button variant="outline" size="sm" className='border border-gray-200'> 
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{template.event}</h1>
              <p className="text-slate-600">{template.channel} Template</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className='border border-gray-200'>
              <Copy size={16} className="mr-2" />
              Duplicate
            </Button>
            <Link href={`/template-editor/${id}`}>
              <Button className="gap-2 bg-slate-700 hover:bg-slate-800 text-white">
                <Edit size={16} className="mr-2" />
                Edit Template
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className='bg-gray-50 border-b border-gray-200'>
              <CardHeader>
                <CardTitle className="text-lg">Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      template.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {template.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Created</label>
                  <p className="text-slate-900">{template.created}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Last Modified</label>
                  <p className="text-slate-900">{template.lastModified}</p>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gray-50 border-b border-gray-200'>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 size={20} />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Messages Sent</label>
                  <p className="text-2xl font-semibold text-slate-900">{template.sentCount.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Open Rate</label>
                  <p className="text-xl font-semibold text-green-600">{template.openRate}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Click Rate</label>
                  <p className="text-xl font-semibold text-blue-600">{template.clickRate}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Content */}
          <div className="lg:col-span-2 space-y-6">
            {(template.channel === 'Email' || template.channel === 'Email + SMS') && (
              <Card className='bg-gray-50 border-b border-gray-200'>
                <CardHeader>
                  <CardTitle className="text-lg">Email Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Subject</label>
                    <div className="p-3 bg-slate-50 rounded-md border bg-gray-50 border-b border-gray-200">
                      <p className="text-slate-900">{template.subject}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Body</label>
                    <div className="p-4 bg-slate-50 rounded-md border min-h-[200px] bg-gray-50 border-b border-gray-200">
                      <pre className="text-slate-900 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {template.emailBody}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(template.channel === 'SMS' || template.channel === 'Email + SMS') && (
              <Card className='bg-gray-50 border-b border-gray-200'>
                <CardHeader>
                  <CardTitle className="text-lg">SMS Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Message</label>
                    <div className="p-4 bg-slate-50 rounded-md border bg-gray-50 border-b border-gray-200">
                      <p className="text-slate-900 text-sm">{template.smsBody}</p>
                      <p className="text-xs text-slate-500 mt-2">{template.smsBody.length}/160 characters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
};

export default TemplateDetails;
