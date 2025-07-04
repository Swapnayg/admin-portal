
import React, { useState } from 'react';
import { useRouter, useParams  } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import Link from "next/link";

const CreateEditCustomer = () => {
    const router = useRouter();
    const params = useParams();

    const id = params.id;  

  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: isEdit ? 'John Doe' : '',
    email: isEdit ? 'john@email.com' : '',
    phone: isEdit ? '9999999999' : '',
    status: isEdit ? 'Active' : 'Active',
    address: isEdit ? '123 Main St, City, State' : '',
    company: isEdit ? 'Tech Corp' : '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving customer:', formData);
    router.push('/customers');
  };

  return (
      <div className="max-w-full w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-700 hover:bg-slate-50">
              <ArrowLeft size={16} className="mr-2" />
              Back to Customers
            </Button>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
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
                  Email Address *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
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
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company
                </label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            
            <div className="flex gap-3">
              <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                <Save size={16} className="mr-2" />
                {isEdit ? 'Update Customer' : 'Add Customer'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/customers')} className="border-slate-200 text-slate-600 hover:bg-slate-50">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateEditCustomer;
