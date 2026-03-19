'use client';

import { useEffect, useState } from 'react';
import { sareeAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star, PackageX } from 'lucide-react';

export default function SareesPage() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    sareeAPI.getAll().then((r) => { setSarees(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await sareeAPI.delete(id);
      toast.success('Saree deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Sarees</h1>
          <p className="text-gray-400 text-sm mt-1">{sarees.length} products</p>
        </div>
        <Link href="/sarees/add" className="flex items-center gap-2 bg-maroon-700 text-white px-4 py-2.5 rounded-lg hover:bg-maroon-800 transition-colors text-sm font-medium">
          <Plus size={16} /> Add Saree
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />)}
        </div>
      ) : sarees.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-20 text-center">
          <PackageX size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400">No sarees yet. Add your first one!</p>
          <Link href="/sarees/add" className="inline-block mt-4 bg-maroon-700 text-white px-5 py-2 rounded-lg text-sm hover:bg-maroon-800 transition-colors">
            Add Saree
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sarees.map((s) => (
            <div key={s._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[3/4] bg-amber-50">
                {s.images?.[0] ? (
                  <Image src={s.images[0]} alt={s.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
                )}
                {s.featured && (
                  <div className="absolute top-2 left-2 bg-gold-500 text-white p-1 rounded-full">
                    <Star size={11} fill="white" />
                  </div>
                )}
                {!s.inStock && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="bg-white text-red-500 text-xs px-2 py-1 rounded-full font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gold-500 font-medium mb-0.5">{s.category}</p>
                <p className="font-semibold text-gray-800 text-sm line-clamp-1">{s.name}</p>
                <p className="text-maroon-700 font-bold text-sm mt-0.5">
                  ₹{(s.discountedPrice || s.price).toLocaleString()}
                  {s.discountedPrice && <span className="text-gray-400 font-normal line-through ml-1 text-xs">₹{s.price.toLocaleString()}</span>}
                </p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/sarees/${s._id}`} className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-600 py-1.5 rounded-lg text-xs hover:border-maroon-700 hover:text-maroon-700 transition-colors">
                    <Pencil size={12} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(s._id, s.name)} className="flex items-center justify-center border border-red-100 text-red-400 py-1.5 px-2.5 rounded-lg text-xs hover:border-red-400 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
