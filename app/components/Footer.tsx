import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 w-full border-t border-blue-200/50 dark:border-yellow-500/20 bg-gradient-to-b from-white/95 to-blue-50/30 dark:from-gray-900/95 dark:to-gray-900/60 backdrop-blur-xl shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 
              className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 dark:from-yellow-300 dark:to-yellow-500 drop-shadow-sm"
              style={{ fontFamily: "'Lateef', serif" }}
            >
              قرآن سنڌي ترجمو
            </h3>
            <p 
              className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
              style={{ fontFamily: "'Lateef', serif" }}
            >
              سنڌي ٻوليءَ ۾ قرآن پاڪ جو صاف ۽ آسان ترجمو. پڙهو، ڳولا ڪريو، ۽ روحانيت سان لاڳاپو مضبوط ڪريو.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>114 سورتون • 30 پارا</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 
              className="text-base font-bold text-blue-700 dark:text-yellow-300"
              style={{ fontFamily: "'Lateef', serif" }}
            >
              جلدي لنڪس
            </h3>
            <ul className="space-y-2.5 text-sm" style={{ fontFamily: "'Lateef', serif" }}>
              <li>
                <Link href="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-all duration-200 hover:translate-x-1">
                  <span className="text-blue-600 dark:text-yellow-400">←</span>
                  گهر
                </Link>
              </li>
              {/* <li>
                <Link href="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-all duration-200 hover:translate-x-1">
                  <span className="text-blue-600 dark:text-yellow-400">←</span>
                  سورتن جي فهرست
                </Link>
              </li>
              <li>
                <Link href="/juz" className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-all duration-200 hover:translate-x-1">
                  <span className="text-blue-600 dark:text-yellow-400">←</span>
                  پارن جي فهرست
                </Link>
              </li> */}
              <li>
                {/* <Link href="/hadith" className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-all duration-200 hover:translate-x-1">
                  <span className="text-blue-600 dark:text-yellow-400">←</span>
                  احاديث
                </Link> */}
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-3">
            <h3 
              className="text-base font-bold text-blue-700 dark:text-yellow-300"
              style={{ fontFamily: "'Lateef', serif" }}
            >
              حمايت
            </h3>
            <ul className="space-y-2.5 text-sm" style={{ fontFamily: "'Lateef', serif" }}>
              <li>
                <a 
                  href="mailto:dmohammadatif@gmail.com" 
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-all duration-200 hover:translate-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  رابطو ڪريو
                </a>
              </li>
            </ul>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                © {new Date().getFullYear()} Quran Sindhi Tarjumo
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Made with ❤️ for the Sindhi community
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


