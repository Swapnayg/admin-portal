'use client';

import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Star, Eye, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import ImageViewerModel from '@/components/imageViewerModel';

interface ProductViewProps {
  product: any;
}

export default function ProductView({ product }: ProductViewProps) {
  const statusColors: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-700',
    PENDING: 'bg-orange-100 text-orange-700',
    REJECTED: 'bg-red-100 text-red-700',
    SUSPENDED: 'bg-gray-200 text-gray-700',
  };

  const [sortBy, setSortBy] = useState('recent');

  const [imageViewer, setImageViewer] = useState<{ open: boolean; images: string[]; index: number }>({
    open: false,
    images: [],
    index: 0,
  });

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openImageViewer = (images: string[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const averageRating = useMemo(() => {
    if (!product.reviews?.length) return 0;
    const total = product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return total / product.reviews.length;
  }, [product.reviews]);

  const sortedReviews = useMemo(() => {
    const reviews = [...(product.reviews || [])];
    switch (sortBy) {
      case 'high':
        return reviews.sort((a, b) => b.rating - a.rating);
      case 'low':
        return reviews.sort((a, b) => a.rating - b.rating);
      default:
        return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [sortBy, product.reviews]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full px-6 py-4 bg-white rounded shadow border border-gray-200">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Product Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
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
          <p className="font-medium">{new Date(product.createdAt).toLocaleString()}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs text-gray-500 mb-0.5">Description</p>
          <p className="font-normal text-slate-700 whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* ✅ Compliance Section */}
        <div className="md:col-span-2">
          <p className="text-xs text-gray-500 mb-0.5">Compliances</p>
          {product.compliance?.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {product.compliance.map((comp: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{comp.type}</span>
                  <a
                    href={comp.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" /> View
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600 font-medium">X Not Available</p>
          )}
        </div>

        {/* ✅ Images */}
        {product.images?.length > 0 && (
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500 mb-1">Product Images</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
              {product.images.map((img: any, idx: number) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`product-image-${idx}`}
                  onClick={() => {
                    setImageViewer({ open: true, images: product.images.map((i: { url: any }) => i.url), index: idx });
                  }}
                  className="cursor-zoom-in w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🔽 Reviews Section */}
      {product.reviews?.length > 0 && (
        <div className="mt-6 border-t pt-4 border-gray-300">
          <div className="mb-3 flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-800">Average Rating:</p>
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
                <span className="text-sm text-slate-600">
                  ({averageRating.toFixed(1)} / 5)
                </span>
              </div>
            </div>

            <div className="mt-2 sm:mt-0 ">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-8 border border-gray-300 text-sm bg-white z-[9999]">
                  Sort Reviews
                </SelectTrigger>
                <SelectContent className="bg-white z-[9999]">
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="high">Highest Rated</SelectItem>
                  <SelectItem value="low">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {sortedReviews.map((review: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-800">
                    {review.user.username}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-600 text-sm font-semibold">
                    {renderStars(review.rating)} <span className="ml-1">{review.rating}/5</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700">{review.comment}</p>

                {review.images?.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {review.images.map((img: any, i: number) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={`review-img-${i}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:shadow"
                        onClick={() => openImageViewer(review.images.map((r: any) => r.url), i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {imageViewer.open && (
        <ImageViewerModel
          images={imageViewer.images}
          currentIndex={imageViewer.index}
          onClose={() => setImageViewer({ ...imageViewer, open: false })}
        />
      )}

      {viewerOpen && (
        <ImageViewerModel
          images={viewerImages}
          currentIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
