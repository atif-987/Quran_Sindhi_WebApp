import { NextResponse } from 'next/server';

// Public Hadith API source (Arabic text)
const SOURCE_BASE = 'https://api.hadith.gading.dev';

export async function GET() {
  try {
    const res = await fetch(`${SOURCE_BASE}/books`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch hadith collections' }, { status: 500 });
    }
    const data = await res.json();
    // Normalize (keep API's slug id and readable name)
    const collections = (data?.data || []).map((b: any) => ({
      id: b?.id,
      name: b?.name,
      available: b?.available,
    }));
    return NextResponse.json({ collections });
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error fetching collections' }, { status: 500 });
  }
}


