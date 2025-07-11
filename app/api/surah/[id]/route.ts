// app/api/surah/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${id}` +
    `?translations=238&text_type=uthmani&language=ar` +
    `&fields=verse_key,verse_number,text_uthmani,translations&per_page=300`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch surah');

    const { verses } = await res.json();

    const surahData = {
      name: `Surah ${id}`,
      ayahs: verses.map((v: any) => ({
        numberInSurah: v.verse_number,
        text: v.text_uthmani ?? '',
        translation: v.translations?.[0]?.text ?? '',
      })),
    };

    return NextResponse.json({ data: surahData });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 404 });
  }

}
