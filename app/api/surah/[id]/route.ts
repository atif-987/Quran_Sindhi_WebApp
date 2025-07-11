// app/api/surah/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const url = `https://api.alquran.cloud/v1/surah/${id}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch surah');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  
}
