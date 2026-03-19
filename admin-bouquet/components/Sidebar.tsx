'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flower2, LayoutDashboard, ShoppingBag, Package, CreditCard, LogOut } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sarees', label: 'Sarees', icon: ShoppingBag },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/transactions', label: 'Transactions', icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    router.push('/login');
  };

  return (
    <aside className="w-60 bg-maroon-700 text-white flex flex-col fixed h-full z-10">
      <div className="p-5 border-b border-maroon-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center">
            <Flower2 size={18} className="text-white" />
          </div>
          <div>
            <p className="font-serif font-bold text-base leading-tight">Priya's Bouquets</p>
            <p className="text-xs text-amber-300 tracking-widest uppercase">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              pathname.startsWith(href)
                ? 'bg-white/20 text-white'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-maroon-600">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-amber-100 hover:bg-white/10 rounded-lg w-full text-sm transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
