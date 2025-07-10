'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { ErrorDialog } from "@/components/ErrorDialog";
import { UploadCloud, X } from 'lucide-react';

interface Vendor {
  id: number;
  businessName: string;
}

interface ProductCategory {
  id: number;
  name: string;
}

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    defaultCommissionPct: '',
    vendorId: '',
    categoryId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);

  const uploadImagesToCloudinary = async () => {
      const uploadedUrls: string[] = [];

      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'vendors'); // 🔁 Replace with your Cloudinary preset

        const res = await fetch('https://api.cloudinary.com/v1_1/dhas7vy3k/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      return uploadedUrls;
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/products/metadata');
        const data = await res.json();

        setVendors(data.vendors || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load metadata', err);
      } finally {
        setMetaLoading(false);
      }
    };

    fetchData();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.price || isNaN(+form.price)) newErrors.price = 'Valid price is required';
    if (!form.stock || isNaN(+form.stock)) newErrors.stock = 'Valid stock is required';
    if (!form.defaultCommissionPct || isNaN(+form.defaultCommissionPct))
      newErrors.defaultCommissionPct = 'Valid commission % is required';
    if (!form.vendorId) newErrors.vendorId = 'Vendor is required';
    if (!form.categoryId) newErrors.categoryId = 'Category is required';

    // 🔴 Image validation
    if (images.length === 0) {
      newErrors.images = 'At least one product image is required';
    } else {
      const invalidImages = images.filter(
        (file) => !file.type.startsWith('image/')
      );
      if (invalidImages.length > 0) {
        newErrors.images = 'Only image files are allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const imageUrls = await uploadImagesToCloudinary(); // ⬆️ Upload and get image URLs

      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: +form.price,
          stock: +form.stock,
          defaultCommissionPct: +form.defaultCommissionPct,
          vendorId: +form.vendorId,
          categoryId: +form.categoryId,
          status: 'APPROVED',
          images: imageUrls, // 👈 Include image URLs
        }),
      });

      if (!res.ok) throw res; 

      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        defaultCommissionPct: '',
        vendorId: '',
        categoryId: '',
      });
      setImages([]);
      setErrorMessage('Product created successfully!');
      setErrorDialogOpen(true);
      router.push('/products');
    } catch (error: any) {
        if (error instanceof Response) {
            const errData = await error.json();
            if (error.status === 409) {
            setErrorMessage(errData.error || 'Product already exists');
            } else {
            setErrorMessage(errData.error || 'An unexpected server error occurred');
            }
        } else {
            setErrorMessage('Network error or unexpected failure');
        }
        setErrorDialogOpen(true);
    } finally {
        setLoading(false);
    }
    };

  if (metaLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-slate-600 font-medium text-lg">Loading form...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-4 bg-white border border-gray-200 rounded-md shadow mt-8">
       <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-slate-800">Add New Product</h1>
            <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-800 cursor-pointer"
                onClick={() => router.back()}
                >
                ← Back to Products
            </Button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vendor */}
        <div>
          <Label>Vendor</Label>
          <Select onValueChange={(val) => setForm({ ...form, vendorId: val })}>
            <SelectTrigger
              className={`border border-gray-300 bg-white z-50 ${
                errors.vendorId ? 'border-red-500' : ''
              }`}
            >
              {form.vendorId
                ? vendors.find((v) => v.id === +form.vendorId)?.businessName
                : 'Select Vendor'}
            </SelectTrigger>
            <SelectContent className="bg-white z-[9999]">
              {vendors.map((vendor) => (
                <SelectItem
                    key={vendor.id}
                    value={vendor.id.toString()}
                    className="pl-8 pr-2"
                    >
                    {vendor.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vendorId && <p className="text-red-500 text-sm mt-1">{errors.vendorId}</p>}
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <Select onValueChange={(val) => setForm({ ...form, categoryId: val })}>
            <SelectTrigger
              className={`border border-gray-300 bg-white z-50 ${
                errors.categoryId ? 'border-red-500' : ''
              }`}
            >
              {form.categoryId
                ? categories.find((c) => c.id === +form.categoryId)?.name
                : 'Select Category'}
            </SelectTrigger>
            <SelectContent className="bg-white z-[9999]">
              {categories.map((cat) => (
                <SelectItem
                    key={cat.id}
                    value={cat.id.toString()}
                    className="pl-8 pr-2"
                    >
                    {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
        </div>

        {/* Product Name */}
        <div>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`border-gray-300 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <Label>Price (₹)</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={`border-gray-300 ${errors.price ? 'border-red-500' : ''}`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Stock */}
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className={`border-gray-300 ${errors.stock ? 'border-red-500' : ''}`}
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        {/* Commission */}
        <div>
          <Label>Default Commission (%)</Label>
          <Input
            type="number"
            value={form.defaultCommissionPct}
            onChange={(e) => setForm({ ...form, defaultCommissionPct: e.target.value })}
            className={`border-gray-300 ${errors.defaultCommissionPct ? 'border-red-500' : ''}`}
          />
          {errors.defaultCommissionPct && (
            <p className="text-red-500 text-sm mt-1">{errors.defaultCommissionPct}</p>
          )}
        </div>
        {/* Description */}
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`border-gray-300 min-h-[100px] ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        
      <div className="md:col-span-2">
        <Label className="block mb-2">Product Images</Label>

        {/* Upload Button */}
        <label className="flex items-center justify-center px-4 py-2 border border-dashed border-slate-400 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors text-sm font-medium text-slate-600">
        <UploadCloud className="w-4 h-4 mr-2" />
        Upload Images
        <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
            if (e.target.files) {
                const selected = Array.from(e.target.files);
                const total = images.length + selected.length;

                if (total > 5) {
                setErrors((prev) => ({
                    ...prev,
                    images: 'You can upload a maximum of 5 images.',
                }));
                const allowedCount = 5 - images.length;
                if (allowedCount > 0) {
                    setImages((prev) => [...prev, ...selected.slice(0, allowedCount)]);
                }
                } else {
                setErrors((prev) => ({ ...prev, images: '' }));
                setImages((prev) => [...prev, ...selected]);
                }
            }
            }}
        />
        </label>
        {errors.images && <p className="text-sm text-red-600 mt-1">{errors.images}</p>}

        {/* Image Previews */}
        {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                <div
                    key={index}
                    className="relative rounded overflow-hidden border border-gray-200 shadow-sm bg-white"
                >
                    <img
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover"
                    />
                    <button
                    type="button"
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white transition"
                    onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    >
                    <X className="w-4 h-4 text-red-500" />
                    </button>
                </div>
                ))}
            </div>
            )}
      </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 bg-slate-600 text-white hover:bg-slate-700 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    <ErrorDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen} title="Product Creation Failed" description={errorMessage} />
    </div>
  );
}
