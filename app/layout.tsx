import './globals.css'
import DarkModeToggle from './components/DarkModeToggle';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="">
      <body className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
        <header className="w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm py-4 px-6 flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-blue-700">قرآن سنڌي ترجمو</span>
          </div>
          <DarkModeToggle />
        </header>
        <main className="flex-1 w-full  mx-auto  py-8">
          {children}
        </main>
        <footer className="w-full bg-white/80 backdrop-blur border-t border-gray-200 py-3 text-center text-gray-500 text-sm mt-8">
          &copy; {new Date().toDateString()} Quranic Sindhi Tarjumo. All rights reserved.
        </footer>
      </body>
    </html>
  )
}