import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quransindhitarjumo.vercel.app';
  const currentDate = new Date().toISOString();

  // Main pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hadith`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // All 114 Surahs
  const surahRoutes: MetadataRoute.Sitemap = Array.from({ length: 114 }, (_, i) => ({
    url: `${baseUrl}/${i + 1}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // All 30 Juz
  const juzRoutes: MetadataRoute.Sitemap = Array.from({ length: 30 }, (_, i) => ({
    url: `${baseUrl}/juz/${i + 1}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Hadith collections
  const hadithRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/hadith/bukhari`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...surahRoutes, ...juzRoutes, ...hadithRoutes];
}
