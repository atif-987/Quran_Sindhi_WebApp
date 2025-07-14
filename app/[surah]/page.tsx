// app/[surah]/page.tsx

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

// ✅ Use a named function with inline typing
export default async function SurahPage({
  params,
}: {
  params: { surah: string };
}) {
  debugger
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

    return (
      <div className="max-w-3xl mx-auto p-6 space-y-8 bg-white dark:bg-gray-900 rounded-2xl">
        <h1 className="text-3xl font-extrabold text-blue-800 dark:text-yellow-400 mb-4 text-center">
          {data.data.name}
          <span className="text-lg text-gray-500 dark:text-gray-300 font-normal block">
            {data.data.englishName || data.data.englishNameTranslation || ''}
          </span>
        </h1>

        {data.data.ayahs.map((ayah) => (
          <div
            key={ayah.numberInSurah}
            className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg transition"
          >
            <p className="arabic-text font-semibold mb-2 text-gray-900 dark:text-yellow-100">
              {ayah.text}
            </p>
            {ayah.translation && (
              <>
                <div className="translation-label dark:text-gray-400">Sindhi Translation</div>
                <p className="sindhi-text dark:text-green-200 dark:bg-gray-900">{ayah.translation}</p>
              </>
            )}
          </div>
        ))}
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

// ✅ Static params for prerendering
export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    surah: String(i + 1),
  }));
}