import { NextResponse } from 'next/server';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  ayahs: unknown[];
}

export async function GET() {
  try {
    const res = await fetch('http://api.alquran.cloud/v1/quran/en.asad', {
      cache: 'no-store',
    });

    const json = await res.json();

    if (!res.ok || !json.data) {
      throw new Error('Failed to fetch data');
    }
    console.log("First surah object:", json.data.surahs[0]);  
      const surahs = json.data.surahs.map((surah: Surah) => ({
      chapter: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      ayahCount: surah.ayahs.length,
    }));
    console.log("surahs", surahs);  

    return NextResponse.json(surahs);
  } catch (error) {
    console.error(error); // optional
    return NextResponse.json({ error: 'Failed to fetch Surah list' }, { status: 500 });
  }
}
