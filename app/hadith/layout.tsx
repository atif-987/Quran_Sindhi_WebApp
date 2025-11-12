import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'احاديث مجموعا | قرآن پاڪ سنڌي ترجمو',
  description: 'احاديث شريف جا مجموعا سنڌي ترجمي سان. صحيح بخاري ۽ ٻيا احاديث جا مجموعا. Hadith collections in Sindhi language including Sahih Bukhari.',
  openGraph: {
    title: 'احاديث مجموعا | Hadith Collections',
    description: 'احاديث شريف جا مجموعا سنڌي ترجمي سان. Hadith collections in Sindhi.',
    url: 'https://quransindhitarjumo.vercel.app/hadith',
  },
  alternates: {
    canonical: 'https://quransindhitarjumo.vercel.app/hadith',
  },
};

export default function HadithLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
