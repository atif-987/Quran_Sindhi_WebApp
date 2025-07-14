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
  },[]);

  const filteredChapters = chapters.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>

    <div
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10 transition-all"
      style={{
        backgroundImage: "url('/islamic-pattern.jpg')",
        backgroundColor: 'rgba(255,255,255,0.9)',
        backgroundBlendMode: 'lighten',
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8 backdrop-blur-sm bg-white/80 dark:bg-gray-900 rounded-2xl p-6 shadow-md text-gray-800 dark:text-gray-100">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 dark:text-yellow-400 tracking-tight mb-2 sindhi-text">
            <span className="inline-block align-middle mr-2"></span> قرآن سنڌي ترجمو
          </h1>

        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Search Surah..."
            className="w-full sm:w-1/2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        {/* Last Read */}
        {lastRead && (() => {
          const lastReadSurah = chapters.find(s => s.chapter === lastRead);
          if (!lastReadSurah) return null;
          return (
            <div
            className="flex items-center gap-3 bg-yellow-100 dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 rounded-xl py-2 px-4 max-w-fit mx-auto shadow-lg mt-2"
            dir="rtl"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 bg-yellow-200 dark:bg-gray-700 rounded-md">
              <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-yellow-700 dark:text-yellow-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6l4 2m6 2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z' /></svg>
            </span>
            <span className="sindhi-text font-semibold text-base">آخري پڙهيل سورت:</span>
            <Link href={`/${lastRead}`} className="arabic-text text-xl font-bold text-blue-700 dark:text-yellow-300 underline ml-2">
              {lastReadSurah.name}
            </Link>
          </div>
          
          );
        })()}

        {/* Chapters Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 animate-pulse h-32 rounded-xl"></div>
            ))}
          </div>
        ) : filteredChapters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredChapters.map((s) => (
              <Link
                key={s.chapter}
                href={`/${s.chapter}`}
                onClick={() => localStorage.setItem('lastReadSurah', s.chapter.toString())}
                className="block card hover:shadow-xl hover:border-blue-500 dark:hover:border-yellow-400 transition-all duration-200 group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold text-blue-700 dark:text-yellow-300 mb-2 group-hover:text-blue-900 dark:group-hover:text-yellow-100 transition flex flex-col gap-1">
                  <span className="arabic-text text-3xl leading-snug">{s.name}</span>
                  <span className="block text-base text-gray-500 dark:text-gray-300 font-normal font-sans">
                    {s.englishName}
                  </span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{s.ayahCount} :سورتون</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-400 text-lg font-medium mt-10">
            No chapters found.
          </p>
        )}
      </div>
    </div></>
  );
}
