import Link from 'next/link';
import { Flower2, Mail, Phone, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-maroon-700 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center">
                <Flower2 size={20} className="text-white" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg">True Spark</span>
                <span className="text-gold-400 text-xs block tracking-widest uppercase">Bouquets</span>
              </div>
            </div>
            <p className="text-amber-100 text-sm leading-relaxed">
              Handcrafted saree bouquets with love. Perfect for weddings, birthdays,
              and every special occasion.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-amber-100">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-amber-200 hover:text-white text-sm transition-colors">Home</Link>
              <Link href="/sarees" className="text-amber-200 hover:text-white text-sm transition-colors">Shop Sarees</Link>
              <Link href="/track" className="text-amber-200 hover:text-white text-sm transition-colors">Track Order</Link>
              <Link href="/cart" className="text-amber-200 hover:text-white text-sm transition-colors">Cart</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-amber-100">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:manamteja021@gmail.com" className="flex items-center gap-2 text-amber-200 hover:text-white text-sm transition-colors">
                <Mail size={16} />
                manamteja021@gmail.com
              </a>
              <div className="flex items-center gap-2 text-amber-200 text-sm">
                <Phone size={16} />
                +91 XXXXX XXXXX
              </div>
              <div className="flex items-center gap-2 text-amber-200 text-sm">
                <Instagram size={16} />
                @priyasbouquets
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-maroon-600 mt-8 pt-6 text-center text-amber-200 text-sm">
          <p>&copy; {new Date().getFullYear()} True Spark. All rights reserved. Made with love 🌸</p>
        </div>
      </div>
    </footer>
  );
}
