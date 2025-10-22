import { NextRequest, NextResponse } from 'next/server';
import { getMemeById, updateMeme, deleteMeme } from '@/lib/memoryStore';

// GET: 특정 밈 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meme = getMemeById(params.id);

    if (!meme) {
      return NextResponse.json(
        { error: '밈을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(meme);
  } catch (error) {
    console.error('밈 조회 오류:', error);
    return NextResponse.json(
      { error: '밈을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 밈 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { editor, changes, ...updateData } = body;

    const meme = getMemeById(params.id);

    if (!meme) {
      return NextResponse.json(
        { error: '밈을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 수정 이력 추가
    const editHistory = [...meme.editHistory, {
      editor: editor || '익명',
      editedAt: new Date(),
      changes: changes || '내용 수정',
    }];

    // 데이터 업데이트
    const updatedMeme = updateMeme(params.id, {
      ...updateData,
      editHistory
    });

    return NextResponse.json(updatedMeme);
  } catch (error) {
    console.error('밈 수정 오류:', error);
    return NextResponse.json(
      { error: '밈을 수정하는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 밈 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteMeme(params.id);

    if (!success) {
      return NextResponse.json(
        { error: '밈을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '밈이 삭제되었습니다.' });
  } catch (error) {
    console.error('밈 삭제 오류:', error);
    return NextResponse.json(
      { error: '밈을 삭제하는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

