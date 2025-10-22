import { NextRequest, NextResponse } from 'next/server';
import { searchMemes } from '@/lib/memoryStore';

// GET: 밈 검색
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    const memes = searchMemes(query);
    return NextResponse.json(memes);
  } catch (error) {
    console.error('검색 오류:', error);
    return NextResponse.json(
      { error: '검색에 실패했습니다.' },
      { status: 500 }
    );
  }
}

