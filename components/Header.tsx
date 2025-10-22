'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🎭</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              밈 백과사전
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition ${
                pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              홈
            </Link>
            <Link
              href="/add"
              className={`px-4 py-2 rounded-lg transition ${
                pathname === '/add'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              밈 추가
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg transition ${
                pathname === '/about'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              소개
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

