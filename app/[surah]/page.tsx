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
  const { surah } = params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/surah/${surah}`
    );
    const data: SurahApiResponse = await res.json();

    if ('error' in data) {
      return (
        <p className="p-6 text-red-500 text-center text-lg font-semibold">
          Error: {data.error}
        </p>
      );
    }

    return (
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-4 text-center">
          {data.data.name}
          <span className="text-lg text-gray-500 font-normal block">
            {data.data.englishName || data.data.englishNameTranslation || ''}
          </span>
        </h1>

        {data.data.ayahs.map((ayah) => (
          <div
            key={ayah.numberInSurah}
            className="border border-gray-200 rounded-xl shadow bg-white p-6 mb-4 hover:shadow-lg transition"
          >
            <p className="text-right font-semibold text-2xl text-gray-800 mb-2">
              {ayah.text}
            </p>
            <p className="mt-2 text-base text-blue-700 flex items-center gap-2">
              <span role="img" aria-label="book">📘</span>
              {ayah.translation || ''}
            </p>
          </div>
        ))}
      </div>
    );
  } catch {
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