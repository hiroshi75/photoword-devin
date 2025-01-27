import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateWords } from '@/lib/word-generation';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { photoId, imageDescription } = await request.json();

    if (!photoId || !imageDescription) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    // 単語を生成
    const generatedWords = await generateWords(imageDescription);

    // データベースに保存
    const words = await Promise.all(
      generatedWords.map(async (word) => {
        return prisma.word.create({
          data: {
            photoId,
            spanish: word.spanish,
            japanese: word.japanese,
            example: word.example,
            partOfSpeech: word.partOfSpeech,
          },
        });
      })
    );

    return NextResponse.json({ 
      success: true,
      words
    });
  } catch (error) {
    console.error('Word generation error:', error);
    return NextResponse.json(
      { error: '単語の生成に失敗しました' },
      { status: 500 }
    );
  }
}
