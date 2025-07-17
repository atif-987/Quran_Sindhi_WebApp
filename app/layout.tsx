import './globals.css';
import DarkModeToggle from './components/DarkModeToggle';
import { Analytics } from "@vercel/analytics/next";
import CustomMetaTags from './components/CustomMetaTags';

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

  other: {
    'google-site-verification': '26LIxcPY6P7po0dtbD9Mr0MrDUQg8QnNGG7U-EA2w9k',
    'fb:app_id': '713379274794542', 
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
      <body className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
        <header className="w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm py-4 px-6 flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-blue-700">قرآن سنڌي ترجمو</span>
          </div>
          <DarkModeToggle />
        </header>
        <main className="flex-1 w-full mx-auto">
          {children}
          <Analytics />
        </main>
        <footer className="w-full bg-white/80 backdrop-blur border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Quranic Sindhi Tarjumo. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
