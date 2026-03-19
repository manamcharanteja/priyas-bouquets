'use client';

import { useEffect, useState } from 'react';
import { sareeAPI } from '@/lib/api';
import SareeCard from '@/components/SareeCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Pre-Wedding Outfits', 'Designer Wear Dresses', 'Mom & Daughter Combos', 'Maggam Work Blouses', 'Lehengas'];

export default function SareesPage() {
  const [sarees, setSarees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        const res = await sareeAPI.getAll(params);
        setSarees(res.data);
      } catch {
        setSarees([]);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetch, 300);
    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-2">Our Collection</h1>
        <p className="text-gray-500">Handpicked sarees and bouquets for every occasion</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sarees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-maroon-700 text-white'
                : 'bg-white border border-amber-200 text-gray-600 hover:border-maroon-700 hover:text-maroon-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[3/4] bg-amber-50" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-amber-100 rounded w-1/2" />
                <div className="h-4 bg-amber-100 rounded" />
                <div className="h-4 bg-amber-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : sarees.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sarees.map((saree) => (
            <SareeCard key={saree._id} saree={saree} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🌸</div>
          <p className="text-lg">No sarees found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
