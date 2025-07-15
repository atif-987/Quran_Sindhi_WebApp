import './globals.css';
import DarkModeToggle from './components/DarkModeToggle';
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: 'قرآن سنڌي ترجمو',
  description: 'Quran Translation in Sindhi Language with easy access to all Surahs, translations, and reading tools.',
  keywords: [
    'Quran Sindhi',
    'Sindhi Tarjumo',
    'قرآن سنڌي ترجمو',
    'Sindhi Quran Translation',
    'Quran in Sindhi',
    'Quran App',
    'Read Quran',
    'Sindhi Tafsir'
  ],
  metadataBase: new URL('https://quransindhitarjumo.vercel.app'),
  alternates: {
    canonical: 'https://quransindhitarjumo.vercel.app',
  },

  openGraph: {
    title: 'قرآن سنڌي ترجمو',
    description: 'Access the Holy Quran with complete Sindhi translation. Read, explore, and connect spiritually.',
    url: 'https://quransindhitarjumo.vercel.app',
    siteName: 'Quran Sindhi Tarjumo',
    images: [
      {
        url: 'https://quransindhitarjumo.vercel.app/preview.jpg',
        width: 1200,
        height: 630,
        alt: 'قرآن سنڌي ترجمو - Icon',
      },
    ],
    locale: 'sd_PK', // better suited for Sindhi
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image', // better preview card
    title: 'قرآن سنڌي ترجمو',
    description: 'Holy Quran translation in Sindhi language with clean UI and reading experience.',
    images: ['https://quransindhitarjumo.vercel.app/preview.jpg'],
    // site and creator optional, remove if unused
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  other: {
    'google-site-verification': '26LIxcPY6P7po0dtbD9Mr0MrDUQg8QnNGG7U-EA2w9k',
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
