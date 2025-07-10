'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductViewModalProps {
  product: any;
}

export default function ProductViewModal({ product }: ProductViewModalProps) {
  const statusColors: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-700',
    PENDING: 'bg-orange-100 text-orange-700',
    REJECTED: 'bg-red-100 text-red-700',
    SUSPENDED: 'bg-gray-200 text-gray-700',
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-blue-600 cursor-pointer hover:underline">{product.name}</span>
      </DialogTrigger>

      <DialogContent className="max-w-xl px-4 py-3">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">Product Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm text-slate-700">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Product Name</p>
            <p className="font-medium">{product.name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Category</p>
            <p className="font-medium">{product.category?.name || 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Price</p>
            <p className="font-medium">₹{product.price}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Stock</p>
            <p className="font-medium">{product.stock}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Commission (%)</p>
            <p className="font-medium">{product.defaultCommissionPct}%</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Status</p>
            <Badge
              className={cn(
                'text-xs px-2 py-0.5 rounded',
                statusColors[product.status] || 'bg-gray-200 text-gray-700'
              )}
            >
              {product.status}
            </Badge>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Vendor</p>
            <p className="font-medium">{product.vendor?.user?.username || 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Created At</p>
            <p className="font-medium">
              {new Date(product.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs text-gray-500 mb-0.5">Description</p>
            <p className="font-normal text-slate-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs text-gray-500 mb-0.5">Compliance</p>
            <p
              className={cn(
                'font-medium',
                product.compliance?.length > 0 ? 'text-green-700' : 'text-red-600'
              )}
            >
              {product.compliance?.length > 0 ? '✓ MSDS Available' : 'X Not Available'}
            </p>
          </div>

          {product.images?.length > 0 && (
  <div className="md:col-span-2">
    <p className="text-xs text-gray-500 mb-1">Product Images</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
      {product.images.map((img: any, idx: number) => (
        <a
          key={idx}
          href={img.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-200 rounded block hover:shadow-md transition"
        >
          <img
            src={img.url}
            alt={`product-image-${idx}`}
            className="w-full h-24 object-cover rounded"
          />
        </a>
      ))}
    </div>
  </div>
)}

        </div>
      </DialogContent>
    </Dialog>
  );
}
