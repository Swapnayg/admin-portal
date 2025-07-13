'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ErrorDialog } from "@/components/ErrorDialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/RichTextEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Save, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export default function PageCMSForm() {
  const params = useParams();
  const id = params?.id || 'create';
  const isEdit = id !== 'create';
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; slug?: string; content?: string }>({});
  const router = useRouter();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    status: 'DRAFT',
    content: '',
  });

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/cms/get-page?id=${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const { page } = await res.json();
        setForm({
          title: page.title,
          slug: page.slug,
          status: page.status,
          content: page.content,
        });
      } catch (error) {
        setErrorMessage('Failed to load page details');
        setErrorDialogOpen(true);
      }
    };
    if (isEdit && id) fetchPage();
  }, [id, isEdit]);

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.slug.trim()) newErrors.slug = 'Slug is required';
    if (!form.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setErrorMessage('Please fix the validation errors');
      setErrorDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const endpoint = isEdit ? `/api/cms/update-page?id=${id}` : '/api/cms/create';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setErrorMessage(`Page ${isEdit ? 'updated' : 'created'} successfully`);
      setErrorDialogOpen(true);
      router.push('/cms');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to save page');
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Pages
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Page' : 'Create New Page'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 border-gray-300 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white cursor-pointer">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEdit ? 'Update Page' : 'Create Page'}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${showPreview ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
            <Card className="border border-gray-300">
              <CardHeader>
                <CardTitle>Page Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Page Title *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter page title"
                      className="mt-1 border border-gray-300"
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="/page-url-slug"
                      className="mt-1 border border-gray-300"
                    />
                    {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug}</p>}
                  </div>
                </div>

                <div className="w-full md:w-48">
                  <Label>Publication Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="mt-1 border border-gray-300 bg-white z-[100]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-300 bg-white z-[100]">
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            {status}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-300">
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  content={form.content}
                  onChange={(content) => setForm((prev) => ({ ...prev, content }))}
                />
                {errors.content && <p className="text-sm text-red-500 mt-2">{errors.content}</p>}
              </CardContent>
            </Card>
          </div>

          {showPreview && (
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border border-gray-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                      <div className="text-sm text-gray-600 mb-1">Title:</div>
                      <div className="font-medium text-gray-900">
                        {form.title || 'Untitled Page'}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                      <div className="text-sm text-gray-600 mb-1">URL:</div>
                      <div className="font-mono text-sm text-blue-600">
                        {form.slug || '/page-slug'}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                      <div className="text-sm text-gray-600 mb-1">Status:</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${form.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm font-medium">{form.status}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-600 mb-2">Content Preview:</div>
                      <div className="bg-white border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
                        {form.content ? (
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: form.content }}
                          />
                        ) : (
                          <div className="text-gray-400 italic text-sm">
                            Start writing to see preview...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <ErrorDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen} title="Product Creation Failed" description={errorMessage} />
    </div>
  );
}
