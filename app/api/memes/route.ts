import { NextRequest, NextResponse } from 'next/server';
import { getAllMemes } from '@/lib/memoryStore';

// GET: 모든 밈 조회
export async function GET() {
  try {
    const memes = getAllMemes();
    return NextResponse.json(memes);
  } catch (error) {
    console.error('밈 조회 오류:', error);
    return NextResponse.json(
      { error: '밈을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새로운 밈 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addMeme } = await import('@/lib/memoryStore');
    
    const { title, description, imageUrl, videoUrl, year, month, examples, tags, source, editor } = body;

    // 필수 필드 검증 (제목만)
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: '제목은 필수 항목입니다.' },
        { status: 400 }
      );
    }

    const newMeme = addMeme({
      title: title.trim(),
      description: description?.trim() || '설명 없음',
      imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
      videoUrl: videoUrl || '',
      year: Number(year) || new Date().getFullYear(),
      month: Number(month) || new Date().getMonth() + 1,
      examples: examples || [],
      tags: tags || [],
      source: source || '',
      editHistory: [
        {
          editor: editor || '익명',
          editedAt: new Date(),
          changes: '최초 생성',
        },
      ],
    });

    return NextResponse.json(newMeme, { status: 201 });
  } catch (error) {
    console.error('밈 추가 오류:', error);
    return NextResponse.json(
      { error: '밈을 추가하는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

