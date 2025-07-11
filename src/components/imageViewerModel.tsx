// ✅ Enhanced ImageViewer component with white background and half-screen size
'use client';

import { Dialog } from '@/components/ui/dialog';
// Update the import path if the file exists elsewhere, for example:
import DialogContentNoClose from '@/components/ui/DialogContentNoClose';
import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageViewerModelProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

export default function ImageViewerModel({ images, currentIndex, onClose }: ImageViewerModelProps) {
  const [index, setIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setIndex(currentIndex);
    setZoom(1);
  }, [currentIndex]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
  };

  return (
<Dialog open onOpenChange={onClose}>
  <DialogContentNoClose className="max-w-5xl w-[80%] h-[80vh] bg-white p-0 overflow-hidden rounded-lg shadow-lg">

        <div className="relative flex items-center justify-center w-full h-full">
          {/* ✅ Single Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-black z-50 cursor-pointer"
          >
            <X size={26} />
          </button>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black bg-white/80 backdrop-blur rounded-full p-1 z-40 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black bg-white/80 backdrop-blur rounded-full p-1 z-40 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>

          {/* Zoom Buttons */}
          <div className="absolute bottom-4 left-4 flex gap-3 z-40">
            <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="text-gray-700 cursor-pointer">
              <ZoomOut size={20} />
            </button>
            <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="text-gray-700 cursor-pointer">
              <ZoomIn size={20} />
            </button>
          </div>

          {/* Image */}
          <img
            src={images[index]}
            alt="preview"
            className="object-contain transition-transform duration-200 ease-in-out"
            style={{
              transform: `scale(${zoom})`,
              maxHeight: '90%',
              maxWidth: '90%',
            }}
          />
        </div>
  </DialogContentNoClose>
</Dialog>


  );
}
