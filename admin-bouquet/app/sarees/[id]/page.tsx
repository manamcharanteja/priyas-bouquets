'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { sareeAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Pre-Wedding Outfits', 'Designer Wear Dresses', 'Mom & Daughter Combos', 'Maggam Work Blouses', 'Lehengas'];

export default function EditSareePage() {
  const { id } = useParams();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [saree, setSaree] = useState<any>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    sareeAPI.getById(id as string).then((r) => {
      const s = r.data;
      setSaree(s);
      setExistingImages(s.images || []);
      setForm({
        name: s.name, description: s.description, price: s.price,
        discountedPrice: s.discountedPrice || '', category: s.category,
        colors: s.colors || [], tags: s.tags || [],
        inStock: s.inStock, stockCount: s.stockCount, featured: s.featured,
      });
    });
  }, [id]);

  const addColor = () => { if (colorInput.trim()) { setForm((f: any) => ({ ...f, colors: [...f.colors, colorInput.trim()] })); setColorInput(''); } };
  const addTag = () => { if (tagInput.trim()) { setForm((f: any) => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(''); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else fd.append(k, String(v));
      });
      fd.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach(f => fd.append('images', f));
      await sareeAPI.update(id as string, fd);
      toast.success('Saree updated!');
      router.push('/sarees');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="animate-pulse text-gray-400 py-10">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/sarees" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <h1 className="font-serif text-2xl font-bold text-gray-800">Edit Saree</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Images</h2>
          <div className="flex flex-wrap gap-3 mb-3">
            {existingImages.map((url, i) => (
              <div key={url} className="relative w-20 h-24 rounded-lg overflow-hidden">
                <Image src={url} alt="" fill className="object-cover" />
                <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <X size={11} />
                </button>
              </div>
            ))}
            {newImages.map((f, i) => (
              <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-50">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <X size={11} />
                </button>
              </div>
            ))}
            {(existingImages.length + newImages.length) < 5 && (
              <button type="button" onClick={() => fileRef.current?.click()} className="w-20 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-300 hover:border-maroon-700 hover:text-maroon-700 transition-colors">
                <Upload size={18} /><span className="text-xs mt-1">Add</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => setNewImages(prev => [...prev, ...Array.from(e.target.files || [])].slice(0, 5))} />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-700">Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
              <input type="number" value={form.discountedPrice} onChange={e => setForm({ ...form, discountedPrice: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm bg-white">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="flex gap-2 mb-2">
              <input value={colorInput} onChange={e => setColorInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700" />
              <button type="button" onClick={addColor} className="px-3 py-2 bg-amber-50 text-maroon-700 rounded-lg border border-amber-100"><Plus size={15} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.colors.map((c: string) => (
                <span key={c} className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs">
                  {c} <button type="button" onClick={() => setForm((f: any) => ({ ...f, colors: f.colors.filter((x: string) => x !== c) }))}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 accent-maroon-700" />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-maroon-700" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-maroon-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-maroon-800 transition-colors disabled:opacity-60 text-sm">
            {loading ? 'Saving...' : 'Update Saree'}
          </button>
          <Link href="/sarees" className="border border-gray-200 text-gray-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
