import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';

export const metadata: Metadata = {
  title: "Admin | Priya's Bouquets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
