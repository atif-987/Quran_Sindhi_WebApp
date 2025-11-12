import './globals.css';
import { Analytics } from "@vercel/analytics/next";
import CustomMetaTags from './components/CustomMetaTags';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Header from './components/Header';
import Footer from './components/Footer';
export const metadata = {
  title: 'قرآن پاڪ سنڌي ترجمو',
  description: 'قرآن پاڪ جو سنڌي ترجمو، هر سورت لاءِ آسان رسائي، پڙهڻ، سمجھڻ ۽ روحاني لاڳاپي لاءِ بهترين اوزار.',
  keywords: [
    'قرآن پاڪ سنڌي ترجمو',
    'قرآن پاڪ سنڌي',
    'Quran Sindhi',
    'Sindhi Tarjumo',
    'Sindhi Quran Translation',
    'Quran in Sindhi',
    'Read Quran',
    'Sindhi Tafsir',
    'سنڌي تفسير',
    'قرآن سنڌي ايپ',
  ],
  metadataBase: new URL('https://quransindhitarjumo.vercel.app'),

  alternates: {
    canonical: 'https://quransindhitarjumo.vercel.app',
  },

  icons: {
    icon: '/android-chrome-512x512.png',
    shortcut: '/android-chrome-512x512.png',
    apple: '/android-chrome-512x512.png',
  },

  openGraph: {
    title: 'قرآن پاڪ سنڌي ترجمو',
    description: 'سنڌي ٻوليءَ ۾ قرآن پاڪ جو مڪمل ترجمو، سورتن جي آسان ڳولا، پڙهڻ ۽ سمجھڻ لاءِ سادي ۽ خوبصورت ترتيب.',
    url: 'https://quransindhitarjumo.vercel.app',
    siteName: 'Quran Sindhi Tarjumo',
    locale: 'sd_PK',
    type: 'website',
    images: [
      {
        url: 'https://quransindhitarjumo.vercel.app/preview.jpg',
        width: 2048,
        height: 2048,
        alt: 'قرآن پاڪ سنڌي ترجمو - پيش منظر',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'قرآن پاڪ سنڌي ترجمو',
    description: 'سنڌي ٻوليءَ ۾ قرآن پاڪ جو ترجمو، صاف ۽ آسان انٽرفيس سان. پڙهو، ڳولا ڪريو، روحانيت ڳولهيو.',
    images: [
      {
        url: 'https://quransindhitarjumo.vercel.app/preview.jpg',
        width: 2048,
        height: 2048,
        alt: 'قرآن پاڪ سنڌي ترجمو - پيش منظر',
        type: 'image/jpeg',
      },
    ],
  },

};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <CustomMetaTags />
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
