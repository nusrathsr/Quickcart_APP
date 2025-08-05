'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function MasterCategoriesPage() {
  const [masterCategories, setMasterCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/master-categories')
      .then(res => setMasterCategories(res.data))
      .catch(err => console.error('Error fetching master categories:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading Master Categories...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Master Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {masterCategories.map(cat => (
          <Link
            key={cat._id}
            href={`/categories/${cat.slug}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <img src={cat.image || '/placeholder.png'} alt={cat.name} className="w-full h-40 object-cover" />
            <h2 className="text-center font-medium py-2">{cat.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
