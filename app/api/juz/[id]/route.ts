import { NextRequest, NextResponse } from 'next/server';

interface Translation {
  text: string;
}

interface Verse {
  verse_key: string;
  verse_number: number;
  text_uthmani?: string;
  translations?: Translation[];
}

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  // Validate Juz number (1-30)
  const juzNumber = parseInt(id);
  if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30) {
    return NextResponse.json({ error: 'Invalid Juz number. Must be between 1 and 30.' }, { status: 400 });
  }

  const juzUrl = `https://api.quran.com/api/v4/verses/by_juz/${id}` +
    `?translations=238&text_type=uthmani&language=ar` +
    `&fields=verse_key,verse_number,text_uthmani,translations&per_page=300`;

  try {
    const juzRes = await fetch(juzUrl);

    if (!juzRes.ok) throw new Error('Failed to fetch Juz data');

    const { verses }: { verses: Verse[] } = await juzRes.json();

    const juzData = {
      number: juzNumber,
      nameArabic: `الجُزْءُ ${getArabicNumber(juzNumber)}`,
      verses: verses.map((v) => ({
        verseKey: v.verse_key,
        verseNumber: v.verse_number,
        text: v.text_uthmani ?? '',
        translation: v.translations?.[0]?.text ?? '',
      })),
    };

    return NextResponse.json({ data: juzData });
  } catch (err) {
    console.error('Error fetching Juz:', err);
    return NextResponse.json({ error: 'Failed to fetch Juz data' }, { status: 500 });
  }
}

// Helper function to get Arabic number names
function getArabicNumber(num: number): string {
  const arabicNumbers: { [key: number]: string } = {
    1: 'الْأَوَّلُ',
    2: 'الثَّانِي',
    3: 'الثَّالِثُ',
    4: 'الرَّابِعُ',
    5: 'الْخَامِسُ',
    6: 'السَّادِسُ',
    7: 'السَّابِعُ',
    8: 'الثَّامِنُ',
    9: 'التَّاسِعُ',
    10: 'الْعَاشِرُ',
    11: 'الْحَادِي عَشَرَ',
    12: 'الثَّانِي عَشَرَ',
    13: 'الثَّالِثَ عَشَرَ',
    14: 'الرَّابِعَ عَشَرَ',
    15: 'الْخَامِسَ عَشَرَ',
    16: 'السَّادِسَ عَشَرَ',
    17: 'السَّابِعَ عَشَرَ',
    18: 'الثَّامِنَ عَشَرَ',
    19: 'التَّاسِعَ عَشَرَ',
    20: 'الْعِشْرُونَ',
    21: 'الْحَادِي وَالْعِشْرُونَ',
    22: 'الثَّانِي وَالْعِشْرُونَ',
    23: 'الثَّالِثُ وَالْعِشْرُونَ',
    24: 'الرَّابِعُ وَالْعِشْرُونَ',
    25: 'الْخَامِسُ وَالْعِشْرُونَ',
    26: 'السَّادِسُ وَالْعِشْرُونَ',
    27: 'السَّابِعُ وَالْعِشْرُونَ',
    28: 'الثَّامِنُ وَالْعِشْرُونَ',
    29: 'التَّاسِعُ وَالْعِشْرُونَ',
    30: 'الثَّلَاثُونَ',
  };
  return arabicNumbers[num] || '';
}
