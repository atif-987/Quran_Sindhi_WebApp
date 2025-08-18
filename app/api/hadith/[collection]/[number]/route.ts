import { NextRequest, NextResponse } from 'next/server';

const SOURCE_BASE = 'https://api.hadith.gading.dev'; // Arabic hadith text

async function translateToSindhi(text: string): Promise<string | null> {
  try {
    // LibreTranslate public instance (rate-limited; replace with your own if needed)
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: text, source: 'ar', target: 'sd', format: 'text' }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.translatedText || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest, { params }: { params: { collection: string; number: string } }) {
  const { collection, number } = params;
  const url = new URL(req.url);
  const shouldTranslate = url.searchParams.get('translate') !== '0' && url.searchParams.get('noTranslate') !== '1';
  if (!collection || !number) {
    return NextResponse.json({ error: 'Missing collection or number' }, { status: 400 });
  }

  try {
    // Encode collection safely and request a range slice for a single hadith
    const encodedCollection = encodeURIComponent(collection);
    const encodedNumber = encodeURIComponent(number);
    const url = `${SOURCE_BASE}/books/${encodedCollection}?range=${encodedNumber}-${encodedNumber}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json({ error: 'Failed to fetch hadith', upstream: text }, { status: 502 });
    }
    const data = await res.json();
    // gading.dev shape: { data: { hadiths: [ { arab, number, ... } ] } }
    const hadithArray = data?.data?.hadiths || [];
    const first = Array.isArray(hadithArray) ? hadithArray[0] : null;
    const arabic: string | undefined = first?.arab;

    let sindhi: string | null = null;
    if (arabic && shouldTranslate) {
      sindhi = await translateToSindhi(arabic);
    }

    return NextResponse.json({
      collection,
      number,
      arabic: arabic || null,
      sindhi: sindhi,
      meta: {
        source: 'api.hadith.gading.dev + libretranslate.de',
        note: 'Translations are automated and may contain inaccuracies.'
      }
    });
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error fetching hadith' }, { status: 500 });
  }
}


