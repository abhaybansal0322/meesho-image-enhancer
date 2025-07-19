"use client";

import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ImagePreview } from '@/components/ImagePreview';
import { SuggestionsList } from '@/components/SuggestionsList';
import { Sparkles, Shield, ArrowRight, CheckCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'improvement' | 'warning' | 'success' | 'enhancement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  implemented?: boolean;
}

interface ImageItem {
  file: File;
  originalUrl: string;
  enhancedUrl?: string;
  isEnhancing: boolean;
  isEnhanced: boolean;
  isValidating: boolean;
  isValidated: boolean;
  suggestions: Suggestion[];
}

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isBatchEnhancing, setIsBatchEnhancing] = useState(false);
  const [isBatchValidating, setIsBatchValidating] = useState(false);
  const [removeBg, setRemoveBg] = useState(false);

  const handleImageUpload = (files: File[]) => {
    const imageItems = files.map(file => ({
      file,
      originalUrl: URL.createObjectURL(file),
      isEnhancing: false,
      isEnhanced: false,
      isValidating: false,
      isValidated: false,
      suggestions: [],
    }));
    setImages(prev => [...prev, ...imageItems]);
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => {
      const toRevoke = prev[index]?.originalUrl;
      if (toRevoke) URL.revokeObjectURL(toRevoke);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleEnhanceImage = async (index: number) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, isEnhancing: true } : img));
    // Simulate enhancement
    await new Promise(resolve => setTimeout(resolve, 2000));
    setImages(prev => prev.map((img, i) =>
      i === index
        ? {
            ...img,
            isEnhancing: false,
            isEnhanced: true,
            enhancedUrl: img.originalUrl, // For now, just use original as enhanced
            suggestions: [
              {
                id: `${i}-e1`,
                type: 'success',
                title: 'Brightness Enhanced',
                description: 'Image brightness and contrast have been automatically adjusted.',
                priority: 'medium',
                implemented: true,
              },
            ],
          }
        : img
    ));
  };

  const handleValidateImage = async (index: number) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, isValidating: true } : img));
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setImages(prev => prev.map((img, i) =>
      i === index
        ? {
            ...img,
            isValidating: false,
            isValidated: true,
            suggestions: [
              ...img.suggestions,
              {
                id: `${i}-v1`,
                type: 'success',
                title: 'Meesho Standards Compliant',
                description: 'Image meets all Meesho quality and content guidelines.',
                priority: 'high',
                implemented: true,
              },
            ],
          }
        : img
    ));
  };

  const handleImplementSuggestion = (suggestionId: string) => {
    setImages(prev => 
      prev.map(image => 
        image.suggestions.some(s => s.id === suggestionId)
          ? {
              ...image,
              suggestions: image.suggestions.map(s => 
                s.id === suggestionId ? { ...s, implemented: true } : s
              )
            }
          : image
      )
    );
  };

  const handleEnhanceAll = async () => {
    setIsBatchEnhancing(true);
    setImages(prev => prev.map(img => ({ ...img, isEnhancing: true })));

    const enhancedResults = await Promise.all(
      images.map(async (img) => {
        const formData = new FormData();
        formData.append('image', img.file);
        if (removeBg) formData.append('removeBg', 'true');
        try {
          const res = await fetch('/api/enhance', {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) throw new Error('Enhance failed');
          const blob = await res.blob();
          const enhancedUrl = URL.createObjectURL(blob);
          return {
            ...img,
            isEnhancing: false,
            isEnhanced: true,
            enhancedUrl,
            suggestions: [
              ...img.suggestions,
              {
                id: `${img.originalUrl}-e1`,
                type: 'success',
                title: 'Brightness Enhanced',
                description: 'Image brightness and contrast have been automatically adjusted.' + (removeBg ? ' Background removed.' : ''),
                priority: 'medium',
                implemented: true,
              },
            ],
          };
        } catch (err) {
          return { ...img, isEnhancing: false, isEnhanced: false };
        }
      })
    );
    setImages(enhancedResults);
    setIsBatchEnhancing(false);
  };

  const handleValidateAll = async () => {
    setIsBatchValidating(true);
    setImages(prev => prev.map(img => ({ ...img, isValidating: true })));

    const validatedResults = await Promise.all(
      images.map(async (img) => {
        const formData = new FormData();
        formData.append('image', img.file);
        try {
          const res = await fetch('/api/validate', {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) throw new Error('Validate failed');
          const data = await res.json();
          return {
            ...img,
            isValidating: false,
            isValidated: true,
            suggestions: [
              ...img.suggestions,
              {
                id: `${img.originalUrl}-v1`,
                type: 'success',
                title: 'Validation Result',
                description: data.result || 'Validated by AI.',
                priority: 'high',
                implemented: true,
              },
            ],
          };
        } catch (err) {
          return { ...img, isValidating: false, isValidated: false };
        }
      })
    );
    setImages(validatedResults);
    setIsBatchValidating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Sparkles size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Product Image Enhancer & Validator
              </h1>
              <p className="text-gray-600">
                Enhance your product images and validate them against Meesho standards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Product Images
              </h2>
              <ImageUpload
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                uploadedImages={images.map(img => img.originalUrl)}
              />
            </div>

            {/* Remove Background Toggle and Enhance/Validate All Buttons */}
            {images.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 space-y-2 md:space-y-0 md:space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={removeBg}
                    onChange={e => setRemoveBg(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700 font-medium">Remove Background</span>
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={handleEnhanceAll}
                    disabled={isBatchEnhancing || images.every(img => img.isEnhanced)}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    {isBatchEnhancing ? 'Enhancing All...' : 'Enhance All'}
                  </button>
                  <button
                    onClick={handleValidateAll}
                    disabled={isBatchValidating || images.every(img => img.isValidated)}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    {isBatchValidating ? 'Validating All...' : 'Validate All'}
                  </button>
                </div>
              </div>
            )}

            {/* Image Previews with per-image actions */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={img.originalUrl} className="flex flex-col space-y-2">
                    <ImagePreview
                      imageUrl={img.enhancedUrl || img.originalUrl}
                      title={`Product Image ${idx + 1}`}
                      isEnhanced={img.isEnhanced}
                    />
                    {/* Suggestions for this image */}
                    {img.suggestions.length > 0 && (
                      <div className="mt-2">
                        <SuggestionsList
                          suggestions={img.suggestions}
                          onImplementSuggestion={handleImplementSuggestion}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Features Info */}
          <div className="space-y-6">
            <SuggestionsList
              suggestions={[]} // No global suggestions for now
              onImplementSuggestion={() => {}}
            />

            {/* Features Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                AI Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Sparkles size={20} className="text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Smart Enhancement</h4>
                    <p className="text-sm text-gray-600">
                      AI-powered brightness, background removal, and quality improvements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield size={20} className="text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Meesho Validation</h4>
                    <p className="text-sm text-gray-600">
                      Checks compliance with Meesho standards and guidelines
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight size={20} className="text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Smart Suggestions</h4>
                    <p className="text-sm text-gray-600">
                      Get actionable recommendations for better product visibility
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}