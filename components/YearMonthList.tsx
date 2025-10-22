'use client';

import { useState } from 'react';
import MemeCard from './MemeCard';

interface MemesByYearMonth {
  [year: number]: {
    [month: number]: any[];
  };
}

interface YearMonthListProps {
  groupedMemes: MemesByYearMonth;
}

export default function YearMonthList({ groupedMemes }: YearMonthListProps) {
  const [expandedYears, setExpandedYears] = useState<{ [key: number]: boolean }>({});
  const [expandedMonths, setExpandedMonths] = useState<{ [key: string]: boolean }>({});

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const toggleMonth = (year: number, month: number) => {
    const key = `${year}-${month}`;
    setExpandedMonths((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const years = Object.keys(groupedMemes)
    .map(Number)
    .sort((a, b) => b - a);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  return (
    <div className="space-y-4">
      {years.map((year) => {
        const isYearExpanded = expandedYears[year];
        const monthsInYear = Object.keys(groupedMemes[year])
          .map(Number)
          .sort((a, b) => a - b);
        
        const totalMemesInYear = monthsInYear.reduce(
          (sum, month) => sum + groupedMemes[year][month].length,
          0
        );

        return (
          <div key={year} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleYear(year)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {isYearExpanded ? '📂' : '📁'}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {year}년
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {totalMemesInYear}개 밈
                </span>
              </div>
              <span className={`text-2xl transition-transform ${isYearExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>

            {isYearExpanded && (
              <div className="px-6 pb-4 space-y-3">
                {monthsInYear.map((month) => {
                  const monthKey = `${year}-${month}`;
                  const isMonthExpanded = expandedMonths[monthKey];
                  const memesInMonth = groupedMemes[year][month];

                  return (
                    <div key={monthKey} className="border-l-4 border-blue-500 ml-4">
                      <button
                        onClick={() => toggleMonth(year, month)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-r-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {isMonthExpanded ? '📖' : '📕'}
                          </span>
                          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {monthNames[month - 1]}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                            {memesInMonth.length}개
                          </span>
                        </div>
                        <span className={`text-lg transition-transform ${isMonthExpanded ? 'rotate-90' : ''}`}>
                          ▶
                        </span>
                      </button>

                      {isMonthExpanded && (
                        <div className="px-4 py-3 space-y-3">
                          {memesInMonth.map((meme) => (
                            <MemeCard key={meme._id} meme={meme} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

