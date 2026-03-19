import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Priya's Bouquets | Handcrafted Saree Bouquets",
  description:
    "Beautiful handcrafted saree bouquets and designer sarees. Perfect gifting for every occasion. Shop Priya's Bouquets.",
  keywords: 'saree bouquet, designer sarees, handcrafted bouquets, silk sarees, saree gifts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-cream">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
