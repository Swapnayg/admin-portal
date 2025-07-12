'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type CustomerStatus = 'ACTIVE' | 'INACTIVE';

interface CustomerFormProps {
  initialData?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: CustomerStatus;
  };
  onSubmitSuccess: () => void;
}

export default function CustomerForm({ initialData, onSubmitSuccess }: CustomerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'ACTIVE' as CustomerStatus,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        status: initialData.status || 'ACTIVE',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setAlert(null);

    try {
      const res = await fetch(
        initialData
          ? `/api/customers/update-customer?id=${initialData.id}`
          : `/api/customers/create-customer`,
        {
          method: initialData ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json(); // ⬅️ parse response body

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit');
      }
      setAlert({
        type: 'success',
        message: `Customer ${initialData ? 'updated' : 'created'} successfully.`,
      });

      onSubmitSuccess();
    } catch (err: any) {
      console.error('Error:', err);
      setAlert({
        type: 'error',
        message: err.message || 'Error saving customer. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="w-full max-w-3xl mx-auto px-4">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full border border-gray-200"
    >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">
        {initialData ? 'Edit Customer' : 'Add New Customer'}
      </h2>

      <button
        type="button"
        onClick={() => router.push('/customers')}
        className="text-sm bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-1.5 rounded border border-gray-300 cursor-pointer"
      >
        ← Back to Customers
      </button>
    </div>

      {alert && (
        <div
          className={`p-3 rounded border text-sm ${
            alert.type === 'success'
              ? 'bg-green-100 border-green-300 text-green-700'
              : 'bg-red-100 border-red-300 text-red-700'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md border-gray-300"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md border-gray-300"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block font-medium mb-1">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md border-gray-300"
        />
        {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Address */}
      <div>
        <label className="block font-medium mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md border-gray-300"
        />
        {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-700 text-white py-2 rounded-md hover:bg-slate-800 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : initialData ? 'Update Customer' : 'Add Customer'}
      </button>
    </form>
    </div>
  );
}
