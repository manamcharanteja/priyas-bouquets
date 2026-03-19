'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { sareeAPI } from '@/lib/api';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export default function SareeDetailPage() {
  const { id } = useParams();
  const [saree, setSaree] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    sareeAPI.getById(id as string).then((res) => {
      setSaree(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-[3/4] bg-amber-50 rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 bg-amber-100 rounded w-3/4" />
          <div className="h-6 bg-amber-100 rounded w-1/4" />
          <div className="h-24 bg-amber-100 rounded" />
        </div>
      </div>
    </div>
  );

  if (!saree) return <div className="text-center py-20">Saree not found.</div>;

  const displayPrice = saree.discountedPrice || saree.price;
  const hasDiscount = saree.discountedPrice && saree.discountedPrice < saree.price;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/sarees" className="flex items-center gap-2 text-maroon-700 mb-6 hover:underline">
        <ArrowLeft size={18} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-amber-50 mb-3">
            {saree.images[activeImg] ? (
              <Image src={saree.images[activeImg]} alt={saree.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🌸</div>
            )}
          </div>
          {saree.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {saree.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    activeImg === i ? 'border-maroon-700' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-gold-500 font-medium text-sm uppercase tracking-wider mb-2">{saree.category}</p>
          <h1 className="font-serif text-3xl font-bold text-gray-800 mb-4">{saree.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-maroon-700 font-bold text-3xl">₹{displayPrice.toLocaleString()}</span>
            {hasDiscount && (
              <>
                <span className="text-gray-400 line-through text-xl">₹{saree.price.toLocaleString()}</span>
                <span className="bg-maroon-100 text-maroon-700 text-sm px-2 py-1 rounded-full font-medium">
                  {Math.round(((saree.price - saree.discountedPrice) / saree.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{saree.description}</p>

          {saree.colors?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Colors</p>
              <div className="flex flex-wrap gap-2">
                {saree.colors.map((c: string) => (
                  <span key={c} className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-sm text-gray-700">{c}</span>
                ))}
              </div>
            </div>
          )}

          {saree.tags?.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {saree.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${saree.inStock ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${saree.inStock ? 'text-green-600' : 'text-red-500'}`}>
              {saree.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <button
            disabled={!saree.inStock}
            onClick={() => {
              addItem({ sareeId: saree._id, name: saree.name, price: displayPrice, imageUrl: saree.images[0] || '' });
              toast.success('Added to cart!');
            }}
            className="w-full flex items-center justify-center gap-3 bg-maroon-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-maroon-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={22} />
            Add to Cart
          </button>

          <Link href="/cart" className="mt-3 w-full flex items-center justify-center border-2 border-maroon-700 text-maroon-700 py-4 rounded-xl font-semibold text-lg hover:bg-maroon-50 transition-colors">
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
