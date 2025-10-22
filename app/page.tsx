'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import YearMonthList from '@/components/YearMonthList';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';

interface MemesByYearMonth {
  [year: number]: {
    [month: number]: any[];
  };
}

export default function Home() {
  const [memes, setMemes] = useState<any[]>([]);
  const [groupedMemes, setGroupedMemes] = useState<MemesByYearMonth>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await fetch('/api/memes');
      const data = await response.json();
      setMemes(data);
      groupMemesByYearMonth(data);
    } catch (error) {
      console.error('밈 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupMemesByYearMonth = (memesData: any[]) => {
    const grouped: MemesByYearMonth = {};
    
    memesData.forEach((meme) => {
      if (!grouped[meme.year]) {
        grouped[meme.year] = {};
      }
      if (!grouped[meme.year][meme.month]) {
        grouped[meme.year][meme.month] = [];
      }
      grouped[meme.year][meme.month].push(meme);
    });

    setGroupedMemes(grouped);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      groupMemesByYearMonth(memes);
      return;
    }

    try {
      const response = await fetch(`/api/memes/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      groupMemesByYearMonth(data);
    } catch (error) {
      console.error('검색에 실패했습니다:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎭 밈 백과사전
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            현재까지의 인터넷 밈을 한눈에
          </p>
          
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">밈 데이터를 불러오는 중...</p>
          </div>
        ) : Object.keys(groupedMemes).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
              {searchQuery ? '검색 결과가 없습니다' : '아직 등록된 밈이 없습니다'}
            </p>
            <Link
              href="/add"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              첫 번째 밈 추가하기
            </Link>
          </div>
        ) : (
          <YearMonthList groupedMemes={groupedMemes} />
        )}

        <div className="mt-8 text-center">
          <Link
            href="/add"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition font-semibold text-lg"
          >
            <span>➕</span>
            새로운 밈 추가하기
          </Link>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-300">
          <p>© 2025 밈 백과사전. 모두가 편집할 수 있는 인터넷 밈 아카이브</p>
          <p className="mt-2 text-sm">
            누구나 자유롭게 밈을 추가하고 편집할 수 있습니다
          </p>
        </div>
      </footer>
    </div>
  );
}

