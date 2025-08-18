'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Collection = { id: string; name: string; available?: number };

export default function HadithCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch('/api/hadith/collections', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed');
        setCollections(data.collections || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load collections');
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-yellow-300 text-right mb-6">حديث مجموعا</h1>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">لوڊ ٿي رهيو آهي...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((c) => (
            <Link key={c.id} href={`/hadith/${encodeURIComponent(c.id)}`} className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow transition">
              <div className="text-right">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{c.name}</h2>
                {typeof c.available === 'number' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">موجود: {c.available}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


