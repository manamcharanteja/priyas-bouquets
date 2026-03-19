'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { sareeAPI } from '@/lib/api';
import SareeForm from '@/components/admin/SareeForm';

export default function EditSareePage() {
  const { id } = useParams();
  const [saree, setSaree] = useState<any>(null);

  useEffect(() => {
    sareeAPI.getById(id as string).then((r) => setSaree(r.data));
  }, [id]);

  if (!saree) return <div className="animate-pulse">Loading...</div>;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-8">Edit Saree</h1>
      <SareeForm saree={saree} />
    </div>
  );
}
