"use client";

import { useState } from 'react';
import { ZoomIn, Download, RotateCw, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  imageUrl: string;
  title?: string;
  isEnhanced?: boolean;
  className?: string;
}

export function ImagePreview({ imageUrl, title = "Product Image", isEnhanced = false, className }: ImagePreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {isEnhanced && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Enhanced
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRotate}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Rotate image"
          >
            <RotateCw size={16} />
          </button>
          <button
            onClick={handleZoomToggle}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle zoom"
          >
            {isZoomed ? <Maximize size={16} /> : <ZoomIn size={16} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download image"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative bg-gray-50 overflow-hidden">
        <div className={cn(
          "relative w-full h-64 md:h-80 transition-transform duration-300 ease-in-out cursor-pointer",
          isZoomed && "scale-150"
        )}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain bg-gray-100 transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={handleZoomToggle}
          />
        </div>
        
        {/* Zoom overlay */}
        {isZoomed && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center cursor-pointer"
            onClick={handleZoomToggle}
          >
            <div className="bg-white rounded-lg px-3 py-1 text-sm font-medium">
              Click to zoom out
            </div>
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Ready for validation</span>
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>High Quality</span>
          </span>
        </div>
      </div>
    </div>
  );
}