// app/api/hadith/[collection]/[number]/route.ts
import { NextRequest, NextResponse } from "next/server";

const SOURCE_BASE = "https://api.hadith.gading.dev";

function sanitizeSindhiText(input: string): string {
  let s = input || "";
  // Remove Devanagari characters (Hindi/Marathi range)
  s = s.replace(/[\u0900-\u097F]+/g, "");
  // Normalize HTML entities
  s = s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  // Collapse 4+ repeats of the same token to at most 2-3
  s = s.replace(/(\b\S+)(?:\s+\1){3,}/g, "$1 $1 $1");
  // Collapse multiple punctuation (adjacent) and spaced comma runs like ", , ,"
  s = s.replace(/[،,.!؟]{2,}/g, (m) => m[0]);
  s = s.replace(/(?:[،,]\s*){2,}/g, '، ');
  // Remove stray standalone commas (not between words)
  s = s.replace(/(^|\s)[،,](?=\s|$)/g, ' ');
  // Normalize spaces
  s = s.replace(/\s{2,}/g, " ");
  return s.trim();
}

function scoreQuality(text: string): number {
  if (!text) return 0;
  let score = 1.0;
  // Penalize Devanagari leakage
  if (/[\u0900-\u097F]/.test(text)) score -= 0.5;
  // Penalize extreme repetition
  if (/(\b\S+)(?:\s+\1){4,}/.test(text)) score -= 0.3;
  // Penalize long comma runs
  if (/(?:[،,]\s*){4,}/.test(text)) score -= 0.2;
  // Clamp
  if (score < 0) score = 0;
  return score;
}

