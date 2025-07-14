import './globals.css'
import DarkModeToggle from './components/DarkModeToggle';
import { Analytics } from "@vercel/analytics/next"
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>قرآن سنڌي ترجمو</title>
        <meta name="description" content="Quran Translation in Sindhi Language" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:site_name" content="Quran Sindhi Tarjumo" />
        <meta property="og:title" content="قرآن سنڌي ترجمو" />
        <meta property="og:description" content="Quran Translation in Sindhi" />
        <meta property="og:url" content="https://quransindhitarjumo.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
        <header className="w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm py-4 px-6 flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-blue-700">قرآن سنڌي ترجمو</span>
          </div>
          <DarkModeToggle />
        </header>
        <main className="flex-1 w-full mx-auto py-8">
          {children}
          <Analytics />
        </main>
        <footer className="w-full bg-white/80 backdrop-blur border-t border-gray-200 py-3 text-center text-gray-500 text-sm mt-8">
          &copy; {new Date().toDateString()} Quranic Sindhi Tarjumo. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
