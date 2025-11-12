import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://quransindhitarjumo.vercel.app';

  // Main pages
  const staticRoutes = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/hadith', priority: '0.9', changefreq: 'weekly' },
  ];

  // All 114 Surahs
  const surahRoutes = Array.from({ length: 114 }, (_, i) => ({
    url: `/${i + 1}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // All 30 Juz
  const juzRoutes = Array.from({ length: 30 }, (_, i) => ({
    url: `/juz/${i + 1}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // Hadith collections
  const hadithRoutes = [
    { url: '/hadith/bukhari', priority: '0.7', changefreq: 'weekly' },
  ];

  const allRoutes = [...staticRoutes, ...surahRoutes, ...juzRoutes, ...hadithRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
