// app/api/hadith/[collection]/[number]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Sunnah.com API key for verified hadith
const SUNNAH_API_KEY = "ZwRlcGzZEn9KWcdAE9rmW6bUVLMxKiRw9VKjpbZf";

// Collection name mapping
const COLLECTION_MAP: Record<string, string> = {
  'bukhari': 'bukhari',
  'muslim': 'muslim',
  'tirmidhi': 'tirmidhi',
  'abudawud': 'abudawud',
  'nasai': 'nasai',
  'ibnmajah': 'ibnmajah',
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

// Translate via Urdu as intermediate language for better Sindhi quality
async function translateToSindhi(text: string): Promise<string | null> {
  try {
    if (!text) return null;
    
    const MAX_LENGTH = 400;
    
    // Helper to split text into chunks
    const splitIntoChunks = (input: string): string[] => {
      if (input.length <= MAX_LENGTH) return [input];
      
      const sentences = input.match(/[^.!?]+[.!?]+/g) || [input];
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

    // Step 1: English → Urdu (more reliable)
    const urduChunks: string[] = [];
    for (const chunk of splitIntoChunks(text)) {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|ur`;
        const res = await fetch(url, { cache: "no-store" });
        
        if (res.ok) {
          const data = await res.json();
          const urdu = data?.responseData?.translatedText || "";
          if (urdu) urduChunks.push(urdu);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch {
        urduChunks.push(chunk); // Fallback to original
      }
    }
    
    if (urduChunks.length === 0) return null;
    const urduText = urduChunks.join(" ");

    // Step 2: Urdu → Sindhi (better quality)
    const sindhiChunks: string[] = [];
    for (const chunk of splitIntoChunks(urduText)) {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=ur|sd`;
        const res = await fetch(url, { cache: "no-store" });
        
        if (res.ok) {
          const data = await res.json();
          const sindhi = data?.responseData?.translatedText || "";
          if (sindhi) sindhiChunks.push(sanitizeSindhiText(sindhi));
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch {
        // Skip failed chunks
      }
    }

    return sindhiChunks.join(" ").trim() || null;
  } catch (err) {
    console.error("Translation error:", err);
    return null;
  }
}



// Fetch from Sunnah.com API - verified source
async function fetchFromSunnahAPI(collection: string, number: string): Promise<{
  arabic: string | null;
  english: string | null;
} | null> {
  try {
    const collectionName = COLLECTION_MAP[collection.toLowerCase()] || collection;
    const url = `https://api.sunnah.com/v1/hadiths/${collectionName}/${number}`;
    
    const res = await fetch(url, {
      headers: { 'X-API-Key': SUNNAH_API_KEY },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      const hadith = data?.hadith;
      
      if (hadith) {
        return {
          arabic: hadith?.hadithArabic || hadith?.body || null,
          english: hadith?.hadithEnglish || hadith?.englishText || null
        };
      }
    }
  } catch (err) {
    console.error("Sunnah.com API error:", err);
  }
  
  return null;
}

// Fallback to hadith.gading.dev
async function fetchFromGadingAPI(collection: string, number: string): Promise<{
  arabic: string | null;
  english: string | null;
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
        english: contents?.id || null
      };
    }
  } catch (err) {
    console.error("Gading API error:", err);
  }
  
  return null;
}

// Check local Sindhi translations
async function getLocalSindhi(collection: string, number: string, req: NextRequest): Promise<string | null> {
  try {
    const url = new URL(req.url);
    const base = `${url.protocol}//${url.host}`;
    const localJsonUrl = `${base}/hadith/sindhi/${collection}.json`;
    
    const localRes = await fetch(localJsonUrl);
    if (localRes.ok) {
      const localData = await localRes.json();
      const items: Array<{ hadithnumber: string; text: string }> = localData?.hadiths || [];
      const matched = items.find((h) => String(h.hadithnumber) === String(number));
      
      if (matched?.text) {
        return matched.text;
      }
    }
  } catch {
    // Ignore
  }
  
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { collection: string; number: string } }
) {
  try {
    const { collection, number } = params;
    
    // 1. Try local Sindhi first (most accurate)
    let sindhiText = await getLocalSindhi(collection, number, req);
    let source: 'local' | 'sunnah.com' | 'machine:en-sd' | 'gading.dev' = 'local';
    
    // 2. Fetch from Sunnah.com (verified source)
    let hadithData = await fetchFromSunnahAPI(collection, number);
    
    // 3. Fallback to gading.dev
    if (!hadithData?.arabic) {
      hadithData = await fetchFromGadingAPI(collection, number);
      if (hadithData) source = 'gading.dev';
    } else if (!sindhiText) {
      source = 'sunnah.com';
    }
    
    if (!hadithData) {
      return NextResponse.json(
        { error: "Hadith not found" },
        { status: 404 }
      );
    }

    // 4. Generate Sindhi if not available locally
    if (!sindhiText && hadithData.english) {
      sindhiText = await translateToSindhi(hadithData.english);
      source = 'machine:en-sd';
    }

    return NextResponse.json(
      {
        collection,
        number,
        arabic: hadithData.arabic,
        english: hadithData.english,
        sindhi: sindhiText || null,
        meta: { 
          source,
          note: source === 'local' 
            ? 'مقامي تصديق ٿيل ترجمو' 
            : source === 'sunnah.com'
            ? 'Verified from Sunnah.com'
            : source === 'machine:en-sd'
            ? 'انگريزي مان مشيني ترجمو'
            : 'Machine translation'
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
