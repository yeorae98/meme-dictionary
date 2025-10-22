'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import ReactMarkdown from 'react-markdown';

export default function MemePage() {
  const params = useParams();
  const router = useRouter();
  const [meme, setMeme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMeme();
    }
  }, [params.id]);

  const fetchMeme = async () => {
    try {
      const response = await fetch(`/api/memes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setMeme(data);
      } else {
        alert('밈을 찾을 수 없습니다.');
        router.push('/');
      }
    } catch (error) {
      console.error('밈 로드 오류:', error);
      alert('밈을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 밈을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/memes/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('밈이 삭제되었습니다.');
        // 홈페이지로 리다이렉트하면서 강제 새로고침
        window.location.href = '/';
      } else {
        alert('밈 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('밈 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">밈을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
          >
            ← 목록으로 돌아가기
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/edit/${meme._id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ✏️ 편집
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              🗑️ 삭제
            </button>
          </div>
        </div>

        {/* 메인 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* 이미지 */}
          <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-700">
            <Image
              src={meme.imageUrl}
              alt={meme.title}
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-meme.png';
              }}
            />
          </div>

          {/* 내용 */}
          <div className="p-8">
            {/* 제목 및 날짜 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {meme.year}년 {meme.month}월
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {meme.title}
              </h1>
            </div>

            {/* 설명 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                📝 설명
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{meme.description}</ReactMarkdown>
              </div>
            </div>

            {/* 원본 영상 링크 */}
            {meme.videoUrl && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  🎬 원본 영상
                </h2>
                <a
                  href={meme.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {meme.videoUrl}
                </a>
              </div>
            )}

            {/* 사용 예시 */}
            {meme.examples && meme.examples.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  💬 사용 예시
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {meme.examples.map((example: string, index: number) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 출처 */}
            {meme.source && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  🔗 출처
                </h2>
                <a
                  href={meme.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {meme.source}
                </a>
              </div>
            )}

            {/* 태그 */}
            {meme.tags && meme.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  🏷️ 태그
                </h2>
                <div className="flex flex-wrap gap-2">
                  {meme.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 편집 이력 */}
            {meme.editHistory && meme.editHistory.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  📜 편집 이력
                </h2>
                <div className="space-y-3">
                  {meme.editHistory.slice().reverse().map((edit: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {edit.editor}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {new Date(edit.editedAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{edit.changes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

