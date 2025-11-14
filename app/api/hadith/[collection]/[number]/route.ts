// app/api/hadith/[collection]/[number]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Hadith APIs
const HADITH_API_BASE = "https://ahadith.co.uk/api";
const HADITHAPI_BASE = "https://hadithapi.com/api"; // Has multiple language support
const SUNNAH_API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions"; // Multi-language hadith API

// Collection name mapping for hadithapi.com
const HADITHAPI_MAP: Record<string, string> = {
  'bukhari': 'sahih-bukhari',
  'muslim': 'sahih-muslim',
  'tirmidhi': 'jami-at-tirmidhi',
  'abudawud': 'sunan-abi-dawud',
  'nasai': 'sunan-an-nasai',
  'ibnmajah': 'sunan-ibn-majah',
  'malik': 'muwatta-malik',
  'ahmad': 'musnad-ahmad'
};

// Collection name mapping for ahadith.co.uk
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



// Try fawazahmed0/hadith-api - comprehensive multi-language support
async function fetchFromFawazHadithAPI(collection: string, number: string): Promise<{
  arabic: string | null;
  sindhi: string | null;
  urdu: string | null;
} | null> {
  try {
    const collectionName = collection.toLowerCase();
    
    // Try Sindhi editions
    const sindhiEditions = ['sin-sindhi', 'snd-sindhi', 'sd-sindhi'];
    let sindhiText: string | null = null;
    
    for (const edition of sindhiEditions) {
      try {
        const url = `${SUNNAH_API}/${edition}/${collectionName}.json`;
        const res = await fetch(url, { cache: 'no-store' });
        
        if (res.ok) {
          const data = await res.json();
          const hadiths = data?.hadiths;
          
          if (Array.isArray(hadiths)) {
            const hadith = hadiths.find((h: any) => h?.hadithnumber === parseInt(number));
            if (hadith?.text) {
              sindhiText = hadith.text;
              break;
            }
          }
        }
      } catch {
        continue;
      }
    }
    
    // Get Arabic
    let arabicText: string | null = null;
    try {
      const arabicUrl = `${SUNNAH_API}/ara-saudarab/${collectionName}.json`;
      const arabicRes = await fetch(arabicUrl, { cache: 'no-store' });
      
      if (arabicRes.ok) {
        const data = await arabicRes.json();
        const hadiths = data?.hadiths;
        
        if (Array.isArray(hadiths)) {
          const hadith = hadiths.find((h: any) => h?.hadithnumber === parseInt(number));
          if (hadith?.text) {
            arabicText = hadith.text;
          }
        }
      }
    } catch {}
    
    // Get Urdu
    let urduText: string | null = null;
    try {
      const urduUrl = `${SUNNAH_API}/urd-hadeesurdu/${collectionName}.json`;
      const urduRes = await fetch(urduUrl, { cache: 'no-store' });
      
      if (urduRes.ok) {
        const data = await urduRes.json();
        const hadiths = data?.hadiths;
        
        if (Array.isArray(hadiths)) {
          const hadith = hadiths.find((h: any) => h?.hadithnumber === parseInt(number));
          if (hadith?.text) {
            urduText = hadith.text;
          }
        }
      }
    } catch {}
    
    if (arabicText || sindhiText || urduText) {
      return { arabic: arabicText, sindhi: sindhiText, urdu: urduText };
    }
  } catch (err) {
    console.error("Fawaz Hadith API error:", err);
  }
  
  return null;
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
    
    let source: 'direct-sindhi' | 'ahadith.co.uk' | 'gading.dev' | 'translated' = 'ahadith.co.uk';
    let sindhiText: string | null = null;
    let arabicText: string | null = null;
    
    // 1. Try fawazahmed0/hadith-api first (has direct Sindhi translations!)
    const fawazData = await fetchFromFawazHadithAPI(collection, number);
    if (fawazData) {
      if (fawazData.arabic) arabicText = fawazData.arabic;
      
      // Check if we got direct Sindhi translation
      if (fawazData.sindhi) {
        sindhiText = fawazData.sindhi;
        source = 'direct-sindhi';
      } else if (fawazData.urdu) {
        // Translate from Urdu if no Sindhi
        sindhiText = await translateUrduToSindhi(fawazData.urdu);
        source = 'translated';
      }
    }
    
    // 2. Fallback to ahadith.co.uk (has Arabic + Urdu)
    if (!arabicText) {
      const ahadithData = await fetchFromAhadithAPI(collection, number);
      if (ahadithData) {
        arabicText = ahadithData.arabic;
        
        if (ahadithData.urdu && !sindhiText) {
          sindhiText = await translateUrduToSindhi(ahadithData.urdu);
          source = 'translated';
        }
      }
    }
    
    // 3. Final fallback to gading.dev (Arabic only)
    if (!arabicText) {
      const gadingData = await fetchFromGadingAPI(collection, number);
      if (gadingData?.arabic) {
        arabicText = gadingData.arabic;
        source = 'gading.dev';
      }
    }
    
    if (!arabicText) {
      return NextResponse.json(
        { error: "Hadith not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        collection,
        number,
        arabic: arabicText,
        sindhi: sindhiText || null,
        meta: { 
          source,
          note: source === 'direct-sindhi'
            ? 'سڌي سنڌي ترجمو - تصديق ٿيل'
            : source === 'ahadith.co.uk'
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
