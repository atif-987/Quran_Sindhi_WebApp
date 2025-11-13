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
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-blue-200/50 dark:border-yellow-500/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6">
        <div className="flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4" dir="rtl">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/" className="inline-flex items-center gap-2 group" onClick={closeMenu}>
              <span 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 dark:from-yellow-300 dark:to-yellow-500 whitespace-nowrap drop-shadow-sm hover:scale-105 transition-transform duration-200"
                style={{ fontFamily: "'Lateef', serif" }}
              >
                قرآن سنڌي ترجمو
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-semibold" style={{ fontFamily: "'Lateef', serif" }}>
              <Link href="/" className="px-3 py-1.5 rounded-lg text-gray-700 hover:text-blue-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-yellow-300 dark:hover:bg-gray-800/50 transition-all duration-200" onClick={closeMenu}>
                گهر
              </Link>
              {/* <Link href="/juz" className="px-3 py-1.5 rounded-lg text-gray-700 hover:text-blue-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-yellow-300 dark:hover:bg-gray-800/50 transition-all duration-200" onClick={closeMenu}>
                پارا
              </Link>
              <Link href="/hadith" className="px-3 py-1.5 rounded-lg text-gray-700 hover:text-blue-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-yellow-300 dark:hover:bg-gray-800/50 transition-all duration-200" onClick={closeMenu}>
                حديث
              </Link> */}
              {lastReadSurah ? (
                <Link href={`/${lastReadSurah}`} className="px-3 py-1.5 rounded-lg text-gray-700 hover:text-blue-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-yellow-300 dark:hover:bg-gray-800/50 transition-all duration-200" onClick={closeMenu}>
                  آخري پڙهيل
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded-lg text-gray-400 dark:text-gray-600 cursor-not-allowed" aria-disabled="true">
                  آخري پڙهيل
                </span>
              )}
            </nav>

            <DarkModeToggle />

            <button
              type="button"
              aria-label="Toggle menu"
              className="md:hidden inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg border border-blue-300/50 dark:border-yellow-500/30 bg-blue-50/50 dark:bg-gray-800/50 text-blue-700 dark:text-yellow-300 hover:bg-blue-100 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-yellow-400 transition-all duration-200 shadow-sm"
              onClick={() => setIsOpen((v) => !v)}
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-3 animate-in slide-in-from-top-2 duration-200" dir="rtl">
            <nav className="flex flex-col gap-2 text-base font-semibold" style={{ fontFamily: "'Lateef', serif" }}>
              <Link href="/" className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-gray-800/70 dark:to-gray-800/50 border border-blue-200/50 dark:border-gray-700 text-blue-700 dark:text-yellow-300 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 shadow-sm" onClick={closeMenu}>
                گهر
              </Link>
              {/* <Link href="/juz" className="px-4 py-2.5 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-700 hover:bg-blue-50 dark:hover:text-yellow-300 dark:hover:bg-gray-800 transition-all duration-200" onClick={closeMenu}>
                پارا
              </Link>
              <Link href="/hadith" className="px-4 py-2.5 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-700 hover:bg-blue-50 dark:hover:text-yellow-300 dark:hover:bg-gray-800 transition-all duration-200" onClick={closeMenu}>
                حديث
              </Link> */}
              {lastReadSurah ? (
                <Link href={`/${lastReadSurah}`} className="px-4 py-2.5 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-700 hover:bg-blue-50 dark:hover:text-yellow-300 dark:hover:bg-gray-800 transition-all duration-200" onClick={closeMenu}>
                  آخري پڙهيل
                </Link>
              ) : (
                <span className="px-4 py-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 bg-gray-50/30 dark:bg-gray-900/30" aria-disabled="true">
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


