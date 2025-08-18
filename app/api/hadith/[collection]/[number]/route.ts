import { NextRequest, NextResponse } from 'next/server';

const SOURCE_BASE = 'https://api.hadith.gading.dev'; // Arabic hadith text

type TranslationResult = { text: string; provider: string } | null;

async function translateWithGoogle(text: string): Promise<TranslationResult> {
  try {
    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=sd&dt=t&q=' +
      encodeURIComponent(text);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    // data[0] is an array of [ translatedText, sourceText, ... ] segments
    const translated = Array.isArray(data) && Array.isArray(data[0])
      ? data[0].map((seg: any[]) => seg?.[0]).join('')
      : null;
    if (!translated) return null;
    return { text: translated, provider: 'google-gtx' };
  } catch {
    return null;
  }
}

async function translateWithMyMemory(text: string): Promise<TranslationResult> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|sd`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const translated = data?.responseData?.translatedText as string | undefined;
    if (!translated) return null;
    return { text: translated, provider: 'mymemory' };
  } catch {
    return null;
  }
}

async function translateWithLibreTranslate(text: string): Promise<TranslationResult> {
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'ar', target: 'sd', format: 'text' }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const translated: string | undefined = data?.translatedText;
    if (!translated) return null;
    return { text: translated, provider: 'libretranslate' };
  } catch {
    return null;
  }
}

async function translateWithOpenAI(text: string): Promise<TranslationResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional translator specialized in Classical Arabic → Sindhi (Arabic script). Translate hadith text faithfully into natural, formal Sindhi. Keep Islamic terms, avoid transliteration, and do not add commentary. Output only the Sindhi translation.'
          },
          { role: 'user', content: text },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const translated = data?.choices?.[0]?.message?.content?.trim();
    if (!translated) return null;
    return { text: translated, provider: 'openai-gpt-4o-mini' };
  } catch {
    return null;
  }
}

function postProcessSindhi(text: string): string {
  let out = text;
  // Normalize spacing around Arabic punctuation used in Sindhi
  out = out.replace(/\s+([،؛۔!؟])/g, '$1');
  out = out.replace(/([،؛۔!؟])(?=\S)/g, '$1 ');
  out = out.replace(/\s{2,}/g, ' ').trim();
  return out;
}

async function translateToSindhi(text: string, preferred?: string | null): Promise<TranslationResult> {
  // Try multiple providers in order; allow forcing a provider via query param
  const providers: Array<[string, (t: string) => Promise<TranslationResult>]> = [
    ['openai', translateWithOpenAI],
    ['google-gtx', translateWithGoogle],
    ['mymemory', translateWithMyMemory],
    ['libretranslate', translateWithLibreTranslate],
  ];

  const queue = preferred
    ? [
        ...providers.filter(([name]) => name === preferred),
        ...providers.filter(([name]) => name !== preferred),
      ]
    : providers;

  for (const [name, provider] of queue) {
    const result = await provider(text);
    // eslint-disable-next-line no-console
    console.log(`${name} result:`, result ? 'ok' : 'null');
    if (result && result.text) {
      return { text: postProcessSindhi(result.text), provider: result.provider };
    }
  }
  return null;
}

export async function GET(req: NextRequest, { params }: { params: { collection: string; number: string } }) {
  const { collection, number } = params;
  const url = new URL(req.url);
  const shouldTranslate = url.searchParams.get('translate') !== '0' && url.searchParams.get('noTranslate') !== '1';
  const preferredProvider = url.searchParams.get('provider');
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
    let providerUsed: string | undefined = undefined;
    if (arabic && shouldTranslate) {
      const translated = await translateToSindhi(arabic, preferredProvider);
      sindhi = translated?.text || null;
      providerUsed = translated?.provider;
    }

    return NextResponse.json({
      collection,
      number,
      arabic: arabic || null,
      sindhi: sindhi,
      meta: {
        source: 'api.hadith.gading.dev',
        translationProvider: providerUsed || null,
        note: 'Translations are automated and may contain inaccuracies.'
      }
    });
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error fetching hadith' }, { status: 500 });
  }
}


