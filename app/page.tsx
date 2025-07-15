'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
type Chapter = {
  chapter: number;
  englishName: string;
  name: string;
  ayahCount: number;
};

export default function Home() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRead, setLastRead] = useState<number | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch('/api/chapters', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok) {
          setChapters(data.chapters || data);
        } else {
          setChapters([]);
        }
      } catch (err) {
        console.error('Error:', err);
        setChapters([]);

      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
    setLastRead(Number(localStorage.getItem('lastReadSurah')) || null);
  }, []);

  const filteredChapters = chapters.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen bg-center bg-cover"
      style={{
        backgroundImage: "linear-gradient(to bottom right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/background.jpg')",
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="relative z-10 px-4 sm:px-10 py-10">
        <div className="max-w-6xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-8 shadow-2xl text-gray-800 dark:text-gray-100 space-y-10">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-8xl !text-center font-extrabold text-blue-800 dark:text-yellow-400 tracking-tight sindhi-text-nobackground font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-yellow-600 to-orange-500 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.5)] dark:from-yellow-300 dark:via-yellow-500 dark:to-yellow-100">
              قرآن سنڌي ترجمو
            </h1>
          </div>

          {/* Search */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
                🔍
              </div>
            </div>
          </div>

          {/* Last Read */}
          {lastRead && (() => {
            const lastReadSurah = chapters.find(s => s.chapter === lastRead);
            if (!lastReadSurah) return null;
            return (
              <div className="flex items-center gap-3 bg-yellow-100 dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 rounded-xl py-2 px-4 max-w-fit mx-auto shadow-md" dir="rtl">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-yellow-200 dark:bg-gray-700 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-700 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6 2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z" />
                  </svg>
                </span>
                <span className="sindhi-text-nobackground font-semibold text-base">آخري پڙهيل سورت:</span>
                <Link href={`/${lastRead}`} className="arabic-text text-xl font-bold text-blue-700 dark:text-yellow-300 underline ml-2">
                  {lastReadSurah.name}
                </Link>
              </div>
            );
          })()}

          {/* Section Title */}
          <h2 className="text-center text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-100 mt-4">
            سورتن جي فهرست
          </h2>

          {/* Chapters Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 animate-pulse h-32 rounded-xl"></div>
              ))}
            </div>
          ) : filteredChapters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-right" dir="ltr">
              {filteredChapters.map((s) => (
                <Link
                  key={s.chapter}
                  href={`/${s.chapter}`}
                  onClick={() => localStorage.setItem('lastReadSurah', s.chapter.toString())}
                  className="block transition transform hover:-translate-y-1 hover:shadow-lg active:scale-95 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-blue-700 dark:text-yellow-300 mb-2">
                    <span className="arabic-text text-3xl leading-snug">{s.name}</span>
                    <span className="block text-base text-gray-500 dark:text-gray-300 font-normal font-sans">
                      {s.englishName}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex flex-row-reverse items-center justify-end gap-1 text-right">
                    <span>:آيتون</span>
                    <span dir="rtl">{s.ayahCount}</span>
                  </p>


                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-red-400 text-lg font-medium mt-10">
              No chapters found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
