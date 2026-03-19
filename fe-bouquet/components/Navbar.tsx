'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Flower2 } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <nav className="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-maroon-700 to-gold-500 rounded-full flex items-center justify-center">
              <Flower2 size={20} className="text-white" />
            </div>
            <div>
              <span className="font-serif text-maroon-700 font-bold text-lg leading-none block">
                True Spark
              </span>
              <span className="text-gold-500 text-xs font-medium tracking-widest uppercase">
                Bouquets
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-maroon-700 font-medium transition-colors">
              Home
            </Link>
            <Link href="/sarees" className="text-gray-700 hover:text-maroon-700 font-medium transition-colors">
              Shop
            </Link>
            <Link href="/track" className="text-gray-700 hover:text-maroon-700 font-medium transition-colors">
              Track Order
            </Link>
          </div>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-maroon-700 transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-maroon-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-amber-100 py-4 flex flex-col gap-4">
            <Link href="/" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/sarees" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link href="/track" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Track Order</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
