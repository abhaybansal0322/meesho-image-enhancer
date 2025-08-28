"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles, Shield, ArrowRight, CheckCircle } from 'lucide-react';

interface PreviewItem { url: string; enhanced: boolean; validated: boolean }

export default function Home() {
  const [previews, setPreviews] = useState<PreviewItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('recentPreviews');
      if (raw) setPreviews(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Sparkles size={22} className="text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Product Image Studio</h1>
          </div>
          <Link
            href="/tool"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <span>Open App</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Enhance, Validate, and Ship Product Images with Confidence
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Upload multiple images, remove backgrounds, auto-enhance quality, and validate against Meesho e-commerce standards using AI.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/tool" className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 font-medium">
                Get Started
              </Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 font-medium">
                Learn More
              </a>
            </div>
            <div className="mt-6 flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-green-600" />
              <span>No data stored. Processes run securely on server.</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            {previews.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {previews.slice(0, 4).map((p, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border">
                    <img src={p.url} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 text-xs bg-white/80 backdrop-blur px-2 py-0.5 rounded">
                      {p.enhanced ? 'Enhanced' : 'Original'}{p.validated ? ' • Validated' : ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500">Preview of enhanced, validated images</p>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <Sparkles size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Smart Enhancement</h3>
            </div>
            <p className="mt-3 text-gray-600">Automatic brightness and contrast tuning with optional background removal via remove.bg.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <Shield size={20} className="text-green-600" />
              <h3 className="font-semibold text-gray-900">AI Validation</h3>
            </div>
            <p className="mt-3 text-gray-600">Validate images against Meesho listing guidelines using GPT‑4 Vision.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <ArrowRight size={20} className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">Batch Workflow</h3>
            </div>
            <p className="mt-3 text-gray-600">Upload, enhance, and validate multiple images in one streamlined flow.</p>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} AI Product Image Studio</span>
          <Link href="/tool" className="text-blue-600 hover:text-blue-700">Open the App</Link>
        </div>
      </footer>
    </main>
  );
}