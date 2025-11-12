// app/juz/[id]/page.tsx
import Link from 'next/link';

interface Verse {
  verseKey: string;
  verseNumber: number;
  text: string;
  translation?: string;
}

interface JuzData {
  number: number;
  nameArabic: string;
  verses: Verse[];
}

type JuzApiResponse = { data: JuzData } | { error: string };

export default async function JuzDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/juz/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error:", res.status, errorText);
      return (
        <p className="p-6 text-red-500 text-center text-lg font-semibold">
          Error: {res.status} - {errorText}
        </p>
      );
    }

    const data: JuzApiResponse = await res.json();

    if ('error' in data) {
      return (
        <p className="p-6 text-red-500 text-center text-lg font-semibold">
          Error: {data.error}
        </p>
      );
    }

    const juzData = data.data;

    // Get Sindhi name for the Juz
    const sindhiNames: { [key: number]: string } = {
      1: 'پهريون پارو', 2: 'ٻيون پارو', 3: 'ٽيون پارو', 4: 'چوٿون پارو', 5: 'پنجون پارو',
      6: 'ڇهون پارو', 7: 'ستون پارو', 8: 'اٺون پارو', 9: 'نائون پارو', 10: 'ڏهون پارو',
      11: 'يارهون پارو', 12: 'ٻارهون پارو', 13: 'تيرهون پارو', 14: 'چوڏهون پارو', 15: 'پندرهون پارو',
      16: 'سورهون پارو', 17: 'ستارهون پارو', 18: 'ارڙهون پارو', 19: 'اڻويهون پارو', 20: 'ويهون پارو',
      21: 'ايڪويهون پارو', 22: 'ٻاويهون پارو', 23: 'ٽيويهون پارو', 24: 'چوويهون پارو', 25: 'پنجويهون پارو',
      26: 'ڇهويهون پارو', 27: 'ستويهون پارو', 28: 'اٺويهون پارو', 29: 'اڻتيهون پارو', 30: 'ٽيهون پارو',
    };

    return (
      <div
        className="relative min-h-screen bg-center bg-cover py-10 px-4 sm:px-6"
        style={{
          backgroundImage: "linear-gradient(to bottom right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/background.jpg')",
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-2xl text-gray-800 dark:text-gray-100 space-y-10" dir="rtl">

          {/* Header */}
          <div className="text-center">
            <div className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-yellow-300 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              پارو {juzData.number}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-yellow-600 to-orange-500 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.5)] dark:from-yellow-300 dark:via-yellow-500 dark:to-yellow-100 mb-2 sindhi-text-nobackground">
              {sindhiNames[juzData.number]}
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300 arabic-text">
              {juzData.nameArabic}
            </p>
          </div>

          {/* Verses */}
          <div className="!space-y-10">
            {juzData.verses.map((verse, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow transition hover:shadow-lg"
              >
                {/* Verse Key (Surah:Ayah) */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-semibold">
                    {verse.verseKey}
                  </span>
                </div>

                {/* Arabic Text */}
                <p className="arabic-text-ayat leading-relaxed font-bold tracking-wide text-blue-900 dark:text-yellow-200 text-right mb-3">
                  {verse.text}
                </p>

                {/* Sindhi Translation */}
                {verse.translation && (
                  <p className="sindhi-text font-medium text-gray-700 dark:bg-gray-800 dark:text-blue-200 mt-2 text-right">
                    {verse.translation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/juz"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-lg text-base sm:text-lg font-semibold transition"
            >
              ← پارن ڏانھن واپس
            </Link>
            <Link
              href="/"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-base sm:text-lg font-semibold transition"
            >
              ← گھر واپس وڃو
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    console.error("Fetch failed:", e);
    return (
      <p className="p-6 text-red-500 text-center text-lg font-semibold">
        Failed to fetch Juz data.
      </p>
    );
  }
}

export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
  }));
}
