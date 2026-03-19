'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!saree.inStock) return;
    addItem({
      sareeId: saree._id,
      name: saree.name,
      price: displayPrice,
      imageUrl: saree.images[0] || '',
    });
    toast.success(`${saree.name} added to cart!`);
  };

  return (
    <Link href={`/sarees/${saree._id}`}>
      <div className="card group hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative aspect-[3/4] overflow-hidden">
          {saree.images[0] ? (
            <Image
              src={saree.images[0]}
              alt={saree.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-amber-50 flex items-center justify-center text-4xl">🌸</div>
          )}
          {!saree.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-maroon-700 px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-maroon-700 text-white text-xs px-2 py-1 rounded-full">
              SALE
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gold-500 font-medium uppercase tracking-wide mb-1">{saree.category}</p>
          <h3 className="font-serif text-gray-800 font-semibold mb-2 line-clamp-2">{saree.name}</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-maroon-700 font-bold text-lg">₹{displayPrice.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-gray-400 text-sm line-through ml-2">₹{saree.price.toLocaleString()}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!saree.inStock}
              className="bg-maroon-700 text-white p-2 rounded-lg hover:bg-maroon-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
