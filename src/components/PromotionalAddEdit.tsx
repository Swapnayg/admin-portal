// File: /app/promotions/[id]/edit/page.tsx and /app/promotions/add/page.tsx (shared component logic below)

'use client';

import { useRouter, useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const defaultForm = {
  title: '',
  code: '',
  discount: 0,
  validFrom: '',
  validTo: '',
  type: 'COUPON',
};

const promotionTypes = [
  'COUPON',
  'CATEGORY',
  'PRODUCT',
  'USER_GROUP',
  'VENDOR',
  'CART_VALUE',
  'FREE_SHIPPING',
  'BOGO',
  'SEASONAL',
  'FLASH_SALE'
];

function generateCode(): string {
  return 'PROMO' + Math.floor(Math.random() * 100000);
}

export default function PromotionFormPage() {
  const router = useRouter();
  const params = useParams();
  const path = usePathname();
  const isEdit = path.includes('/edit');
  const id = isEdit ? params?.id : null;

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  useEffect(() => {
    if (isEdit && id) {
      fetch(`/api/promotions/get-promotion?id=${id}`)
        .then((res) => res.json())
        .then((data) => setForm(data))
        .catch(() => toast.error('Failed to load promotion'));
    }
  }, [isEdit, id]);

  const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errors: Partial<typeof formErrors> = {};

    if (!form.title) errors.title = 'Title is required';
    if (!form.code) errors.code = 'Code is required';
    if (!form.discount || form.discount <= 0) errors.discount = 'Discount must be greater than 0';
    if (!form.validFrom) errors.validFrom = 'Valid From is required';
    if (!form.validTo) errors.validTo = 'Valid To is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/promotions${isEdit ? '/update-promotion' : '/create'}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...form, id } : { ...form, status: 'ACTIVE' }),
      });

      if (!res.ok) throw new Error();

      setErrorMessage(`Promotion ${isEdit ? 'updated' : 'created'} successfully!`);
      setErrorDialogOpen(true);
      router.push('/promotions');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="w-[80%] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Edit Promotion' : 'Add Promotion'}
          </h1>
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard/promotions')}
            className="text-slate-700 cursor-pointer"
          >
            ← Back to Promotions
          </Button>
        </div>

        <Card className="p-6 border border-gray-300 bg-white shadow-sm space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                className={`border-gray-300 ${
                  formErrors.title ? 'border-red-500' : ''
                } ${isEdit ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                readOnly={isEdit}
              />
              {formErrors.title && <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <Label>Code</Label>
              <div className="flex gap-2">
                <Input
                  className={`border-gray-300 ${
                      formErrors.title ? 'border-red-500' : ''
                    } ${isEdit ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                  value={form.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  readOnly={isEdit}
                />
              {!isEdit && (
                <Button
                  type="button"
                  className="bg-slate-600 text-white hover:bg-slate-700 cursor-pointer"
                  onClick={() => handleChange('code', generateCode())}
                >
                  Generate
                </Button>
              )}
              </div>
              {formErrors.code && <p className="text-sm text-red-600 mt-1">{formErrors.code}</p>}
            </div>

            <div>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                className={`border-gray-300 ${formErrors.discount ? 'border-red-500' : ''}`}
                value={form.discount}
                onChange={(e) => handleChange('discount', parseFloat(e.target.value))}
              />
              {formErrors.discount && <p className="text-sm text-red-600 mt-1">{formErrors.discount}</p>}
            </div>

            <div>
              <Label>Type</Label>
              <select
                className="w-full border border-gray-300 rounded-md h-10 px-2 bg-white text-black disabled:bg-gray-100 disabled:text-gray-500"
                value={form.type}
                disabled={isEdit}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {promotionTypes.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Valid From</Label>
              <Input
                type="date"
                className={`border-gray-300 ${formErrors.validFrom ? 'border-red-500' : ''}`}
                value={form.validFrom ? new Date(form.validFrom).toISOString().slice(0, 10) : ''}
                onChange={(e) => handleChange('validFrom', e.target.value)}
              />
              {formErrors.validFrom && <p className="text-sm text-red-600 mt-1">{formErrors.validFrom}</p>}
            </div>

            <div>
              <Label>Valid To</Label>
              <Input
                  type="date"
                  className={`border-gray-300 ${formErrors.validTo ? 'border-red-500' : ''}`}
                  value={form.validTo ? new Date(form.validTo).toISOString().slice(0, 10) : ''}
                  onChange={(e) => handleChange('validTo', e.target.value)}
                />
              {formErrors.validTo && <p className="text-sm text-red-600 mt-1">{formErrors.validTo}</p>}
            </div>

          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="bg-slate-600 text-white hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-slate-700 text-white hover:bg-slate-800 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEdit ? 'Update Promotion' : 'Save Promotion'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
