"use client";

import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUpload: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  uploadedImages: string[];
  className?: string;
}

export function ImageUpload({ onImageUpload, onImageRemove, uploadedImages, className }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      handleFilesUpload(files);
    }
  }, []);

  const handleFilesUpload = useCallback((files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      alert('Some files were not images or exceeded 10MB.');
    }
    if (validFiles.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        onImageUpload(validFiles);
        setIsUploading(false);
      }, 1000);
    }
  }, [onImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      handleFilesUpload(files);
    }
  }, [handleFilesUpload]);

  if (uploadedImages && uploadedImages.length > 0) {
    return (
      <div className={cn("relative group grid grid-cols-2 md:grid-cols-3 gap-4", className)}>
        {uploadedImages.map((img, idx) => (
          <div key={img} className="relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <img
              src={img}
              alt={`Uploaded product ${idx + 1}`}
              className="w-full h-64 object-contain bg-gray-100"
            />
            <button
              onClick={() => onImageRemove(idx)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          isDragOver 
            ? "border-blue-400 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          ) : (
            <div className={cn(
              "rounded-full p-4 transition-colors",
              isDragOver ? "bg-blue-100" : "bg-gray-100"
            )}>
              <Upload size={24} className={cn(
                "transition-colors",
                isDragOver ? "text-blue-500" : "text-gray-600"
              )} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {isUploading ? "Uploading..." : "Upload Product Images"}
            </h3>
            <p className="text-sm text-gray-500">
              Drag and drop your images here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports JPG, PNG, WebP up to 10MB each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}