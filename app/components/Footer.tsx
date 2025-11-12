import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 w-full border-t border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">قرآن سنڌي ترجمو</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              سنڌي ٻوليءَ ۾ قرآن پاڪ جو صاف ۽ آسان ترجمو. پڙهو، ڳولا ڪريو، ۽ روحانيت سان لاڳاپو مضبوط ڪريو.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">جلدي لنڪس</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-colors">
                  گهر
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-colors">
                  سورتن جي فهرست
                </Link>
              </li>
              <li>
                <Link href="/juz" className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-colors">
                  پارن جي فهرست
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">حمايت</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <a href="mailto:dmohammadatif@gmail.com" className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-yellow-300 transition-colors">
                  رابطو ڪريو
                </a>
              </li>
              <li className="text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Quran Sindhi Tarjumo
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}


