'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
type Chapter = {
  chapter: number;
  englishName: string;
  name: string;
  ayahCount: number;
};

type Juz = {
  number: number;
  nameArabic: string;
  nameSindhi: string;
  startSurah: number;
  endSurah: number;
};

export default function Home() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [juzList, setJuzList] = useState<Juz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRead, setLastRead] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chaptersRes, juzRes] = await Promise.all([
          fetch('/api/chapters', { cache: 'no-store' }),
          fetch('/api/juz', { cache: 'no-store' })
        ]);
        
        const chaptersData = await chaptersRes.json();
        const juzData = await juzRes.json();
        
        if (chaptersRes.ok) {
          setChapters(chaptersData.chapters || chaptersData);
        } else {
          setChapters([]);
        }

        if (juzRes.ok) {
          setJuzList(juzData.juz || []);
        } else {
          setJuzList([]);
        }
      } catch (err) {
        console.error('Error:', err);
        setChapters([]);
        setJuzList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setLastRead(Number(localStorage.getItem('lastReadSurah')) || null);
  }, []);

  const filteredChapters = chapters.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJuz = juzList.filter((j) =>
    j.nameSindhi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.nameArabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.number.toString().includes(searchTerm)
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
            <h1 className="!text-center xl:text-8xl sm:!text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 dark:from-yellow-300 dark:to-yellow-500 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.2)] dark:drop-shadow-[2px_2px_3px_rgba(0,0,0,0.5)] sindhi-text-nobackground">
              قرآن سنڌي ترجمو
            </h1>
          </div>

          {/* Search */}
          <div className="flex justify-center">
  <div className="relative w-full max-w-md">
    <input
      type="text"
      dir="rtl"
      className="w-full pr-10 pl-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white shadow-md text-right placeholder-gray-900 dark:placeholder-gray-300 text-lg placeholder:text-lg placeholder:font-large"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="سورت، آيت يا لفظ ڳوليو..."
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
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
                <span className="sindhi-text-nobackground font-semibold text-base dark:text-red-500">آخري پڙهيل سورت:</span>
                <Link href={`/${lastRead}`} className="arabic-text text-xl font-bold text-blue-700 dark:text-yellow-300 underline ml-2">
                  {lastReadSurah.name}
                </Link>
              </div>
            );
          })()}

          {/* Tabs */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setActiveTab('surah')}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                activeTab === 'surah'
                  ? 'bg-blue-600 dark:bg-yellow-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              سورتون
            </button>
            <button
              onClick={() => setActiveTab('juz')}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                activeTab === 'juz'
                  ? 'bg-blue-600 dark:bg-yellow-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              پارا
            </button>
          </div>

          {/* Section Title */}
          <h2 className="text-center text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-100 mt-4">
            {activeTab === 'surah' ? 'سورتن جي فهرست' : 'پارن جي فهرست'}
          </h2>

          {/* Content Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 animate-pulse h-32 rounded-xl"></div>
              ))}
            </div>
          ) : activeTab === 'surah' ? (
            filteredChapters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-right" dir="rtl">
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
            )
          ) : (
            filteredJuz.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-right" dir="rtl">
                {filteredJuz.map((j) => (
                  <Link
                    key={j.number}
                    href={`/juz/${j.number}`}
                    className="block transition transform hover:-translate-y-1 hover:shadow-lg active:scale-95 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-5xl font-bold text-blue-700 dark:text-yellow-300">
                        {j.number}
                      </span>
                      <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-yellow-300 rounded-full font-semibold">
                        پارو
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      <span className="sindhi-text-nobackground block text-2xl leading-snug">
                        {j.nameSindhi}
                      </span>
                      <span className="arabic-text block text-lg text-gray-500 dark:text-gray-300 font-normal mt-1">
                        {j.nameArabic}
                      </span>
                    </h2>
                    {/* <p className="text-sm text-gray-600 dark:text-gray-400 flex flex-row-reverse items-center justify-end gap-1 text-right">
                      <span>سورت {j.startSurah}</span>
                      <span>-</span>
                      <span>{j.endSurah}</span>
                    </p> */}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-red-400 text-lg font-medium mt-10">
                No Juz found.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
