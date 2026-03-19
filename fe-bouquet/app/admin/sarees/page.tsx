'use client';

import { useEffect, useState } from 'react';
import { sareeAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

export default function AdminSareesPage() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    sareeAPI.getAll().then((r) => { setSarees(r.data); setLoading(false); });
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
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
        <h1 className="font-serif text-2xl font-bold text-gray-800">Sarees</h1>
        <Link href="/admin/sarees/add" className="flex items-center gap-2 bg-maroon-700 text-white px-4 py-2 rounded-lg hover:bg-maroon-800 transition-colors">
          <Plus size={18} /> Add Saree
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sarees.map((s) => (
            <div key={s._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-[3/4] bg-amber-50">
                {s.images[0] ? (
                  <Image src={s.images[0]} alt={s.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
                )}
                {s.featured && (
                  <div className="absolute top-2 left-2 bg-gold-500 text-white p-1 rounded-full">
                    <Star size={12} fill="white" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-800 text-sm line-clamp-1">{s.name}</p>
                <p className="text-maroon-700 font-bold">₹{(s.discountedPrice || s.price).toLocaleString()}</p>
                <p className={`text-xs mt-1 ${s.inStock ? 'text-green-600' : 'text-red-400'}`}>
                  {s.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/admin/sarees/${s._id}`} className="flex-1 flex items-center justify-center gap-1 border border-amber-200 text-gray-600 py-1.5 rounded-lg text-xs hover:border-maroon-700 hover:text-maroon-700 transition-colors">
                    <Pencil size={13} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(s._id, s.name)} className="flex items-center justify-center gap-1 border border-red-100 text-red-400 py-1.5 px-2 rounded-lg text-xs hover:border-red-400 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
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
