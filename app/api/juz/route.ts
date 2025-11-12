import { NextResponse } from 'next/server';

// Juz information with starting and ending Surah details
const juzInfo = [
  { number: 1, nameArabic: 'الجُزْءُ الْأَوَّلُ', nameSindhi: 'پهريون پارو', startSurah: 1, endSurah: 2, startVerse: 1, endVerse: 141 },
  { number: 2, nameArabic: 'الجُزْءُ الثَّانِي', nameSindhi: 'ٻيون پارو', startSurah: 2, endSurah: 2, startVerse: 142, endVerse: 252 },
  { number: 3, nameArabic: 'الجُزْءُ الثَّالِثُ', nameSindhi: 'ٽيون پارو', startSurah: 2, endSurah: 3, startVerse: 253, endVerse: 92 },
  { number: 4, nameArabic: 'الجُزْءُ الرَّابِعُ', nameSindhi: 'چوٿون پارو', startSurah: 3, endSurah: 4, startVerse: 93, endVerse: 23 },
  { number: 5, nameArabic: 'الجُزْءُ الْخَامِسُ', nameSindhi: 'پنجون پارو', startSurah: 4, endSurah: 4, startVerse: 24, endVerse: 147 },
  { number: 6, nameArabic: 'الجُزْءُ السَّادِسُ', nameSindhi: 'ڇهون پارو', startSurah: 4, endSurah: 5, startVerse: 148, endVerse: 81 },
  { number: 7, nameArabic: 'الجُزْءُ السَّابِعُ', nameSindhi: 'ستون پارو', startSurah: 5, endSurah: 6, startVerse: 82, endVerse: 110 },
  { number: 8, nameArabic: 'الجُزْءُ الثَّامِنُ', nameSindhi: 'اٺون پارو', startSurah: 6, endSurah: 7, startVerse: 111, endVerse: 87 },
  { number: 9, nameArabic: 'الجُزْءُ التَّاسِعُ', nameSindhi: 'نائون پارو', startSurah: 7, endSurah: 8, startVerse: 88, endVerse: 40 },
  { number: 10, nameArabic: 'الجُزْءُ الْعَاشِرُ', nameSindhi: 'ڏهون پارو', startSurah: 8, endSurah: 9, startVerse: 41, endVerse: 92 },
  { number: 11, nameArabic: 'الجُزْءُ الْحَادِي عَشَرَ', nameSindhi: 'يارهون پارو', startSurah: 9, endSurah: 11, startVerse: 93, endVerse: 5 },
  { number: 12, nameArabic: 'الجُزْءُ الثَّانِي عَشَرَ', nameSindhi: 'ٻارهون پارو', startSurah: 11, endSurah: 12, startVerse: 6, endVerse: 52 },
  { number: 13, nameArabic: 'الجُزْءُ الثَّالِثَ عَشَرَ', nameSindhi: 'تيرهون پارو', startSurah: 12, endSurah: 14, startVerse: 53, endVerse: 52 },
  { number: 14, nameArabic: 'الجُزْءُ الرَّابِعَ عَشَرَ', nameSindhi: 'چوڏهون پارو', startSurah: 15, endSurah: 16, startVerse: 1, endVerse: 128 },
  { number: 15, nameArabic: 'الجُزْءُ الْخَامِسَ عَشَرَ', nameSindhi: 'پندرهون پارو', startSurah: 17, endSurah: 18, startVerse: 1, endVerse: 74 },
  { number: 16, nameArabic: 'الجُزْءُ السَّادِسَ عَشَرَ', nameSindhi: 'سورهون پارو', startSurah: 18, endSurah: 20, startVerse: 75, endVerse: 135 },
  { number: 17, nameArabic: 'الجُزْءُ السَّابِعَ عَشَرَ', nameSindhi: 'ستارهون پارو', startSurah: 21, endSurah: 22, startVerse: 1, endVerse: 78 },
  { number: 18, nameArabic: 'الجُزْءُ الثَّامِنَ عَشَرَ', nameSindhi: 'ارڙهون پارو', startSurah: 23, endSurah: 25, startVerse: 1, endVerse: 20 },
  { number: 19, nameArabic: 'الجُزْءُ التَّاسِعَ عَشَرَ', nameSindhi: 'اڻويهون پارو', startSurah: 25, endSurah: 27, startVerse: 21, endVerse: 55 },
  { number: 20, nameArabic: 'الجُزْءُ الْعِشْرُونَ', nameSindhi: 'ويهون پارو', startSurah: 27, endSurah: 29, startVerse: 56, endVerse: 45 },
  { number: 21, nameArabic: 'الجُزْءُ الْحَادِي وَالْعِشْرُونَ', nameSindhi: 'ايڪويهون پارو', startSurah: 29, endSurah: 33, startVerse: 46, endVerse: 30 },
  { number: 22, nameArabic: 'الجُزْءُ الثَّانِي وَالْعِشْرُونَ', nameSindhi: 'ٻاويهون پارو', startSurah: 33, endSurah: 36, startVerse: 31, endVerse: 27 },
  { number: 23, nameArabic: 'الجُزْءُ الثَّالِثُ وَالْعِشْرُونَ', nameSindhi: 'ٽيويهون پارو', startSurah: 36, endSurah: 39, startVerse: 28, endVerse: 31 },
  { number: 24, nameArabic: 'الجُزْءُ الرَّابِعُ وَالْعِشْرُونَ', nameSindhi: 'چوويهون پارو', startSurah: 39, endSurah: 41, startVerse: 32, endVerse: 46 },
  { number: 25, nameArabic: 'الجُزْءُ الْخَامِسُ وَالْعِشْرُونَ', nameSindhi: 'پنجويهون پارو', startSurah: 41, endSurah: 45, startVerse: 47, endVerse: 37 },
  { number: 26, nameArabic: 'الجُزْءُ السَّادِسُ وَالْعِشْرُونَ', nameSindhi: 'ڇهويهون پارو', startSurah: 46, endSurah: 51, startVerse: 1, endVerse: 30 },
  { number: 27, nameArabic: 'الجُزْءُ السَّابِعُ وَالْعِشْرُونَ', nameSindhi: 'ستويهون پارو', startSurah: 51, endSurah: 57, startVerse: 31, endVerse: 29 },
  { number: 28, nameArabic: 'الجُزْءُ الثَّامِنُ وَالْعِشْرُونَ', nameSindhi: 'اٺويهون پارو', startSurah: 58, endSurah: 66, startVerse: 1, endVerse: 12 },
  { number: 29, nameArabic: 'الجُزْءُ التَّاسِعُ وَالْعِشْرُونَ', nameSindhi: 'اڻتيهون پارو', startSurah: 67, endSurah: 77, startVerse: 1, endVerse: 50 },
  { number: 30, nameArabic: 'الجُزْءُ الثَّلَاثُونَ', nameSindhi: 'ٽيهون پارو', startSurah: 78, endSurah: 114, startVerse: 1, endVerse: 6 },
];

export async function GET() {
  try {
    return NextResponse.json({ juz: juzInfo });
  } catch (error) {
    console.error('Error fetching Juz list:', error);
    return NextResponse.json({ error: 'Failed to fetch Juz list' }, { status: 500 });
  }
}
