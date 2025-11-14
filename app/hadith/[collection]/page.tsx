'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type HadithResponse = {
  collection: string;
  number: string;
  arabic: string | null;
  english: string | null;
  sindhi: string | null;
  meta?: {
    source?: string;
    note?: string;
  };
};

export default function HadithReaderPage() {
  const params = useParams<{ collection: string }>();
  const router = useRouter();
  const collection = params?.collection as string;

  const [number, setNumber] = useState('1');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HadithResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHadith = async (n: string) => {
    if (!collection) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/hadith/${collection}/${n}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to fetch');
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch hadith');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHadith(number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (number.trim()) fetchHadith(number.trim());
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8" dir="rtl">
      <button className="mb-4 text-sm text-blue-700 dark:text-yellow-300" onClick={() => router.back()}>
        ← واپس
      </button>
      <h1 className="text-2xl font-bold text-right text-blue-800 dark:text-yellow-300 mb-4">مجموعو: {collection}</h1>

      <form onSubmit={onSubmit} className="flex items-center justify-end gap-2 mb-6">
        <input
          type="number"
          min={1}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-32 text-right px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          placeholder="حديث نمبر"
        />
        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">
          ڳوليو
        </button>
      </form>

      {loading && <p className="text-gray-600 dark:text-gray-300">لوڊ ٿي رهيو آهي...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <div className="space-y-4">
          {data.arabic && (
            <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/10">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 text-right">متن عربي</h3>
              <p className="arabic-text-ayat text-right text-blue-900 dark:text-yellow-200 text-lg leading-loose">{data.arabic}</p>
            </div>
          )}
          
          <div className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 bg-yellow-50/30 dark:bg-yellow-900/10">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 text-right">سنڌي ترجمو</h3>
            {data.sindhi ? (
              <p className="sindhi-text text-right text-gray-800 dark:text-gray-200 leading-relaxed">{data.sindhi}</p>
            ) : (
              <p className="text-right text-sm text-gray-500 dark:text-gray-400">سنڌي ترجمو عارضي طور موجود نه آهي.</p>
            )}
          </div>
          
          {data.meta && data.meta.note && (
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{data.meta.note}</span>
              {data.meta.source === 'sunnah.com' && (
                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">✓ تصديق ٿيل</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