// Open translation API (dynamic) — MyMemory with safe chunking (<= 450 chars per request)
async function translateWithMyMemory(text: string): Promise<string | null> {
  try {
    if (!text) return null;

    const MAX_QUERY = 450; // under MyMemory 500-char limit

    const splitIntoSentences = (input: string): string[] => {
      const parts = input.split(/([.!؟!؟?\n])/);
      const sentences: string[] = [];
      for (let i = 0; i < parts.length; i += 2) {
        const chunk = (parts[i] || "").trim();
        const punct = parts[i + 1] || "";
        const sentence = (chunk + punct).trim();
        if (sentence) sentences.push(sentence);
      }
      return sentences.length ? sentences : [input];
    };

    const chunkByLimit = (str: string, limit: number): string[] => {
      if (str.length <= limit) return [str];
      const words = str.split(/\s+/);
      const chunks: string[] = [];
      let current = "";
      for (const w of words) {
        if ((current + (current ? " " : "") + w).length > limit) {
          if (current) chunks.push(current);
          if (w.length > limit) {
            // hard-split very long tokens
            for (let i = 0; i < w.length; i += limit) {
              chunks.push(w.slice(i, i + limit));
            }
            current = "";
          } else {
            current = w;
          }
        } else {
          current = current ? current + " " + w : w;
        }
      }
      if (current) chunks.push(current);
      return chunks;
    };

    const sentences = splitIntoSentences(text);
    const queryChunks = sentences.flatMap((s) => chunkByLimit(s, MAX_QUERY));

    const translations: string[] = [];
    for (const chunk of queryChunks) {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=ar|sd&onlyprivate=0&mt=1`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        translations.push("");
        continue;
      }
      const data = await res.json();
      let out: string = data?.responseData?.translatedText || "";
      out = sanitizeSindhiText(out);
      translations.push(out);
    }

    return sanitizeSindhiText(translations.join(" "));
  } catch (err) {
    console.error("Translation error:", err);
    return null;
  }
}

// Open translation API (dynamic) — LibreTranslate public instances (mirror fallback) with chunking
async function translateWithLibre(text: string): Promise<string | null> {
  try {
    if (!text) return null;
    const endpoints = [
      "https://libretranslate.de/translate",
      "https://translate.argosopentech.com/translate",
    ];
    const MAX_QUERY = 800; // be conservative for Libre
    const chunkByLimit = (str: string, limit: number): string[] => {
      if (str.length <= limit) return [str];
      const words = str.split(/\s+/);
      const chunks: string[] = [];
      let current = "";
      for (const w of words) {
        if ((current + (current ? " " : "") + w).length > limit) {
          if (current) chunks.push(current);
          current = w.length > limit ? w.slice(0, limit) : w;
        } else {
          current = current ? current + " " + w : w;
        }
      }
      if (current) chunks.push(current);
      return chunks;
    };

    const chunks = chunkByLimit(text, MAX_QUERY);
    for (const ep of endpoints) {
      const outParts: string[] = [];
      let ok = true;
      for (const ch of chunks) {
        try {
          const res = await fetch(ep, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: ch, source: "ar", target: "sd", format: "text" }),
            cache: "no-store",
          });
          if (!res.ok) { ok = false; break; }
          const data = await res.json();
          const part: string = data?.translatedText || "";
          outParts.push(part);
        } catch { ok = false; break; }
      }
      if (ok && outParts.length) return sanitizeSindhiText(outParts.join(" "));
    }
    return null;
  } catch (err) {
    console.error("LibreTranslate error:", err);
    return null;
  }
}

// Generic MyMemory translator with arbitrary language pair and safe chunking
async function translateMyMemoryGeneric(text: string, from: string, to: string): Promise<string | null> {
  try {
    if (!text) return null;
    const MAX_QUERY = 450;
    const chunkByLimit = (str: string, limit: number): string[] => {
      if (str.length <= limit) return [str];
      const words = str.split(/\s+/);
      const chunks: string[] = [];
      let current = "";
      for (const w of words) {
        if ((current + (current ? " " : "") + w).length > limit) {
          if (current) chunks.push(current);
          if (w.length > limit) {
            for (let i = 0; i < w.length; i += limit) chunks.push(w.slice(i, i + limit));
            current = "";
          } else {
            current = w;
          }
        } else {
          current = current ? current + " " + w : w;
        }
      }
      if (current) chunks.push(current);
      return chunks;
    };

    const chunks = chunkByLimit(text, MAX_QUERY);
    const outputs: string[] = [];
    for (const ch of chunks) {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(ch)}&langpair=${from}|${to}&onlyprivate=0&mt=1`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      outputs.push(data?.responseData?.translatedText || "");
    }
    const out = sanitizeSindhiText(outputs.join(' '));
    return out || null;
  } catch {
    return null;
  }
}

async function translatePivotViaMyMemory(text: string, midLang: 'ur' | 'en'): Promise<string | null> {
  try {
    const toMid = await translateMyMemoryGeneric(text.replace(/\s+/g, ' ').trim(), 'ar', midLang);
    if (!toMid) return null;
    const out = await translateMyMemoryGeneric(toMid, midLang, 'sd');
    return out || null;
  } catch (e) {
    console.error('Pivot translation error:', e);
    return null;
  }
}

// Unofficial Google translate fallback with chunking
async function translateWithGoogle(text: string, from: string, to: string): Promise<string | null> {
  try {
    if (!text) return null;
    const MAX_QUERY = 800;
    const chunkByLimit = (s: string): string[] => {
      if (s.length <= MAX_QUERY) return [s];
      const words = s.split(/\s+/);
      const parts: string[] = [];
      let cur = '';
      for (const w of words) {
        if ((cur + (cur ? ' ' : '') + w).length > MAX_QUERY) {
          if (cur) parts.push(cur);
          cur = w;
        } else {
          cur = cur ? cur + ' ' + w : w;
        }
      }
      if (cur) parts.push(cur);
      return parts;
    };
    const chunks = chunkByLimit(text);
    const outputs: string[] = [];
    for (const ch of chunks) {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(ch)}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      const segment = Array.isArray(data) && Array.isArray(data[0]) ? data[0].map((r: string[]) => r[0]).join(' ') : '';
      outputs.push(segment || '');
    }
    const out = sanitizeSindhiText(outputs.join(' '));
    return out || null;
  } catch {
    return null;
  }
}

