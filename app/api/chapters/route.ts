import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://api.alquran.cloud/v1/quran/en.asad', {
      cache: 'no-store', // ⛔ Prevent Next.js from trying to cache large response
    });

    const json = await res.json();

    if (!res.ok || !json.data) {
      throw new Error('Failed to fetch data');
    }

    const surahs = json.data.surahs.map((surah: any) => ({
      chapter: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      ayahCount: surah.numberOfAyahs,
    }));

    return NextResponse.json(surahs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Surah list' }, { status: 500 });
  }
}
