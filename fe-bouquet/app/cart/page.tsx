'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQty, totalAmount } = useCartStore();

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={64} className="mx-auto text-amber-200 mb-4" />
      <h2 className="font-serif text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Add some beautiful sarees to your cart!</p>
      <Link href="/sarees" className="btn-primary inline-block">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.sareeId} className="card p-4 flex gap-4">
              <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-amber-50">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🌸</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-gray-800">{item.name}</h3>
                <p className="text-maroon-700 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => updateQty(item.sareeId, item.qty - 1)} className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center hover:border-maroon-700 hover:text-maroon-700 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="font-medium text-gray-800 w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.sareeId, item.qty + 1)} className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center hover:border-maroon-700 hover:text-maroon-700 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.sareeId)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
                <p className="font-bold text-gray-800">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.sareeId} className="flex justify-between text-sm text-gray-600">
                <span className="line-clamp-1 flex-1 mr-2">{item.name} x{item.qty}</span>
                <span>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-amber-100 pt-3 mb-6">
            <div className="flex justify-between font-bold text-gray-800 text-lg">
              <span>Total</span>
              <span className="text-maroon-700">₹{totalAmount().toLocaleString()}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary w-full block text-center">
            Proceed to Checkout
          </Link>
          <Link href="/sarees" className="mt-3 text-center block text-maroon-700 text-sm hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