// Try to get Urdu hadith text from configurable API; else generate via MyMemory (ar->ur)
async function getUrduHadith(
  collection: string,
  number: string,
  arabicText: string
): Promise<{ urdu: string | null; source: 'authoritative-ur' | 'machine:ur' | null }> {
  try {
    const template = process.env.URDU_HADITH_API_URL_TEMPLATE;
    if (template && !/(^|\W)provider(\W|$)/i.test(template)) {
      const url = template
        .replace('{collection}', encodeURIComponent(collection))
        .replace('{number}', encodeURIComponent(number));
      const headers: Record<string, string> = {};
      const authHeader = process.env.URDU_HADITH_API_AUTH_HEADER;
      if (authHeader) {
        const [key, ...rest] = authHeader.split(':');
        if (key && rest.length > 0) headers[key.trim()] = rest.join(':').trim();
      }
      const res = await fetch(url, { headers, cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const text: string | undefined = data?.text || data?.urdu;
        if (text) return { urdu: text, source: 'authoritative-ur' };
      }
    }
  } catch (e) {
    console.error('Urdu hadith fetch error:', e);
  }
  try {
    if (arabicText && arabicText !== 'Not found') {
      const ur = await translateMyMemoryGeneric(arabicText, 'ar', 'ur');
      if (ur) return { urdu: ur, source: 'machine:ur' };
    }
  } catch {}
  return { urdu: null, source: null };
}

// Prefer authoritative/canonical Sindhi translations from a configurable external API
// Configure via env:
//  - SINDHI_HADITH_API_URL_TEMPLATE (e.g. https://example.com/hadith/{collection}/{number})
//  - SINDHI_HADITH_API_AUTH_HEADER (optional, e.g. X-API-Key:token)
async function getAuthoritativeSindhi(
  collection: string,
  number: string,
  req: NextRequest
): Promise<string | null> {
  try {
    const template = process.env.SINDHI_HADITH_API_URL_TEMPLATE;
    if (!template) return null;
    // Skip placeholder provider to avoid DNS errors
    if (/(^|\W)provider(\W|$)/i.test(template)) return null;

    const url = template
      .replace("{collection}", encodeURIComponent(collection))
      .replace("{number}", encodeURIComponent(number));

    const headers: Record<string, string> = {};
    const authHeader = process.env.SINDHI_HADITH_API_AUTH_HEADER;
    if (authHeader) {
      const [key, ...rest] = authHeader.split(":");
      if (key && rest.length > 0) headers[key.trim()] = rest.join(":").trim();
    }

    // Forward minimal context headers if needed
    if (req.headers.get("x-request-id")) {
      headers["x-request-id"] = req.headers.get("x-request-id") as string;
    }

    const res = await fetch(url, { headers, next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null;
    const data = await res.json();

    // Flexible field mapping: accept {text} or {sindhi}
    const text: string | undefined = data?.text || data?.sindhi;
    return text || null;
  } catch (err) {
    console.error("Authoritative Sindhi fetch error:", err);
    return null;
  }
}



export async function GET(
  req: NextRequest,
  { params }: { params: { collection: string; number: string } }
) {
  try {
    // Fetch Arabic Hadith
    const hadithRes = await fetch(`${SOURCE_BASE}/books/${params.collection}/${params.number}`);
    const hadithData = await hadithRes.json();

    const arabicText: string = hadithData?.data?.contents?.arab || "Not found";

    // Try authoritative Sindhi API first (accurate by scholar)
    let sindhiText: string | null = await getAuthoritativeSindhi(
      params.collection,
      params.number,
      req
    );
    let urduText: string | null = null;

    // Then try curated local Sindhi translations (repository JSON)
    try {
      if (!sindhiText) {
        const url = new URL(req.url);
        const base = `${url.protocol}//${url.host}`;
        const localJsonUrl = `${base}/hadith/sindhi/${params.collection}.json`;
        const localRes = await fetch(localJsonUrl);
        if (localRes.ok) {
          const localData = await localRes.json();
          const items: Array<{ hadithnumber: string; text: string }> = localData?.hadiths || [];
          const matched = items.find((h) => String(h.hadithnumber) === String(params.number));
          if (matched?.text) {
            sindhiText = matched.text;
          }
        }
      }
    } catch {
      // ignore local fetch errors and fall back to MT
    }

    // As a last resort, ensure dynamic Sindhi via open MT API if still missing
    let source: 'authoritative' | 'local' | 'machine:libre' | 'machine:mymemory' | 'authoritative-ur' | 'machine:ur' | 'machine:ur-pivot' | 'machine:google' | null = null;
    if (sindhiText) {
      source = process.env.SINDHI_HADITH_API_URL_TEMPLATE ? 'authoritative' : 'local';
    } else if (arabicText && arabicText !== "Not found") {
      // Prefer Urdu first (authoritative or machine), then translate Urdu -> Sindhi
      const urd = await getUrduHadith(params.collection, params.number, arabicText);
      if (urd.urdu) {
        urduText = urd.urdu;
        const sdFromUr = await translateMyMemoryGeneric(urd.urdu, 'ur', 'sd');
        if (sdFromUr) {
          sindhiText = sdFromUr;
          source = urd.source === 'authoritative-ur' ? 'authoritative-ur' : 'machine:ur-pivot';
        }
      }
      // If still missing, fall back to direct ar->sd MT
      if (!sindhiText) {
        const [libre, mymem] = await Promise.all([
          translateWithLibre(arabicText),
          translateWithMyMemory(arabicText),
        ]);
      const scored: Array<{ text: string; engine: 'machine:libre' | 'machine:mymemory'; score: number }> = [];
      if (libre) scored.push({ text: libre, engine: 'machine:libre', score: scoreQuality(libre) });
      if (mymem) scored.push({ text: mymem, engine: 'machine:mymemory', score: scoreQuality(mymem) });
      scored.sort((a, b) => b.score - a.score);
      if (scored[0]) {
        sindhiText = scored[0].text;
        source = scored[0].engine;
      } else {
        // Pivot fallbacks (via MyMemory)
        const pivotUr = await translatePivotViaMyMemory(arabicText, 'ur');
        const pivotEn = !pivotUr ? await translatePivotViaMyMemory(arabicText, 'en') : null;
        if (pivotUr) { sindhiText = pivotUr; source = 'machine:mymemory'; }
        else if (pivotEn) { sindhiText = pivotEn; source = 'machine:mymemory'; }
        // Final emergency: Google (unofficial)
        if (!sindhiText) {
          const gDirect = await translateWithGoogle(arabicText, 'ar', 'sd');
          if (gDirect) { sindhiText = gDirect; source = 'machine:google'; }
        }
        if (!sindhiText) {
          const gPivotEn = await translateWithGoogle(arabicText, 'ar', 'en');
          if (gPivotEn) {
            const gToSd = await translateWithGoogle(gPivotEn, 'en', 'sd');
            if (gToSd) { sindhiText = gToSd; source = 'machine:google'; }
          }
        }
      }
      }
    }

    return NextResponse.json(
      {
        collection: params.collection,
        number: params.number,
        arabic: arabicText,
        sindhi: sindhiText || null,
        urdu: urduText || null,
        meta: { source },
      },
      { headers: { "Cache-Control": "public, max-age=300" } }
    );
  } catch (error) {
    console.error("Hadith fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch Hadith" }, { status: 500 });
  }
}
