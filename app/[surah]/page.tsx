// app/[surah]/page.tsx
import Link from 'next/link';

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface SurahData {
  name: string;
  englishName?: string;
  englishNameTranslation?: string;
  ayahs: Ayah[];
}

type SurahApiResponse = { data: SurahData } | { error: string };

export default async function SurahPage({
  params,
}: {
  params: { surah: string };
}) {
  const { surah } = params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/surah/${surah}`, { cache: 'no-store' });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error:", res.status, errorText);
      return (
        <p className="p-6 text-red-500 text-center text-lg font-semibold">
          Error: {res.status} - {errorText}
        </p>
      );
    }

    const data: SurahApiResponse = await res.json();

    if ('error' in data) {
      return (
        <p className="p-6 text-red-500 text-center text-lg font-semibold">
          Error: {data.error}
        </p>
      );
    }

    const surahData = data.data;

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-yellow-600 to-orange-500 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.5)] dark:from-yellow-300 dark:via-yellow-500 dark:to-yellow-100 mb-2 arabic-text">
              {surahData.name}
            </h1>
            {(surahData.englishName || surahData.englishNameTranslation) && (
              <p className="text-base sm:text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300">
                {surahData.englishName || surahData.englishNameTranslation}
              </p>
            )}
          </div>

          {/* Ayahs */}
          <div className="!space-y-10">
            {surahData.ayahs.map((ayah) => (
              <div
                key={ayah.numberInSurah}
                className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow transition hover:shadow-lg"
              >
                <p className="arabic-text-ayat leading-relaxed font-bold tracking-wide text-blue-900 dark:text-yellow-200 text-right mb-3">
                  {ayah.text}
                </p>

                {ayah.translation && (
                  <p className="sindhi-text font-medium text-gray-700 dark:bg-gray-800 dark:text-blue-200 mt-2 text-right">
                    {ayah.translation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center pt-6">
            <Link
              href="/"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base sm:text-lg font-semibold transition"
            >
              ← واپس وڃو
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    console.error("Fetch failed:", e);
    return (
      <p className="p-6 text-red-500 text-center text-lg font-semibold">
        Failed to fetch surah data.
      </p>
    );
  }
}

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    surah: String(i + 1),
  }));
}
