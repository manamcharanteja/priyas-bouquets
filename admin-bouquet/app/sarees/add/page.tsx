'use client';

import { useState, useRef } from 'react';
import { sareeAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Bouquet Set', 'Kanchipuram', 'Banarasi', 'Silk', 'Cotton', 'Designer', 'Other'];

export default function AddSareePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountedPrice: '',
    category: 'Other', colors: [] as string[], tags: [] as string[],
    inStock: true, stockCount: '1', featured: false,
  });

  const addColor = () => { if (colorInput.trim()) { setForm(f => ({ ...f, colors: [...f.colors, colorInput.trim()] })); setColorInput(''); } };
  const addTag = () => { if (tagInput.trim()) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(''); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { toast.error('Add at least one image'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else fd.append(k, String(v));
      });
      images.forEach(f => fd.append('images', f));
      await sareeAPI.create(fd);
      toast.success('Saree added successfully!');
      router.push('/sarees');
    } catch {
      toast.error('Failed to add saree. Check Cloudinary settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/sarees" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <h1 className="font-serif text-2xl font-bold text-gray-800">Add New Saree</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Images */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Images <span className="text-gray-400 font-normal text-sm">(max 5)</span></h2>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((f, i) => (
              <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-50">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <X size={11} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button type="button" onClick={() => fileRef.current?.click()} className="w-20 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-300 hover:border-maroon-700 hover:text-maroon-700 transition-colors">
                <Upload size={18} />
                <span className="text-xs mt-1">Upload</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => setImages(prev => [...prev, ...Array.from(e.target.files || [])].slice(0, 5))} />
          <p className="text-xs text-gray-400">Requires Cloudinary to be configured in backend .env</p>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-700">Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input required type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
              <input type="number" min="0" value={form.discountedPrice} onChange={e => setForm({ ...form, discountedPrice: e.target.value })}
                placeholder="Optional" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm bg-white">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="flex gap-2 mb-2">
              <input value={colorInput} onChange={e => setColorInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }}
                placeholder="e.g. Red, Gold" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700" />
              <button type="button" onClick={addColor} className="px-3 py-2 bg-amber-50 text-maroon-700 rounded-lg hover:bg-amber-100 border border-amber-100"><Plus size={15} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.colors.map(c => (
                <span key={c} className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs text-gray-700">
                  {c} <button type="button" onClick={() => setForm(f => ({ ...f, colors: f.colors.filter(x => x !== c) }))}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="e.g. Wedding, Gift" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700" />
              <button type="button" onClick={addTag} className="px-3 py-2 bg-amber-50 text-maroon-700 rounded-lg hover:bg-amber-100 border border-amber-100"><Plus size={15} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
                  {t} <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 accent-maroon-700" />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-maroon-700" />
              <span className="text-sm text-gray-700">Featured on homepage</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-maroon-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-maroon-800 transition-colors disabled:opacity-60 text-sm">
            {loading ? 'Adding...' : 'Add Saree'}
          </button>
          <Link href="/sarees" className="border border-gray-200 text-gray-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
