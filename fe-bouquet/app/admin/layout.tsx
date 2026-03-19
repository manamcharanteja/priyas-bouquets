'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flower2, LayoutDashboard, ShoppingBag, Package, CreditCard, LogOut } from 'lucide-react';
import { useEffect } from 'react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/sarees', label: 'Sarees', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = localStorage.getItem('admin_token');
    if (!token) router.push('/admin/login');
  }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-maroon-700 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-maroon-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center">
              <Flower2 size={20} className="text-white" />
            </div>
            <div>
              <p className="font-serif font-bold">True Spark</p>
              <p className="text-gold-400 text-xs tracking-widest uppercase">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-maroon-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-amber-100 hover:bg-white/10 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
