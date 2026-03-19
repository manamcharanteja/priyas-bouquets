'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQty, totalAmount } = useCartStore();

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <ShoppingBag size={56} className="text-gray-200 mb-4" />
      <h2 className="font-serif text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 text-sm mb-6">Add something beautiful to get started</p>
      <Link href="/sarees" className="btn-primary inline-flex items-center gap-2">
        Shop Now <ArrowRight size={16} />
      </Link>
    </div>
  );

  const subtotal = totalAmount();
  const shipping = 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">
          Shopping Cart <span className="text-gray-400 font-normal text-base ml-2">({items.length} item{items.length > 1 ? 's' : ''})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items list */}
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <div key={item.sareeId} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm border border-gray-100">
                {/* Image */}
                <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  {item.imageUrl
                    ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">🌸</div>}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm leading-snug line-clamp-2">{item.name}</h3>
                  <p className="text-maroon-700 font-bold text-sm mt-1">₹{item.price.toLocaleString()}</p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.sareeId, item.qty - 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-maroon-700 hover:text-maroon-700 transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold text-gray-800 w-5 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.sareeId, item.qty + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-maroon-700 hover:text-maroon-700 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Right: total + delete */}
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.sareeId)}
                    className="text-gray-300 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={15} />
                  </button>
                  <span className="font-bold text-gray-800 text-sm">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            <Link href="/sarees" className="inline-block text-xs text-maroon-700 hover:underline mt-1">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-20">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Order Summary</h2>
              </div>

              <div className="px-5 py-4 space-y-2.5">
                {items.map((item) => (
                  <div key={item.sareeId} className="flex justify-between text-sm">
                    <span className="text-gray-500 line-clamp-1 flex-1 mr-3">{item.name} ×{item.qty}</span>
                    <span className="text-gray-700 font-medium whitespace-nowrap">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-4 space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-maroon-700 text-xl">₹{subtotal.toLocaleString()}</span>
                </div>
                <Link href="/checkout"
                  className="w-full bg-maroon-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-maroon-800 transition-colors">
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
