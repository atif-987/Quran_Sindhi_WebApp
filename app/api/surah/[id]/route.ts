// app/api/surah/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface Translation {
  text: string;
}

interface Verse {
  verse_number: number;
  text_uthmani?: string;
  translations?: Translation[];
}

interface ChapterInfo {
  chapter: {
    name_arabic: string;
  };
}

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const versesUrl = `https://api.quran.com/api/v4/verses/by_chapter/${id}` +
    `?translations=238&text_type=uthmani&language=ar` +
    `&fields=verse_key,verse_number,text_uthmani,translations&per_page=300`;

  const chapterUrl = `https://api.quran.com/api/v4/chapters/${id}?language=ar`;

  try {
    const [versesRes, chapterRes] = await Promise.all([
      fetch(versesUrl),
      fetch(chapterUrl),
    ]);

    if (!versesRes.ok || !chapterRes.ok) throw new Error('Failed to fetch data');

    const { verses }: { verses: Verse[] } = await versesRes.json();
    const chapterInfo: ChapterInfo = await chapterRes.json();

    const surahData = {
      name: `سورة ${chapterInfo.chapter.name_arabic}`, // ✅ Arabic Surah title like "سورة الفاتحة"
      ayahs: verses.map((v) => ({
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
