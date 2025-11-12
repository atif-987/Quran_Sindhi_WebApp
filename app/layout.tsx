import './globals.css';
import { Analytics } from "@vercel/analytics/next";
import CustomMetaTags from './components/CustomMetaTags';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Header from './components/Header';
import Footer from './components/Footer';
export const metadata = {
  title: {
    default: 'قرآن پاڪ سنڌي ترجمو | Quran Sindhi Translation',
    template: '%s | قرآن پاڪ سنڌي ترجمو',
  },
  description: 'قرآن پاڪ جو سنڌي ترجمو - 114 سورتون، 30 پارا، احاديث. آسان رسائي، پڙهڻ، سمجھڻ ۽ روحاني لاڳاپي لاءِ بهترين اوزار. Quran Sindhi Translation with all 114 Surahs and 30 Juz.',
  keywords: [
    'قرآن پاڪ سنڌي ترجمو',
    'قرآن پاڪ سنڌي',
    'quransindhitarjumo',
    'Quran Sindhi',
    'Sindhi Tarjumo',
    'Sindhi Quran Translation',
    'Quran in Sindhi',
    'Quran Sindhi online',
    'Read Quran Sindhi',
    'Sindhi Tafsir',
    'سنڌي تفسير',
    'قرآن سنڌي ايپ',
    'Quran Pak Sindhi',
    'قرآن مجيد سنڌي',
    'Sindhi Islamic',
    'پارا سنڌي',
    'سورت سنڌي',
  ],
  authors: [{ name: 'Quran Sindhi Team' }],
  creator: 'Quran Sindhi Tarjumo',
  publisher: 'Quran Sindhi Tarjumo',
  metadataBase: new URL('https://quransindhitarjumo.vercel.app'),
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://quransindhitarjumo.vercel.app',
  },

  icons: {
    icon: '/android-chrome-512x512.png',
    shortcut: '/android-chrome-512x512.png',
    apple: '/android-chrome-512x512.png',
  },

  manifest: '/manifest.json',

  openGraph: {
    title: 'قرآن پاڪ سنڌي ترجمو | Quran Sindhi Translation',
    description: 'سنڌي ٻوليءَ ۾ قرآن پاڪ جو مڪمل ترجمو، 114 سورتون، 30 پارا، احاديث. صاف ۽ آسان انٽرفيس سان. پڙهو، ڳولا ڪريو، روحانيت ڳولهيو.',
    url: 'https://quransindhitarjumo.vercel.app',
    siteName: 'Quran Sindhi Tarjumo | قرآن سنڌي ترجمو',
    locale: 'sd_PK',
    type: 'website',
    images: [
      {
        url: 'https://quransindhitarjumo.vercel.app/preview.jpg',
        width: 2048,
        height: 2048,
        alt: 'قرآن پاڪ سنڌي ترجمو - Quran Sindhi Translation',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'قرآن پاڪ سنڌي ترجمو | Quran Sindhi Translation',
    description: 'سنڌي ٻوليءَ ۾ قرآن پاڪ جو ترجمو، 114 سورتون، 30 پارا. صاف ۽ آسان انٽرفيس سان. پڙهو، ڳولا ڪريو، روحانيت ڳولهيو.',
    images: [
      {
        url: 'https://quransindhitarjumo.vercel.app/preview.jpg',
        width: 2048,
        height: 2048,
        alt: 'قرآن پاڪ سنڌي ترجمو - Quran Sindhi Translation',
        type: 'image/jpeg',
      },
    ],
  },

  verification: {
    google: '26LIxcPY6P7po0dtbD9Mr0MrDUQg8QnNGG7U-EA2w9k',
  },

  other: {
    'facebook-domain-verification': '713379274794542',
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'قرآن پاڪ سنڌي ترجمو | Quran Sindhi Translation',
    alternateName: ['Quran Sindhi Tarjumo', 'quransindhitarjumo'],
    url: 'https://quransindhitarjumo.vercel.app',
    description: 'قرآن پاڪ جو سنڌي ترجمو - 114 سورتون، 30 پارا، احاديث. Complete Quran translation in Sindhi language with all 114 Surahs and 30 Juz.',
    inLanguage: ['sd', 'ur', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://quransindhitarjumo.vercel.app/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Quran Sindhi Tarjumo',
      url: 'https://quransindhitarjumo.vercel.app',
    },
  };

  return (
    <html lang="sd">
      <head>
        <CustomMetaTags />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full mx-auto">
          {children}
          <Analytics />
          <SpeedInsights />

        </main>
        <Footer />
      </body>
    </html>
  );
}
