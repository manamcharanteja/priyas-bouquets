'use client';

import { useState, useRef } from 'react';
import { sareeAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Upload, X, Plus } from 'lucide-react';

const CATEGORIES = ['Pre-Wedding Outfits', 'Designer Wear Dresses', 'Mom & Daughter Combos', 'Maggam Work Blouses', 'Lehengas'];

interface Props {
  saree?: any;
}

export default function SareeForm({ saree }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(saree?.images || []);
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    name: saree?.name || '',
    description: saree?.description || '',
    price: saree?.price || '',
    discountedPrice: saree?.discountedPrice || '',
    category: saree?.category || 'Other',
    colors: saree?.colors || [],
    tags: saree?.tags || [],
    inStock: saree?.inStock ?? true,
    stockCount: saree?.stockCount || 1,
    featured: saree?.featured || false,
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeNewImage = (i: number) =>
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));
  const removeExistingImage = (i: number) =>
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));

  const addColor = () => {
    if (colorInput.trim()) {
      setForm((f) => ({ ...f, colors: [...f.colors, colorInput.trim()] }));
      setColorInput('');
    }
  };
  const addTag = () => {
    if (tagInput.trim()) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else fd.append(k, String(v));
      });
      newImages.forEach((f) => fd.append('images', f));
      if (saree) fd.append('existingImages', JSON.stringify(existingImages));

      if (saree) {
        await sareeAPI.update(saree._id, fd);
        toast.success('Saree updated!');
      } else {
        await sareeAPI.create(fd);
        toast.success('Saree added!');
      }
      router.push('/admin/sarees');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Images */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-4">Images (max 5)</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          {existingImages.map((url, i) => (
            <div key={url} className="relative w-20 h-24 rounded-lg overflow-hidden">
              <Image src={url} alt="" fill className="object-cover" />
              <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <X size={12} />
              </button>
            </div>
          ))}
          {newImages.map((f, i) => (
            <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden bg-amber-50">
              <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <X size={12} />
              </button>
            </div>
          ))}
          {(existingImages.length + newImages.length) < 5 && (
            <button type="button" onClick={() => fileRef.current?.click()} className="w-20 h-24 border-2 border-dashed border-amber-200 rounded-lg flex flex-col items-center justify-center text-amber-300 hover:border-maroon-300 hover:text-maroon-300 transition-colors">
              <Upload size={20} />
              <span className="text-xs mt-1">Upload</span>
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
        <h2 className="font-semibold text-gray-800">Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
            <input type="number" min="0" value={form.discountedPrice} onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700" placeholder="Leave empty for no discount" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
          <div className="flex gap-2 mb-2">
            <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }} placeholder="e.g. Red, Royal Blue" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700" />
            <button type="button" onClick={addColor} className="px-3 py-2 bg-amber-100 text-maroon-700 rounded-lg hover:bg-amber-200"><Plus size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.colors.map((c: string) => (
              <span key={c} className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full text-sm">
                {c}
                <button type="button" onClick={() => setForm((f) => ({ ...f, colors: f.colors.filter((x: string) => x !== c) }))}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} placeholder="e.g. Wedding, Bridal, Gift" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700" />
            <button type="button" onClick={addTag} className="px-3 py-2 bg-amber-100 text-maroon-700 rounded-lg hover:bg-amber-200"><Plus size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t: string) => (
              <span key={t} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                {t}
                <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x: string) => x !== t) }))}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 accent-maroon-700" />
            <span className="text-sm font-medium text-gray-700">In Stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-maroon-700" />
            <span className="text-sm font-medium text-gray-700">Featured (show on homepage)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="bg-maroon-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-maroon-800 transition-colors disabled:opacity-60">
          {loading ? 'Saving...' : saree ? 'Update Saree' : 'Add Saree'}
        </button>
        <button type="button" onClick={() => router.back()} className="border border-gray-200 text-gray-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
