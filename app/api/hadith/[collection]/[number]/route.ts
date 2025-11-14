// app/api/hadith/[collection]/[number]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Hadith API - ahadith.co.uk has comprehensive hadith database
const HADITH_API_BASE = "https://ahadith.co.uk/api";

// Collection name mapping
const COLLECTION_MAP: Record<string, string> = {
  'bukhari': 'bukhari',
  'muslim': 'muslim',
  'tirmidhi': 'tirmidhi',
  'abudawud': 'abu-dawood',
  'nasai': 'nasai',
  'ibnmajah': 'ibn-majah',
  'malik': 'malik',
  'ahmad': 'ahmad'
};

function sanitizeSindhiText(input: string): string {
  let s = input || "";
  s = s.replace(/[\u0900-\u097F]+/g, "");
  s = s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  s = s.replace(/(\b\S+)(?:\s+\1){3,}/g, "$1 $1");
  s = s.replace(/[،,.!؟]{2,}/g, (m) => m[0]);
  s = s.replace(/\s{2,}/g, " ");
  return s.trim();
}

// Direct Urdu to Sindhi translation using Google Translate API
async function translateUrduToSindhi(urduText: string): Promise<string | null> {
  try {
    if (!urduText) return null;
    
    const MAX_LENGTH = 500;
    
    // Helper to split text into chunks
    const splitIntoChunks = (input: string): string[] => {
      if (input.length <= MAX_LENGTH) return [input];
      
      // Split by sentences (Urdu/Arabic punctuation)
      const sentences = input.match(/[^۔.!?]+[۔.!?]+/g) || [input];
      const chunks: string[] = [];
      let current = '';
      
      for (const sentence of sentences) {
        if ((current + sentence).length > MAX_LENGTH) {
          if (current) chunks.push(current.trim());
          current = sentence;
        } else {
          current += sentence;
        }
      }
      if (current) chunks.push(current.trim());
      return chunks;
    };

    const sindhiChunks: string[] = [];
    
    for (const chunk of splitIntoChunks(urduText)) {
      try {
        // Try Google Translate first (better for Urdu→Sindhi)
        const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ur&tl=sd&dt=t&q=${encodeURIComponent(chunk)}`;
        const googleRes = await fetch(googleUrl, { cache: "no-store" });
        
        if (googleRes.ok) {
          const data = await googleRes.json();
          if (Array.isArray(data) && Array.isArray(data[0])) {
            const translated = data[0].map((item: string[]) => item[0]).join('');
            if (translated) {
              sindhiChunks.push(sanitizeSindhiText(translated));
              await new Promise(resolve => setTimeout(resolve, 100));
              continue;
            }
          }
        }
        
        // Fallback to MyMemory
        const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=ur|sd`;
        const mmRes = await fetch(myMemoryUrl, { cache: "no-store" });
        
        if (mmRes.ok) {
          const data = await mmRes.json();
          const translated = data?.responseData?.translatedText || "";
          if (translated) {
            sindhiChunks.push(sanitizeSindhiText(translated));
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        console.error("Chunk translation error:", err);
        // Continue with other chunks
      }
    }

    return sindhiChunks.join(" ").trim() || null;
  } catch (err) {
    console.error("Urdu to Sindhi translation error:", err);
    return null;
  }
}



// Fetch from ahadith.co.uk API - comprehensive hadith database
async function fetchFromAhadithAPI(collection: string, number: string): Promise<{
  arabic: string | null;
  urdu: string | null;
} | null> {
  try {
    const collectionName = COLLECTION_MAP[collection.toLowerCase()] || collection;
    const url = `${HADITH_API_BASE}/${collectionName}/${number}?lang=ara,urd`;
    
    const res = await fetch(url, { cache: 'no-store' });

    if (res.ok) {
      const data = await res.json();
      const hadith = data?.data;
      
      if (hadith) {
        // Get Arabic text
        const arabic = hadith?.hadith_arabic || hadith?.text_arabic || null;
        
        // Get Urdu text (we'll translate this to Sindhi)
        const urdu = hadith?.hadith_urdu || hadith?.text_urdu || null;
        
        return { arabic, urdu };
      }
    }
  } catch (err) {
    console.error("Ahadith API error:", err);
  }
  
  return null;
}

// Fallback to hadith.gading.dev
async function fetchFromGadingAPI(collection: string, number: string): Promise<{
  arabic: string | null;
  urdu: string | null;
} | null> {
  try {
    const res = await fetch(`https://api.hadith.gading.dev/books/${collection}/${number}`, {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const data = await res.json();
      const contents = data?.data?.contents;
      
      return {
        arabic: contents?.arab || null,
        urdu: null // Gading doesn't have Urdu
      };
    }
  } catch (err) {
    console.error("Gading API error:", err);
  }
  
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { collection: string; number: string } }
) {
  try {
    const { collection, number } = params;
    
    let source: 'ahadith.co.uk' | 'gading.dev' | 'translated' = 'ahadith.co.uk';
    
    // 1. Fetch from ahadith.co.uk (has Arabic + Urdu)
    let hadithData = await fetchFromAhadithAPI(collection, number);
    
    // 2. Fallback to gading.dev (Arabic only)
    if (!hadithData?.arabic) {
      hadithData = await fetchFromGadingAPI(collection, number);
      source = 'gading.dev';
    }
    
    if (!hadithData) {
      return NextResponse.json(
        { error: "Hadith not found" },
        { status: 404 }
      );
    }

    // 3. Translate Urdu to Sindhi (if we have Urdu)
    let sindhiText: string | null = null;
    
    if (hadithData.urdu) {
      // Direct Urdu → Sindhi translation (better quality)
      sindhiText = await translateUrduToSindhi(hadithData.urdu);
      source = 'translated';
    }

    return NextResponse.json(
      {
        collection,
        number,
        arabic: hadithData.arabic,
        sindhi: sindhiText || null,
        meta: { 
          source,
          note: source === 'ahadith.co.uk'
            ? 'تصديق ٿيل ذريعو'
            : source === 'translated'
            ? 'اردو مان ترجمو'
            : 'عربي متن'
        },
      },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch (error) {
    console.error("Hadith fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Hadith" },
      { status: 500 }
    );
  }
}
