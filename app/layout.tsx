import './globals.css';
import DarkModeToggle from './components/DarkModeToggle';
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: 'قرآن سنڌي ترجمو',
  description: 'Quran Translation in Sindhi Language',
  openGraph: {
    title: 'قرآن سنڌي ترجمو',
    description: 'Quran Translation in Sindhi',
    url: 'https://quransindhitarjumo.vercel.app',
    siteName: 'Quran Sindhi Tarjumo',
    images: [
      {
        url: '/favicon.ico',
        width: 48,
        height: 48,
        alt: 'Quran Icon',
      },
    ],
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="pKzy76IAiZ2GCIzwkzUZXkv6k9mhGhtluVnJt-ZOGXE" />
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
