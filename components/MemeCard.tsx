'use client';

import Link from 'next/link';
import Image from 'next/image';

interface MemeCardProps {
  meme: {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    tags: string[];
    year: number;
    month: number;
  };
}

export default function MemeCard({ meme }: MemeCardProps) {
  return (
    <Link href={`/meme/${meme._id}`}>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-blue-400">
        <div className="flex gap-4">
          {/* 이미지 */}
          <div className="flex-shrink-0 relative w-32 h-32 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600">
            {meme.imageUrl ? (
              <Image
                src={meme.imageUrl}
                alt={meme.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-meme.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🎭
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
              {meme.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {meme.description}
            </p>
            
            {/* 태그 */}
            {meme.tags && meme.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {meme.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {meme.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    +{meme.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* 비디오 링크 표시 */}
            {meme.videoUrl && (
              <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                <span>🎬</span>
                <span>원본 영상 있음</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

