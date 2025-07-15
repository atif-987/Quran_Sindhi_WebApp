import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://quransindhitarjumo.vercel.app';

  const staticRoutes = [''];
  const surahRoutes = Array.from({ length: 114 }, (_, i) => `/${i + 1}`);
  const allRoutes = [...staticRoutes, ...surahRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
