
import React, { useState } from 'react';
import { useRouter, useParams  } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from "next/link";
import { ArrowLeft, Save } from 'lucide-react';

const CreateEditPromotion = () => {
  const params = useParams();
  const id = params.id;  
  const router = useRouter();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: isEdit ? 'NewYear50' : '',
    type: isEdit ? 'Coupon' : 'Coupon',
    discount: isEdit ? '50' : '',
    validFrom: isEdit ? '2025-01-01' : '',
    validTo: isEdit ? '2025-01-31' : '',
    appliesTo: isEdit ? 'All Products' : 'All Products',
    description: isEdit ? '50% off on all products for New Year celebration.' : '',
    status: isEdit ? 'Active' : 'Active'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving promotion:', formData);
    router.push('/promotions');
  };

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/promotions">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-700 hover:bg-slate-50">
              <ArrowLeft size={16} className="mr-2" />
              Back to Promotions
            </Button>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            {isEdit ? 'Edit Promotion' : 'Create New Promotion'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Promotion Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                >
                  <option value="Coupon">Coupon</option>
                  <option value="Category">Category</option>
                  <option value="Product">Product</option>
                  <option value="User Group">User Group</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Discount (%) *
                </label>
                <Input
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valid From *
                </label>
                <Input
                  name="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valid To *
                </label>
                <Input
                  name="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Applies To
              </label>
              <Input
                name="appliesTo"
                value={formData.appliesTo}
                onChange={handleInputChange}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            
            <div className="flex gap-3">
              <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                <Save size={16} className="mr-2" />
                {isEdit ? 'Update Promotion' : 'Create Promotion'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/promotions')} className="border-slate-200 text-slate-600 hover:bg-slate-50">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateEditPromotion;
