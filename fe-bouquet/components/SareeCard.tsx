'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';

interface Saree {
  _id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
}

export default function SareeCard({ saree }: { saree: Saree }) {
  const addItem = useCartStore((s) => s.addItem);
  const displayPrice = saree.discountedPrice || saree.price;
  const hasDiscount = saree.discountedPrice && saree.discountedPrice < saree.price;
  const discountPct = hasDiscount
    ? Math.round(((saree.price - saree.discountedPrice!) / saree.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!saree.inStock) return;
    addItem({ sareeId: saree._id, name: saree.name, price: displayPrice, imageUrl: saree.images[0] || '' });
    toast.success('Added to cart!');
  };

  return (
    <Link href={`/sarees/${saree._id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {saree.images[0] ? (
            <Image
              src={saree.images[0]}
              alt={saree.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-amber-50">🌸</div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="bg-maroon-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {discountPct}% OFF
              </span>
            )}
            {!saree.inStock && (
              <span className="bg-gray-800/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {/* Cart button on hover */}
          {saree.inStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-maroon-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-maroon-700 hover:text-white"
            >
              <ShoppingCart size={17} />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Tag size={11} className="text-gold-500" />
            <span className="text-xs text-gold-500 font-medium uppercase tracking-wide truncate">
              {saree.category}
            </span>
          </div>
          <h3 className="font-serif font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2">
            {saree.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-maroon-700 font-bold text-base">
              ₹{displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 text-xs line-through">
                ₹{saree.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
