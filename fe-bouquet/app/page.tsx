import Link from 'next/link';
import { sareeAPI } from '@/lib/api';
import SareeCard from '@/components/SareeCard';
import { Flower2, Star, Truck, Shield } from 'lucide-react';

async function getFeaturedSarees() {
  try {
    const res = await sareeAPI.getAll({ featured: true });
    return res.data.slice(0, 6);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedSarees();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-maroon-700 via-maroon-800 to-[#3d0a0a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🌸</div>
          <div className="absolute top-32 right-20 text-6xl">✨</div>
          <div className="absolute bottom-20 left-1/3 text-7xl">🌺</div>
          <div className="absolute bottom-10 right-10 text-5xl">🌸</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-amber-200 text-sm mb-6">
            <Flower2 size={16} />
            Handcrafted with love
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Beautiful Saree Bouquets<br />
            <span className="text-gold-400">for Every Occasion</span>
          </h1>
          <p className="text-amber-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Unique handcrafted saree bouquets, designer silk sarees, and exclusive collections.
            Perfect for weddings, birthdays & gifting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sarees" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Shop Now
            </Link>
            <Link href="/sarees?category=Bouquet+Set" className="border-2 border-white text-white hover:bg-white hover:text-maroon-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              View Bouquet Sets
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Flower2 className="text-maroon-700" size={28} />, title: 'Handcrafted', desc: 'Every bouquet made with love and attention to detail' },
              { icon: <Truck className="text-maroon-700" size={28} />, title: 'Pan India Delivery', desc: 'We deliver across India with care and speed' },
              { icon: <Shield className="text-maroon-700" size={28} />, title: 'Secure Payment', desc: 'UPI payments — safe, instant, and free' },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center">{f.icon}</div>
                <h3 className="font-serif font-semibold text-gray-800">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sarees */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Featured Collections
            </h2>
            <p className="text-gray-500">Our most loved sarees and bouquets</p>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
              {featured.map((saree: any) => (
                <SareeCard key={saree._id} saree={saree} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-4">🌸</div>
              <p>New collections coming soon!</p>
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/sarees" className="btn-outline inline-block">
              View All Sarees
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-center text-gray-800 mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Anjali R.', review: 'Ordered a saree bouquet for my friend\'s baby shower. It was absolutely stunning! The quality was amazing.' },
              { name: 'Meena S.', review: 'True Spark\'s designs are a work of art. Gifted one for a wedding — everyone was in awe. Will order again!' },
              { name: 'Divya K.', review: 'Loved the packaging and the saree quality. Fast delivery and very responsive. Highly recommend!' },
            ].map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex text-gold-500 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{t.review}"</p>
                <p className="font-semibold text-maroon-700">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
