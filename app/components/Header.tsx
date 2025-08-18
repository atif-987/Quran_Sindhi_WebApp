"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastReadSurah, setLastReadSurah] = useState<number | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem('lastReadSurah')) || null;
    setLastReadSurah(stored);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200/70 dark:border-gray-800/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3" dir="rtl">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 group" onClick={closeMenu}>
              <span className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-yellow-300 dark:to-yellow-500">
                قرآن سنڌي ترجمو
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-colors" onClick={closeMenu}>
                گهر
              </Link>
              <Link href="/hadith" className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-colors" onClick={closeMenu}>
                حديث
              </Link>
              {lastReadSurah ? (
                <Link href={`/${lastReadSurah}`} className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-colors" onClick={closeMenu}>
                  آخري پڙهيل
                </Link>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 cursor-not-allowed" aria-disabled="true">
                  آخري پڙهيل
                </span>
              )}
            </nav>

            <DarkModeToggle />

            <button
              type="button"
              aria-label="Toggle menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen((v) => !v)}
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-3" dir="rtl">
            <nav className="flex flex-col gap-2 text-base font-medium">
              <Link href="/" className="px-3 py-2 rounded-md bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-yellow-300" onClick={closeMenu}>
                گهر
              </Link>
              <Link href="/hadith" className="px-3 py-2 rounded-md bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-yellow-300" onClick={closeMenu}>
                حديث
              </Link>
              {lastReadSurah ? (
                <Link href={`/${lastReadSurah}`} className="px-3 py-2 rounded-md bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-yellow-300" onClick={closeMenu}>
                  آخري پڙهيل
                </Link>
              ) : (
                <span className="px-3 py-2 rounded-md border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500" aria-disabled="true">
                  آخري پڙهيل
                </span>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}


