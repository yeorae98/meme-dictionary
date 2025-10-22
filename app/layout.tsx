import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '밈 백과사전 - 연도별 밈 아카이브',
  description: '2000년부터 현재까지의 인터넷 밈을 연도별, 월별로 정리한 백과사전',
  keywords: '밈, 인터넷밈, 밈백과사전, 밈아카이브, meme, internet meme',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

